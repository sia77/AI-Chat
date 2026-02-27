import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { useState } from "react";
import { useLLMHook } from "../hooks/useLLMHook";
import { SidePanel } from "./SidePanel";

export const ChatWindow = () => {
    //const [mode, setMode] = useState<StreamMode>("text")
    const [mode, setMode] = useState("sse")
    //const { messages, handleSend } = useStreamHistoryText();

    const [selectedResponse, setSelectedResponse] = useState('stream');
    const [selectedMediaType, setSelectedMediaType] = useState('json');
    const { messages, handleSend, handleStop, isLoading } = useLLMHook( mode);

    return (       

        <>
            <div>
                
            </div>
            <div className="flex flex-col h-screen bg-blue-100">
                <SidePanel 
                    selectedResponseType = {selectedResponse}
                    setSelectedResponseType = { setSelectedResponse}
                    selectedMediaType = {selectedMediaType}
                    setSelectedMediaType = { setSelectedMediaType } />
                
                {/* <TopMenu /> */}

                <MessageList messageList = {messages} />    
                <MessageInput 
                    onSend = {handleSend}
                    isLoading = {isLoading}
                    handleStop = { handleStop} />                
            </div>
        </>

    )
}