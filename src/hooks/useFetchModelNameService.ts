
import { useQuery } from "@tanstack/react-query";
import { fetchModelNameService } from "../services/fetchModelNames";

export const useFetchModelNameService = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    return useQuery({
        queryKey: ['modelNames', baseUrl],
        queryFn: () => fetchModelNameService(baseUrl),
        select: (rawData) =>{
            return {                
                "models":rawData.models.map((model:any)=>({
                    ...model,
                    "label":model.display_name
                }))
            }
        },
        refetchOnMount:true,
        refetchOnWindowFocus:true
    });
}