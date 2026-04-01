import { useRef, useState } from "react";
import { streamSSE } from "../services/streamSSE";
import type { MediaType, Message, ResponseTypeLLM } from "../types/types";
import { fetchCompleteData } from "../services/fetchCompleteData";
import { fetchStreamData } from "../services/fetchStreamData";
import { RESPONSE_MODE } from "../constants/constant";

export const useLLMHook = (selectedResponse:ResponseTypeLLM, selectedMediaType:MediaType) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const stopStreamRef = useRef<(() => void) | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const sseStoppedByUserRef = useRef(false);

    const stopAbortController = () => {
        if(abortControllerRef.current){
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);        
        }
    };

    const stopSSE = () => {
        if (stopStreamRef.current) {
            sseStoppedByUserRef.current = true;
            stopStreamRef.current(); // This calls sse.close() inside the service
            stopStreamRef.current = null;
            setIsLoading(false);
        }
    };

    const handleStop = () => {
        if(selectedResponse === RESPONSE_MODE.SSE){
            stopSSE();
            return;
        }
        stopAbortController();
    }

    const isAbortError = (err: unknown): boolean => {
        return (
            typeof err === "object" &&
            err !== null &&
            ("name" in err && err.name === "AbortError" ||
            "message" in err && err.message === "Aborted")
        );
    };

    const appendStoppedMessage = (err:unknown) : boolean => { 

        if(!isAbortError(err)) return false;
        
        console.log("You stopped this response");
        
        setMessages((prev:Message[])=>{
            if (!prev.length) return prev;
            return [...prev, { role:"system", text:"You stopped this response" }];
        });
        return true;

    };

    const replaceLastWithError = (err:unknown) => { 
        console.log("Error: ", err);

        setMessages((prev: Message[]) => [
            ...prev.slice(0, -1),
            { role: "error", text: "Sorry, I ran into an issue. Please try again." }
        ]);
    };

    //Stream
    if( selectedResponse === RESPONSE_MODE.STREAM ){

        const handleSend = async(userPrompt:string) =>{

            if(isLoading) return;

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const newMessage:Message = { role:"user", text:userPrompt }
            const botPlaceholder:Message = { role:"model", text:"..." }
            
            setMessages((prev:Message[])=> [...prev, newMessage, botPlaceholder]);            
            
            const localHistory:Message[] = [...messages, newMessage ];
            const cleanHistory = localHistory.filter(m => ["user", "model"].includes(m.role));
            setIsLoading(true);

            try{
                const stream = fetchStreamData(
                    base_url,
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

            }catch(err:any){
                const stoppedByUser = appendStoppedMessage(err);
                if(!stoppedByUser) replaceLastWithError(err);
            }finally{
                setIsLoading(false);
                abortControllerRef.current = null;
            }            
        }

        return { messages, handleSend, handleStop, isLoading }

    //Complete
    }else if(selectedResponse === RESPONSE_MODE.COMPLETE){
        
        const handleSend = async(userPrompt:string) => {
            if(isLoading) return;

            const controller = new AbortController();
            abortControllerRef.current = controller;
            
            setIsLoading(true);

            const newMessage:Message = { role:"user", text:userPrompt };
            const botPlaceholder:Message = { role:"model", text:"..." };
            
            setMessages(prev => [...prev, newMessage, botPlaceholder]);
            const localHistory:Message[] = [...messages, newMessage];

            const cleanHistory = localHistory.filter(m => ["user", "model"].includes(m.role));
            try{
                const data = await fetchCompleteData(
                    base_url,
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
            }catch(err:any){
                const stoppedByUser = appendStoppedMessage(err);
                if(!stoppedByUser) replaceLastWithError(err);
            }finally{
                setIsLoading(false);
                abortControllerRef.current = null;
            }

        }        

        return { messages, handleSend, handleStop, isLoading }
    //SSE
    }else{

        const handleSend = (userPrompt:string) => {
            if (isLoading) return;
            // KILL any existing stream just in case
            if (stopStreamRef.current) {
                stopStreamRef.current();
            }
            setIsLoading(true);        
            setMessages(prev => [...prev, {role:"user", text:userPrompt}, {role:"model", text:''}]);
            
            //SSE service
            const cleanup = streamSSE(
                base_url,
                userPrompt, 
                { 
                    onChunk:(text) => {
                        setIsLoading(true);
                        setMessages(prev => {
                            const lastMessage = prev[prev.length -1];
                            // If for some reason the placeholder isn't there yet, 
                            // we append a new message instead of trying to edit 'undefined'
                            if (!lastMessage || lastMessage.role !== "model") {
                                return [...prev, { role: "model", text: text }];
                            }
                            const otherMessages = prev.slice(0, -1); //Create shallow copy
                            return  [...otherMessages, {...lastMessage, text:lastMessage.text+text}];
                        })
                    },
                    onDone: () => {
                        setIsLoading(false);
                        stopStreamRef.current = null;
                    },
                    onError: () => {
                        setIsLoading(false);
                        stopStreamRef.current = null;
                    }
                }
            );

            // Store it so the "Stop" button can find it
            stopStreamRef.current = cleanup;
        };
        return { messages, handleSend, handleStop, isLoading }

    }
}