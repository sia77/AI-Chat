import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { useEffect, useState } from "react";
import { useLLMHook } from "../hooks/useLLMHook";
import { SidePanel } from "./SidePanel";
import type { MediaType, PanelMode, ResponseTypeLLM } from "../shared/types";
import { useRef } from 'react';
import { useServerHealth } from "../hooks/useServerHealth";
import { ServerStatus } from "./ServerStatus";

export const ChatWindow = () => {
    const [selectedResponse, setSelectedResponse] = useState<ResponseTypeLLM>('stream');
    const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('json');
    const {messages, handleSend, handleStop, isLoading } = useLLMHook( selectedResponse, selectedMediaType );
    const [panelMode, setPanelMode] = useState<PanelMode>('closed');
    const panelRef = useRef<HTMLDivElement>(null);
    const isServerLive = useServerHealth();

    useEffect(()=>{

        const handleClickOutside = () => {
            if(
                panelMode === 'floating' &&
                panelRef.current &&
                !panelRef.current.contains(event?.target as Node)){
                setPanelMode('closed');
            }        
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);        
    },[panelMode]);

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                <SidePanel
                    panelRef = {panelRef} 
                    selectedResponseType = {selectedResponse}
                    setSelectedResponseType = { setSelectedResponse}
                    selectedMediaType = {selectedMediaType}
                    setSelectedMediaType = { setSelectedMediaType }
                    panelMode = { panelMode }
                    setPanelMode = {setPanelMode} />
                
                {/* <TopMenu /> */}

                <MessageList messageList = {messages} />                 
                <ServerStatus isServerLive = {isServerLive} />
                <MessageInput 
                    onSend = {handleSend}
                    isLoading = {isLoading}
                    handleStop = { handleStop}
                    isServerLive = {isServerLive} />                
            </div>
        </>

    )
}