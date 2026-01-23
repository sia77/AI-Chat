import { useEffect, useState } from "react";
import { streamSSE } from "../services/streamSSE";
import type { Message } from "../types/types";


export const useLLMHook = (mode:string) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);

    //if(mode === "sse"){

    const handleSend = (userPrompt:string) => {        
        setMessages(prev => [...prev, {role:"user", text:userPrompt}, {role:"model", text:''}]);

        streamSSE(
            base_url,
            userPrompt, 
            { 
                onChunk:(text) => {
                    setMessages(prev => {
                        const lastMessage = prev[prev.length -1];
                        const otherMessages = prev.slice(0, -1);
                        return  [...otherMessages, {...lastMessage, text:lastMessage.text+text}];
                    })
                },
                onError: (err) => console.error("Stream error", err)                
            }
        );
    };

    //useEffect(()=> {console.log("message: ", messages);}, [messages])

    
    return { messages, handleSend } 

}