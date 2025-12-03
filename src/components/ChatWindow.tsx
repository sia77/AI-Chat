import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { UseStreamSSE } from "../hooks/UseStreamSSE";


export const ChatWindow = () => {

    const { messages, handleSend } = UseStreamSSE();

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}