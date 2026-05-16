
interface Item {
    label:string;
    id:string;
}

interface Dropdown2Props {
    items:Item[];
    groupLabel:string;
    selectedModelId:string;
    setModelId: (modelId:string) => void;
}

export const Dropdown2 = ({items, groupLabel, selectedModelId, setModelId}:Dropdown2Props) => {

    const handleModelSelection = (modelId:string) => {
        console.log("modelId: ", modelId)
        setModelId(modelId);
    }

    return (
        <div>
            <p className="font-bold text-xs uppercase text-gray-400 mb-2">{groupLabel}</p>

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
                                    ${selectedModelId ===item.id ? "bg-gray-300":""}`}
                                onClick={() => handleModelSelection(item.id)}>{item.label}</div>
                        )
                    )
                }
            </div>
        </div>
    )
}