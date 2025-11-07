import { useState } from "react";
import { SendButton } from "./SendButton";

type MessageInputProps = {
  onSend: (message: string) => void;
};

export const MessageInput = ({onSend}:MessageInputProps) => {

    const [message, setMessage] = useState("");

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
                className="
                    w-full h-[100px]
                    p-3 pr-12  
                    rounded bg-white shadow
                    focus:outline-none
                    resize-none
                "
                value = { message }
                onKeyDown={ handleKeyDown }
                onChange={(e)=> setMessage(e.target.value)}
                placeholder="Type your message..."
                ></textarea>

                <div className="absolute right-3 bottom-3">
                <SendButton onClick={handleSend}  />
                </div>
            </div>
        </div>
    )
}

