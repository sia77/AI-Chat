
export const MessageItem = () => {

    return(
        <>
            {/* User message */}
            <div className="flex justify-end mb-2">
                <div className="relative max-w-[75%] bg-blue-500 text-white p-3 rounded-lg shadow">
                This user's message goes here. It's right-aligned with a nice color.
                <div
                    className="absolute -right-1.5 top-3 w-0 h-0
                            border-t-8 border-t-transparent
                            border-l-8 border-l-blue-500
                            border-b-8 border-b-transparent"
                ></div>
                </div>
            </div>

            {/* AI message */}
            <div className="flex justify-start mb-2">
                <div className="relative max-w-[75%] bg-purple-600 text-white p-3 rounded-lg shadow">
                This is AI response with a left-aligned tail. Another thing.<br />
                One more thing
                <div
                    className="absolute -left-1.5 top-3 w-0 h-0
                            border-t-8 border-t-transparent
                            border-r-8 border-r-purple-600
                            border-b-8 border-b-transparent"
                ></div>
                </div>
            </div>
        </>

    )
}