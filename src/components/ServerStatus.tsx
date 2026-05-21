

interface ServerStatusProps {
    isServerLive:boolean
}

export const ServerStatus = ({isServerLive}:ServerStatusProps) => {

    if(isServerLive) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15">
            <div className="rounded bg-black/10 p-[30px] flex flex-col items-center gap-4">
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                </div>
                <div className="text-gray-700 font-medium">Server is waking up...</div>
            </div>
        </div>
    );
}