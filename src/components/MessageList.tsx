import { useRef, useEffect } from "react";
import type { Message } from "../shared/types";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
    messageList: Message[]; 
};

export const MessageList = ({ messageList }: MessageListProps) => {

    // 1. Find the index of the last user message
    let lastUserMessageIndex = -1;
    for (let i = messageList.length - 1; i >= 0; i--) {
        if (messageList[i].role === "user") {
            lastUserMessageIndex = i;
            break;
        }
    }

    const endOfMessage = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        endOfMessage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        if (lastUserMessageIndex !== -1) {
            scrollToTop();
        }
    }, [messageList]); 

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-[800px] mx-auto space-y-6 min-h-full flex flex-col justify-start">
                
                {messageList.map((msg, index) => {
                    const stableKey = `${msg.role}-${index}`;
                    
                    // Is this the last user message?
                    const isLastUserMessage = index === lastUserMessageIndex;
                    
                    // Is this the active streaming bot response right under it?
                    const isItCurrentResponseAI = msg.role === "model" && index === lastUserMessageIndex + 1;
                    
                    if (isLastUserMessage) {
                        return (
                            <div 
                                key={stableKey} 
                                ref={endOfMessage}
                                className="w-full"
                            >
                                <MessageItem message={msg} />
                            </div>
                        );
                    }
                    
                    if (isItCurrentResponseAI) {
                        return (                            
                            <div key={stableKey} className="w-full min-h-[calc(100svh-250px)] flex flex-col justify-start">
                                <MessageItem message={msg} />
                            </div>
                        );
                    }

                    // All historical messages render completely normally with zero height modifiers
                    return (
                        <div key={stableKey} className="w-full">
                            <MessageItem message={msg} />
                        </div>
                    );
                })}                
            </div>
        </div>
    );
};

