import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { useStreamService } from "../hooks/StreamService"


export const ChatWindow = () => {

    const { messages, handleSend } = useStreamService();

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}