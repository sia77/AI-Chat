import { ThreeDots } from "./ThreeDots";


interface ServerStatusProps {
    isServerLive:boolean
}

export const ServerStatus = ({isServerLive}:ServerStatusProps) => {

    if(isServerLive) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15">
            <div className="rounded bg-black/10 p-[30px] flex flex-col items-center gap-4">
                <ThreeDots />
                <div className="text-gray-700 font-medium">Server is waking up...</div>
            </div>
        </div>
    );
}