import { MEDIA_OPTIONS } from "../config/panelOptions";
import { ACCEPT_HEADERS, TEMPERATURE } from "../shared/constant";
import type { MediaType, Message } from "../shared/types";

export async function* fetchStreamData (
    baseURL:string,    
    mediaType:MediaType,
    prompt:string,
    history:Message[],
    signal: AbortSignal,
    model_name:string,
    temperature=TEMPERATURE
) {

    const response = await fetch(`${baseURL}/api/v1/chat/stream`, {
            method: "POST",
            signal,
            headers:{
                "Content-Type":"application/json",
                "X-Format": ACCEPT_HEADERS[mediaType] // Content negotiation
            },
            body:JSON.stringify({prompt, temperature, history, model_name})
        }        
    )

    if(!response.ok){
        let errorMsg = "An AI provider error occurred.";
        const status = response.status;

        try{
            const errorJson = await response.json();

            if(errorJson?.detail?.message){
                errorMsg = errorJson.detail.message;
            }
        }catch{
            errorMsg = `Server returned status code ${status}`;
        }
        throw {status, message:errorMsg}
    }

    if (!response.body) throw {status:500, message:"Response body is missing from stream."}

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try{
        while(true){

            if(signal.aborted) throw new DOMException("Aborted", "AbortError");

            const { done, value } = await reader.read();

            if(done) break;

            const chunk = decoder.decode(value, {stream:true});

            if(mediaType === MEDIA_OPTIONS[0].id){

                buffer += chunk; 
                const lines = buffer.split('\n');

                //Saving the element for next iteration.
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const json = JSON.parse(trimmed);                        
                        yield json;
                        
                    } catch (e) {
                        console.error("Parsing error on line:", trimmed, e);
                    }
                }

                if (buffer.trim()) {
                    try {
                        const finalJson = JSON.parse(buffer);
                        yield finalJson;
                        
                    } catch (e) {
                        /* Usually this is just a trailing newline */
                    }
                }
            }else{
                yield chunk;
            }
        }

    } catch(err:any){
        if(err.name === 'AbortError' || err.message === 'Aborted'){
            console.log("Generator level: Abort detected.");
            throw err;  //Re-throw so handleSend catch block deals with it.
        }
        console.error("Actual Stream Failure: ", err);
        throw err;
    }
    finally{
        //Prevents memory, etc.
        reader.releaseLock();
    }
}