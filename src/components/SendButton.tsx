
import { Play } from "lucide-react";

type SendButtonProps = {
    onClick: () => void;
};

export const SendButton = ({onClick}:SendButtonProps) => {

    return (
        <button 
            onClick = {onClick}>
            <Play color="#3e9392" />
        </button>
        
    )



}