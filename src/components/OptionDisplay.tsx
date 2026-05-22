import { ThreeDots } from "./ThreeDots";

interface Item {
    label:string;
    id:string;
}

interface OptionDisplayProps {
    items:Item[];
    groupLabel:string;
    selectedId:string;
    onChange: (modelId:string) => void;
    isLoading:boolean;
    isError:boolean;
    error:Error | null;
}

export const OptionDisplay = ({
    items = [], 
    groupLabel, 
    selectedId, 
    onChange, 
    isLoading, 
    isError, 
    error
}:OptionDisplayProps) => {

    const handleModelSelection = (modelId:string) => {
        onChange(modelId);
    }

    return (
        <div>
            <p className="font-bold text-xs uppercase text-gray-400 mb-2">{groupLabel}</p>            
            
            { isLoading && (
                <div className="flex justify-center items-center w-[50%] pt-4">
                    <ThreeDots />
                </div> 
            )}
            { isError && error && (
                <div className="text-xs p-1">{error.message}</div>
            )}
            {!isLoading && !isError && (
                <div className="
                    overflow-hidden 
                    w-[150px]
                    rounded
                    py-1">
                {
                    items.map((item:Item) =>
                        (
                            <div 
                                key={item.id} 
                                className={`text-gray-800 
                                    text-sm 
                                    pl-1 
                                    cursor-pointer
                                    rounded 
                                    hover:bg-gray-300
                                    ${selectedId ===item.id ? "bg-gray-300":""}`}
                                onClick={() => handleModelSelection(item.id)}>{item.label}</div>
                        )
                    )
                }
            </div>

            )}
        </div>
    )
}