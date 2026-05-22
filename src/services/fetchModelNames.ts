

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

        // const sanitized_data = {
        //     "total_count": data.total_count,
        //     "models": data.models.map((model:any)=>({
        //         ...model,
        //         label: model.display_name

        //     }))
        // }

        // console.log("sanitized_data:", sanitized_data)

        //return data;
}