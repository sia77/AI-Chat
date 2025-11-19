import { useState } from "react";
import type { Message } from "../types/types";
    
    export const useCompleteChat = () => {

        const base_url = import.meta.env.VITE_BASE_URL;

        const [messages, setMessages] = useState<Message[]>([]);

        const handleSend = async(message:string) => {

            setMessages(prevMsg => [...prevMsg, { role:'user', text:message}]);
            setMessages(prev => [...prev, { role: "model", text: "..." }]);

            try{
                const response = await fetch(`${base_url}/api/chat/complete`, {
                    method: "POST", 
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({ prompt: message, temperature: 0.7 })
                });                

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({}));
                    setMessages(prev => [
                        ...prev,
                        { role: "model", text: errorBody.detail || "Server error" },
                    ]);
                    throw new Error(errorBody.detail || `HTTP ${response.status}`);
                }                

                const data = await response.json();

                setMessages(prevMsg => {
                    return prevMsg.filter(message => message.text !== "...");
                });

                setMessages(prevMsg => [...prevMsg, {role:'model', text:data.generated_text}])

            }catch(error:any){
                console.log("Error sending message: ", error);
            }
        }

        return { messages, handleSend };

    }
    
