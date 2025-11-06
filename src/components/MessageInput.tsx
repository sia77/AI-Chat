import { SendButton } from "./SendButton";

export const MessageInput = () => {
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
                placeholder="Type your message..."
                ></textarea>

                
                <div className="absolute right-3 bottom-3">
                <SendButton />
                </div>
            </div>

        </div>
    )
}

