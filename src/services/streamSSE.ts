//This version receives the response as SSE events

export type SSEHandlers = {
    onChunk: (text:string) => void;
    onError?:(err: string) => void;
    onDone?:() => void;
}

export const streamSSE = (baseURL: string, prompt:string, handlers:SSEHandlers) => {
    
    // Here the chat history is not included in the prompt
    const url = `${baseURL}/api/v1/chat/stream/sse?prompt=${encodeURIComponent(prompt)}`;

    const sse = new EventSource(url);

    sse.addEventListener("chunk", (e)=> {
        try { 
            const { text } = JSON.parse(e.data); 
            handlers.onChunk(text); 
        } 
        catch { 
            handlers.onError?.("Malformed JSON received"); 
        }
    })

    sse.addEventListener("done", ()=> {
        handlers.onDone?.()
    })

    sse.addEventListener("sse_error", (e) =>{
        const { message } = JSON.parse(e.data); 
        handlers.onError?.(message);
    });

    // Built-in connection error 
    sse.onerror = (err:unknown) => { 
        handlers.onError?.("Connection lost"); 
        sse.close(); 
    };

    return () => sse.close();

}