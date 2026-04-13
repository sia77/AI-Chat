

interface ServerStatusProps {
    isServerLive:boolean
}

export const ServerStatus = ({isServerLive}:ServerStatusProps) => {

    if(!isServerLive) return null;

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="z-50 rounded bg-black/10 p-[30px] flex flex-col items-center gap-4">
                <div className="flex gap-1">
                    {/* Three pulsing dots */}
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                </div>
                <div className="text-gray-700 font-medium">Server is waking up...</div>
            </div>
        </div>
    );
}