import { useEffect, useState } from "react";
import type { Message } from "../types/types"

export const UseStreamSSE = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [messages, setMessages] = useState<Message[]>([]);
    // Use state to hold the most recent user prompt that needs a response
    const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

    const handleSend = (message: string) => {
        // 1. Update the display with the new user message immediately
        setMessages(prev => [...prev, { role: 'user', text: message }]);
        
        // 2. Set the pending prompt to trigger the useEffect to open the SSE
        setPendingPrompt(message);

        // Optional: Add a temporary 'model' message placeholder
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
    };

    // This useEffect manages the SSE connection lifecycle
    useEffect(() => {
        if (!pendingPrompt) return; 

        // We are not passing back the chat history as there is length limitation GET query
        const url = `${base_url}/api/chat/stream/sse?prompt=${encodeURIComponent(pendingPrompt)}`;
        
        const sse = new EventSource(url);
        let accumulatedText = ''; // To collect the streamed text chunks

        sse.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                
                accumulatedText += data.text; 

                // 2. Update the *last* model message with the streaming data
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastModelMsgIndex = newMessages.length - 1;
                    
                    // Ensure the last message is the model's placeholder
                    if (newMessages[lastModelMsgIndex].role === 'model') {
                        newMessages[lastModelMsgIndex].text = accumulatedText;
                    }
                    return newMessages;
                });
            } catch (err) {
                console.error("Failed to parse SSE message or update state", err);
            }
        };

        // 3. Handle connection close/error
        sse.onerror = (error) => {
            console.error("SSE Error:", error);
            sse.close();
            setPendingPrompt(null); // Clear prompt on error/completion
        };
        
        // 4. Cleanup function: runs when 'pendingPrompt' changes or component unmounts
        return () => {
            sse.close();
        };

    }, [pendingPrompt, base_url]); 
    
    return { messages, handleSend };
}

