
import { useQuery } from "@tanstack/react-query";
import { fetchModelNameService } from "../services/fetchModelNames";

export const useFetchModelNameService = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    return useQuery({
        queryKey: [],
        queryFn: () => fetchModelNameService(baseUrl),
        refetchOnMount:true,
        refetchOnWindowFocus:true
    });
}