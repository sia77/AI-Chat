import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { UseStreamJsonMultipeCandidates } from "../hooks/UseStreamJsonMultipeCandidates";


export const ChatWindow = () => {

    const { messages, handleSend } = UseStreamJsonMultipeCandidates();

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}