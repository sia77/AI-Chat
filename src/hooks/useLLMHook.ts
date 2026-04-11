import { useEffect, useRef, useState } from "react";
import { streamSSE } from "../services/streamSSE";
import type { MediaType, Message, ResponseTypeLLM } from "../shared/types";
import { fetchCompleteData } from "../services/fetchCompleteData";
import { fetchStreamData } from "../services/fetchStreamData";
import { RESPONSE_MODE } from "../shared/constant";

export const useLLMHook = (selectedResponse:ResponseTypeLLM, selectedMediaType:MediaType) => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const stopStreamRef = useRef<(() => void) | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const sseStoppedByUserRef = useRef(false);
    const activeModeRef = useRef<ResponseTypeLLM | null>(null);
    const messagesRef = useRef<Message[]>([]);

    useEffect(()=> {
        messagesRef.current = messages; //It holds a copy of messages as per latest commited render
    }, [messages])

    useEffect(() => {
        return () => {
            if (stopStreamRef.current) {
                stopStreamRef.current();
                stopStreamRef.current = null;
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []);

    const stopAbortController = () => {
        if(abortControllerRef.current){
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);        
        }
        activeModeRef.current = null;
    };


    const appendUserAbortMessage = () => {
        const stoppedMessage: Message = {
            role: "system",
            text: "You stopped this response",
        };

        setMessages((prev) => {
            if (!prev.length) return [stoppedMessage];
            // If partial content exists, keep it and append system message
            return [...prev, stoppedMessage];
        });
    }

    const stopSSE = () => {
        if (!stopStreamRef.current) return;
        
        sseStoppedByUserRef.current = true;
        stopStreamRef.current(); // This calls sse.close() inside the service
        stopStreamRef.current = null;
        setIsLoading(false);
        appendUserAbortMessage();
        activeModeRef.current = null;        
    };

    const handleStop = () => {
        if(activeModeRef.current === RESPONSE_MODE.SSE){
            stopSSE();
            return;
        }
        stopAbortController();
    }

    const isAbortError = (err: unknown): boolean => {
        if (typeof err !== "object" || err === null) return false;

        const maybeErr = err as { name?: unknown; message?: unknown };

        return (
            maybeErr.name === "AbortError" ||
            maybeErr.message === "Aborted"
        );
    };

    const replaceLastWithError = (err:unknown) => { 
        console.log("Error: ", err);

        setMessages((prev: Message[]) => [
            ...prev.slice(0, -1),
            { role: "error", text: "Sorry, I ran into an issue. Please try again." }
        ]);
    };

    const sendStream = async(userPrompt:string) => {
        if(isLoading) return;
        activeModeRef.current = RESPONSE_MODE.STREAM;

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const newMessage:Message = { role:"user", text:userPrompt }
        const botPlaceholder:Message = { role:"model", text:"..." }
        
        setMessages((prev:Message[])=> [...prev, newMessage, botPlaceholder]);            
        
        const localHistory:Message[] = [...messagesRef.current, newMessage ];
        const cleanHistory = localHistory.filter(m => ["user", "model"].includes(m.role));
        setIsLoading(true);

        try{
            const stream = fetchStreamData(
                baseUrl,
                selectedMediaType,
                userPrompt,
                cleanHistory,
                controller.signal
            )

            let buffer = "";

            for await (const chunk of stream) {
                buffer += typeof chunk === "object" && chunk != null ?
                    (chunk as any).text : chunk;
                setMessages(prev =>{
                    const lastIndex = prev.length - 1;

                    if(prev[lastIndex]?.role === "model"){
                        const newArray = [...prev];
                        newArray[lastIndex] = {...prev[lastIndex], text:buffer};
                        return newArray;
                    }
                    
                    //Fallback: if the last message isn't the model, just append
                    return [...prev, { role:"model", text:buffer}];
                }) 
            }

        }catch(err:unknown){

            if(isAbortError(err)){
                console.log("You stopped this response");
                appendUserAbortMessage()
                return;
            }
            replaceLastWithError(err);

        }finally{
            setIsLoading(false);
            abortControllerRef.current = null;
            activeModeRef.current = null;
        }            
    }

    const sendComplete = async(userPrompt:string) => { 
        if(isLoading) return;
        activeModeRef.current = RESPONSE_MODE.COMPLETE;

        const controller = new AbortController();
        abortControllerRef.current = controller;
            
        setIsLoading(true);

        const newMessage:Message = { role:"user", text:userPrompt };
        const botPlaceholder:Message = { role:"model", text:"..." };
        
        setMessages(prev => [...prev, newMessage, botPlaceholder]);
        const localHistory:Message[] = [...messagesRef.current, newMessage];

        const cleanHistory = localHistory.filter(m => ["user", "model"].includes(m.role));
        try{
            const data = await fetchCompleteData(
                baseUrl,
                selectedMediaType,
                userPrompt,
                cleanHistory,
                controller.signal
            );

            const content = typeof data === 'object' && data !== null 
                ? (data as any).text 
                : data;

            if(content){
                setMessages(prev => [...prev.slice(0, -1), {role:"model", text:content} ])
            }
        }catch(err:unknown){
            if(isAbortError(err)){
                console.log("You stopped this response");
                appendUserAbortMessage()
                return;
            }
            replaceLastWithError(err);
        }finally{
            setIsLoading(false);
            abortControllerRef.current = null;
            activeModeRef.current = null;
        }       
    }

    const sendSSE = (userPrompt:string) => {
        if (isLoading) return;
        activeModeRef.current = RESPONSE_MODE.SSE;
        // KILL any existing stream just in case
        if (stopStreamRef.current) {
            stopStreamRef.current();
            stopStreamRef.current = null;
        }
        sseStoppedByUserRef.current = false;
        setIsLoading(true);        
        setMessages(prev => [...prev, {role:"user", text:userPrompt}, {role:"model", text:"..."}]);
        
        //SSE service
        const cleanup = streamSSE(
            baseUrl,
            userPrompt, 
            { 
                onChunk:(text) => {
                    setMessages(prev => {
                        const lastIndex = prev.length - 1;
                        const lastMessage = prev[lastIndex];
                        // If for some reason the placeholder isn't there yet, 
                        // we append a new message instead of trying to edit 'undefined'

                        if(!lastMessage || lastMessage.role !== "model"){
                            return [...prev, { role: "model", text: text }];
                        }

                        const existingContent = lastMessage.text === "..." ? "":lastMessage.text;
                        
                        const updatedMessages = [...prev]

                        updatedMessages[lastIndex] = {
                            ...lastMessage,
                            text:existingContent + text
                        };

                        return updatedMessages;
                    })
                },
                onDone: () => {
                    setIsLoading(false);
                    stopStreamRef.current = null;
                    activeModeRef.current = null;
                    sseStoppedByUserRef.current = false;
                },
                onError: (message) => {
                    setIsLoading(false);
                    stopStreamRef.current = null;
                    activeModeRef.current = null;

                    if(sseStoppedByUserRef.current){
                        sseStoppedByUserRef.current = false;
                        return;
                    }

                    setMessages((prev) => [
                        ...prev.slice(0, -1),
                        { role: "error", text: message ||"Connection lost" },
                    ]);
                }
            }
        );

        // Store it so the "Stop" button can find it
        stopStreamRef.current = cleanup;
    }


    const handleSend = (userPrompt:string) => {
        if( selectedResponse === RESPONSE_MODE.STREAM ){
            void sendStream(userPrompt);
            return;
        }

        if(selectedResponse === RESPONSE_MODE.COMPLETE){
            void sendComplete(userPrompt);
            return;
        }

        sendSSE(userPrompt);
    }


    return { messages, handleSend, handleStop, isLoading }
}