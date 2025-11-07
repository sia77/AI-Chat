import { useState } from "react"
import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import type { Message } from "../types/types"

export const ChatWindow = () => {

    const base_url = import.meta.env.VITE_BASE_URL;

    const [messages, setMessages] = useState<Message[]>([]);

    const handleSend = async(message:string) => {

        setMessages(prevMsg => [...prevMsg, {sender:'user', text:message}]);

        try{
            const response = await fetch(`${base_url}/api/query`, {
                method: "POST", 
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ prompt: message, temperature: 0.7 })
            });

            const data = await response.json();

            setMessages(prevMsg => [...prevMsg, {sender:'ai', text:data.generated_text}])

        }catch(error:any){
            console.log("Error sending message: ", error);
        }
    }

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}