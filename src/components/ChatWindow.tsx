import { MessageInput } from "./MessageInput"
import { MessageList } from "./MessageList"
import { useStreamHistoryText } from "../hooks/useStreamHistoryText";
import { TopMenu } from "./TopMenu";
import { Dropdown } from "./Dropdown";


export const ChatWindow = () => {

    const { messages, handleSend } = useStreamHistoryText();

    return (       

        <>
            <div className="flex flex-col h-screen bg-blue-100">
                {/* <TopMenu /> */}
                <Dropdown 
                    items={[
                    { label: "Edit", onClick: () => {} },
                    { label: "Delete", onClick: () => {} },
                    ]}
                />
                <MessageList messageList = {messages} />    
                <MessageInput onSend = {handleSend}/>                
            </div>
        </>

    )
}