import { useState, useEffect } from "react"
import { IsServiceUp } from "../services/IsServiceUp";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const useServerHealth = () => {
    const [isServerLive, setIsServerLive] = useState(false);

    useEffect(()=> {
        if(isServerLive) return;

        const checkStatus = async() => {
            const isUp = await IsServiceUp(baseUrl)
            
            if(isUp) setIsServerLive(true);
        }

        const clearId = setInterval(checkStatus, 5000);

        return () => clearInterval(clearId);

    }, [isServerLive, baseUrl]);

    return isServerLive;

}