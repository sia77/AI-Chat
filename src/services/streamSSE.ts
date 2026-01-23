//This version receives the response as SSE and don't allow for history as this only allows for GET methods.
//There are ways around this, however, SSE is not designed for POST as per design

export type SSEHandlers = {
    onChunk: (text:string) => void;
    onError?:(err: unknown) => void;
    onDone?:() => void;
}

export const streamSSE = (baseURL: string, prompt:string, handlers:SSEHandlers) => {
    
    // Here the chat history is not included in the prompt
    const url = `${baseURL}/api/v1/chat/stream/sse?prompt=${encodeURIComponent(prompt)}`;

    const sse = new EventSource(url);
    
    sse.onmessage = (e) => {
        // if (e.data === '[DONE]') {
        //     handlers.onDone?.();
        //     sse.close();
        //     return;
        // }

        try {
            const data = JSON.parse(e.data);
            if(data.text) handlers.onChunk(data.text)
        } catch (err) {
            console.error("Malformed JSON received");
            handlers.onError?.(new Error("Malformed JSON received"));
        }
    };

    // Handle connection close/error
    sse.onerror = (err) => {        
        sse.close();
        handlers.onError?.(err);        
    };

    return () => sse.close();

}