import { useRef, useState } from "react";
import { streamSSE } from "../services/streamSSE";
import type { Message } from "../types/types";


export const useLLMHook = (mode:string) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const stopStreamRef = useRef<(() => void) | null>(null);

    const handleStop = () => {
        if (stopStreamRef.current) {
            stopStreamRef.current(); // This calls sse.close() inside your service
            stopStreamRef.current = null;
            setIsLoading(false);
            console.log("Stream stopped by user");
        }
    };

    const handleSend = (userPrompt:string) => {
        if (isLoading) return;
        setIsLoading(true);        
        setMessages(prev => [...prev, {role:"user", text:userPrompt}, {role:"model", text:''}]);

        const cleanup = streamSSE(
            base_url,
            userPrompt, 
            { 
                onChunk:(text) => {
                    setIsLoading(true);
                    setMessages(prev => {
                        const lastMessage = prev[prev.length -1];
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