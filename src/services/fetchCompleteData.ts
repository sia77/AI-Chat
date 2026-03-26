import { ACCEPT_HEADERS, TEMPERATURE } from "../types/constant";
import type { MediaType, Message } from "../types/types";


export const fetchCompleteData = async(
    baseURL: string, 
    mediaType:MediaType, 
    prompt:string,
    history:Message[],
    signal: AbortSignal,
    temperature=TEMPERATURE) => {

    try{
        const response = await fetch(`${baseURL}/api/v1/chat/complete`, {
            method:'POST',
            signal,
            headers: { 
                "Content-Type": 'application/json',
                "X-Format": ACCEPT_HEADERS[mediaType] // Content negotiation
            },
            body: JSON.stringify({ prompt, temperature, history })
        });

        if(!response.ok){
            throw new Error("Something went wrong communicating with API")// || `HTTP ${response.status}`);
        }

        if(mediaType === 'json'){
            return await response.json();
        }else{
            return await response.text();
        }

    }catch(err:any) {

        if(err.name === 'AbortError' || err.message === 'Aborted'){
            console.log("Generator level: Abort detected.");
            throw err;  //Re-throw so handleSend deals with it.
        }else{
            console.error("Fetch failed:", err);
            throw err;
        }        
    }

}