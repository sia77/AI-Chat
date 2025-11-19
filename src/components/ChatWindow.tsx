import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { useStreamWithHistory } from "../hooks/useStreamWithHistory";

export const ChatWindow = () => {

    const { messages, handleSend } = useStreamWithHistory();

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}