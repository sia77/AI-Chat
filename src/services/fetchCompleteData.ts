import { ACCEPT_HEADERS, TEMPERATURE } from "../shared/constant";
import type { MediaType, Message } from "../shared/types";


export const fetchCompleteData = async(
    baseURL: string, 
    mediaType:MediaType, 
    prompt:string,
    history:Message[],
    signal: AbortSignal,
    model_name:string,
    temperature=TEMPERATURE) => {

    try{
        const response = await fetch(`${baseURL}/api/v1/chat/complete`, {
            method:'POST',
            signal,
            headers: { 
                "Content-Type": 'application/json',
                "X-Format": ACCEPT_HEADERS[mediaType] // Content negotiation
            },
            body: JSON.stringify({ prompt, temperature, history, model_name })
        });

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