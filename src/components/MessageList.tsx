import { MessageItem } from "./MessageItem"

export const MessageList = () => {

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <section className="max-w-[800px] mx-auto space-y-6">
                {/* Example chat messages */}
                <MessageItem />
            </section>
        </div>
    )
}

