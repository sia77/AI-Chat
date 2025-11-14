import { useState } from "react";
import type { Message } from "../types/types";

export const useStreamService = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);


    const handleSend = async(message:string) => {

        setMessages(prevMsg => [...prevMsg, {sender:'user', text:message}]);

        try {
            const response = await fetch(`${base_url}/api/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message, temperature: 0.7 }),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                setMessages(prev => [
                    ...prev,
                    { sender: "ai", text: errorBody.detail || "Server error" },
                ]);
                throw new Error(errorBody.detail || `HTTP ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Streaming not supported in this environment.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let fullText = "";
            setMessages(prev => [...prev, { sender: "ai", text: "..." }]);

            while (true) {
                const { done, value } = await reader.read();
                console.log(`done: ${done} -- value: ${value}`);
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;

                // Update last message incrementally
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { sender: "ai", text: fullText };
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    return { messages, handleSend };
}