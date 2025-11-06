import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"

export const ChatWindow = () => {

    return (
        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList />    
                <MessageInput />                
            </div>
        </>

    )
}