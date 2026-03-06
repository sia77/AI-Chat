import { useRef, useState } from "react";
import { streamSSE } from "../services/streamSSE";
import type { MediaType, Message, ResponseTypeLLM } from "../types/types";
import { RESPONSE_OPTIONS } from "../config/panelOptions";
import { fetchCompleteData } from "../services/fetchCompleteData";


export const useLLMHook = (selectedResponse:ResponseTypeLLM, selectedMediaType:MediaType) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const stopStreamRef = useRef<(() => void) | null>(null);


    if( selectedResponse === RESPONSE_OPTIONS[1].id ){

        const handleStop = () => {
            if (stopStreamRef.current) {
                stopStreamRef.current(); // This calls sse.close() inside the service
                stopStreamRef.current = null;
                setIsLoading(false);
                console.log("Stream stopped by user");
            }
        };
        
        const handleSend = (userPrompt:string) => {
            if(isLoading) return;

            
            setIsLoading(true);
            //{prompt:message, temperature:0.7, history:messages }
            setMessages(prev => [...prev, {role:"user", text:userPrompt}, {role:"model", text:''}]);
            //{ prompt:message, temperature: 0.7, history: messages }),

            fetchCompleteData(
                base_url,
                selectedMediaType,
                userPrompt
            )



        }

        return { messages, handleSend, handleStop, isLoading }

    }else{

        const handleStop = () => {
            if (stopStreamRef.current) {
                stopStreamRef.current(); // This calls sse.close() inside the service
                stopStreamRef.current = null;
                setIsLoading(false);
                console.log("Stream stopped by user");
            }
        };

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