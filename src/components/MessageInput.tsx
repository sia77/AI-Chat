import { useRef, useState, useEffect } from "react";
import { SendButton } from "./SendButton";

type MessageInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
  handleStop: () => void;
  isServerLive:boolean
};

export const MessageInput = ({onSend, isLoading, handleStop, isServerLive}:MessageInputProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const isDisabled = !isServerLive || isLoading;

    const [message, setMessage] = useState("");

    useEffect(()=> {

        if(isServerLive && !isLoading)
        textAreaRef.current?.focus();

    }, [isServerLive, isLoading])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSend = () => {
        if(!message.trim()) return;
        onSend(message);
        setMessage(""); 
    }

    return (
        <div
            className="
                w-full
                border-t border-gray-300
                bg-amber-700
                h-[150px]
                flex items-center justify-center
                px-4
        ">
            <div className="relative w-full max-w-[800px]">
                <textarea
                ref={textAreaRef}
                disabled = {isDisabled}
                className={
                    `w-full h-[100px]
                    p-3 pr-12  
                    rounded bg-white shadow
                    focus:outline-none
                    resize-none
                    ${isDisabled 
                        ? "bg-gray-100 cursor-not-allowed text-gray-400" 
                        : "bg-white cursor-text text-black"
                    }`                    
                }

                value = { message }
                onKeyDown={ handleKeyDown }
                onChange={(e)=> setMessage(e.target.value)}
                placeholder="Type your message..."
                ></textarea>

                <div className="absolute right-3 bottom-3">
                    <SendButton 
                        onClick = {handleSend} 
                        isLoading = {isLoading} 
                        onStop = {handleStop} 
                        isDisabled = {isDisabled} />
                </div>
            </div>
        </div>
    )
}

