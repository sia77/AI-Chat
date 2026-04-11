
import { Play, Square } from "lucide-react";

type SendButtonProps = {
    onClick: () => void;
    isLoading: boolean;
    onStop: () => void;
    isDisabled:boolean;
};

export const SendButton = ({onClick, isLoading, onStop, isDisabled}:SendButtonProps) => {

const icon = isLoading ? <Square color="#373737" /> : <Play color="#3e9392" />;
const action = isLoading ? onStop : onClick;

return (
  <button 
  disabled={isDisabled}
  className={!isDisabled ? "cursor-pointer":"cursor-not-allowed" }  
  onClick={action}>
    {icon}
  </button>
);
}