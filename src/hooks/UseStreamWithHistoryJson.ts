import { useState } from "react"
import type { Message } from "../types/types"

export const UseStreamWithHistoryJson = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([])

    const handleSend = async(message:string) => {

        setMessages(prevMsg => [...prevMsg, {role:'user', text:message}])

        try {
            const response = await fetch(`${base_url}/api/chat/stream/json`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({prompt:message, temperature:0.7, history:messages })
            })

            if(!response.ok){
                const errorBody = await response.json().catch(() => ({}));
                setMessages(prevMsg => [...prevMsg, { role:'model', text:errorBody.detail || "Server error" }])
                throw new Error(errorBody.detail || `HTTP ${response.status}`)
            }

            if (!response.body) {
                throw new Error("Streaming not supported in this environment.");
            }

            const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();

            let buffer = "";
            let fullText ="";
            
            //Creating a placeholder
            setMessages(prev => [...prev, { role: "model", text: "..." }]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += value;

                let newlineIndex;                
                while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
                    const line = buffer.slice(0, newlineIndex).trim();
                    buffer = buffer.slice(newlineIndex + 1);

                    if (line.length === 0) continue;

                    try{
                        // Each line is one valid small JSON object
                        const obj = JSON.parse(line);

                        fullText += obj.text;                   

                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length -1] = { role: "model", text: fullText }                        
                            return updated;
                        })

                    }catch(error:any){
                        console.error("Failed to parse JSON line:", line);
                    }
                }
            }
            
        } catch (error:any) {
            console.error("Error sending message:", error);
        }
    }

    return {messages, handleSend}
}