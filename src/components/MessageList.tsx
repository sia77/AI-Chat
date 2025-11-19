import type { Message } from "../types/types";
import { MessageItem } from "./MessageItem";
import { v4 as uuid } from 'uuid';

type MessageListProps = {
    messageList: Message[]; 
};

export const MessageList = ({messageList}:MessageListProps) => {

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <section className="max-w-[800px] mx-auto space-y-6">
                {
                    messageList.map((msg)=> <MessageItem key = {uuid()} message = {msg} />)
                }                
            </section>
        </div>
    )
}

