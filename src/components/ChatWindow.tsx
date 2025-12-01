import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { UseStreamWithHistoryJson } from "../hooks/UseStreamWithHistoryJson";

export const ChatWindow = () => {

    const { messages, handleSend } = UseStreamWithHistoryJson();

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}