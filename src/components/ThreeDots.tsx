

export const ThreeDots = () => {

    return(
        <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
            <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.4s]"></span>
        </div>
    )
}