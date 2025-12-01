import { useState } from "react";
import type { Message } from "../types/types";

export const useStreamWithHistory = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);    

    const handleSend = async(message:string) => {

        setMessages(prevMsg => [...prevMsg, {role:'user', text:message}])

        try {
            const response = await fetch(`${base_url}/api/chat/stream`,
                {
                    method:"POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ prompt:message, temperature: 0.7, history: messages }),
                }
            )

            if(!response.ok){
                const errorBody = await response.json().catch(() => ({}));
                setMessages(prevMsg => [...prevMsg, { role:'model', text:errorBody.detail || "Server error" }])
                throw new Error(errorBody.detail || `HTTP ${response.status}`)
            }

            if (!response.body) {
                throw new Error("Streaming not supported in this environment.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let fullText = "";
            setMessages(prev => [...prev, { role: "model", text: "..." }]);

            while(true){
                const { done, value } = await reader.read();
                if(done){
                    //We are done
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                fullText +=chunk;

                setMessages(prevMsg => {
                    const updated = [...prevMsg];
                    updated[updated.length -1] = { role: "model", text: fullText };
                    return updated;
                })
            }

        }catch(error:any){
            console.error("Error sending message:", error);
        }
    }

    return { messages, handleSend }

}