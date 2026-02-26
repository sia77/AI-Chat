import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { Dropdown } from "./Dropdown";
import { useState } from "react";
import { useLLMHook } from "../hooks/useLLMHook";
import { SidePanel } from "./SidePanel";

///type StreamMode = "complete" | "stream-stateless-text" | "stream-text" | "stream-json" | "sse";

export const ChatWindow = () => {
    //const [mode, setMode] = useState<StreamMode>("text")
    const [mode, setMode] = useState("sse")
    //const { messages, handleSend } = useStreamHistoryText();
    const { messages, handleSend, handleStop, isLoading } = useLLMHook( mode);

    return (       

        <>
            <div>
                
            </div>
            <div className="flex flex-col h-screen bg-blue-100">
                <SidePanel />
                {/* <TopMenu /> */}
                {/* <Dropdown 
                    items={[
                    { label: "Complete response", onClick: () => { setMode("complete") } },
                    { label: "Stream (no history, text)", onClick: () => { setMode("stream") } },
                    { label: "Stream (with history, JSON)", onClick: () => { setMode("j_history") } },
                    { label: "Stream (with history, text)", onClick: () => { setMode("t_history") } },
                    { label: "SSE stream (text)", onClick: () => { setMode("sse") } },
                    ]}
                /> */}
                <MessageList messageList = {messages} />    
                <MessageInput 
                    onSend = {handleSend}
                    isLoading = {isLoading}
                    handleStop = { handleStop} />                
            </div>
        </>

    )
}