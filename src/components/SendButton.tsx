
import { Play, Square } from "lucide-react";

type SendButtonProps = {
    onClick: () => void;
    isLoading: boolean;
    onStop: () => void;
};

export const SendButton = ({onClick, isLoading, onStop}:SendButtonProps) => {

const icon = isLoading ? <Square color="#373737" /> : <Play color="#3e9392" />;
const action = isLoading ? onStop : onClick;

return (
  <button className="cursor-pointer" onClick={action}>
    {icon}
  </button>
);
}