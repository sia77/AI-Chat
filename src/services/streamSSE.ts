//This version receives the response as SSE events

export type SSEHandlers = {
    onChunk: (text:string) => void;
    onError?:(err: string) => void;
    onDone?:() => void;
}

export const streamSSE = (
    baseURL: string, 
    prompt:string, 
    model_name:string, 
    handlers:SSEHandlers
) => {
    
    // Here the chat history is not included in the prompt
    const url = `${baseURL}/api/v1/chat/stream/sse?prompt=${encodeURIComponent(prompt)}&model_name=${encodeURIComponent(model_name)}`;
    const sse = new EventSource(url);

    let isClosed = false;

    const safeClose = () => {
        if (isClosed) return;
        isClosed = true;
        sse.close();
    };

    sse.addEventListener("chunk", (e)=> {
        try { 
            const { text } = JSON.parse((e as MessageEvent).data); 
            handlers.onChunk(text); 
        } 
        catch { 
            handlers.onError?.("Malformed JSON received");
            safeClose(); 
        }
    })

    sse.addEventListener("done", ()=> {
        handlers.onDone?.();
        sse.close();
    })

    sse.addEventListener("sse_error", (e) =>{
        try{
            console.log("Error-hi: ", e)
            const { message } = JSON.parse((e as MessageEvent).data); 
            handlers.onError?.(message || "Server error");
        }catch{
            handlers.onError?.("Server error");
        }
        safeClose();
    });

    // Built-in connection error 
    sse.onerror = (e) => { 
        console.log("E:", e);
        handlers.onError?.("Connection lost***"); 
        sse.close(); 
    };

    return () => sse.close();
}