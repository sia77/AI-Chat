import { ACCEPT_HEADERS } from "../types/constant";
import type { MediaType } from "../types/types";


export const fetchCompleteData = async(baseURL: string, mediaType:MediaType, message:string, temperature=0.7) => {

    try{
        const response = await fetch(`${baseURL}/api/v1/chat/complete`, {
            method:'POST',
            headers: { 
                "Content-Type": 'application/json',
                "X-Format": ACCEPT_HEADERS[mediaType] // Content negotiation
            },
            body: JSON.stringify({ prompt: message, temperature })
        });


        if(!response.ok){
            throw new Error("Something went wrong communicating with API")// || `HTTP ${response.status}`);
        }

        if (!response.body) {
            throw new Error("Streaming not supported in this environment.");
        }

        const data = await response.json();

        console.log("data:", data);

        return;// response;

    }catch(err:unknown) {
        console.error("Fetch failed:", err);
    }

}