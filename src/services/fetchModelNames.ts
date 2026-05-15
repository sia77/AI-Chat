

export const fetchModelNameService = async(
    baseURL: string,
) => {
        const response = await fetch(`${baseURL}/api/v1/chat/models`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if(!response.ok){
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
}