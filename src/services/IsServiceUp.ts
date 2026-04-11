

export const IsServiceUp = async( baseURL: string ) =>{
    console.log("Did you call me?");

    try{
        const response = await fetch(`${baseURL}/api/v1/chat/`);
        return response.ok;

    }catch(err:unknown){
        return false;
    }
}