import { useState } from "react"

type DropdownItem = {
    label:string;
    onClick: () => void;
}

type DropdownProps = {
    //label: string;
    items: DropdownItem[];
}


export const Dropdown = ({items}:DropdownProps) => {
    const [open, setOpen] = useState(false);  


    console.log("items: ", items);

    return(
        <div className="text-right mr-10 mt-3 relative inline-block">
            <button className="cursor-pointer" onClick={() => setOpen(!open)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 rounded-md hover:bg-[#abc7eb] text-amber-700 hover:text-[#ca5b0f]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>                
            </button>

            {open && 
                ( 
                <div className="absolute right-0 z-10 bg-white border border-gray-300 rounded-md w-[150px] px-2 py-1 shadow-lg">
                   {(
                        items.map((item, index) => (
                            <div 
                                key={index}
                                className="text-left cursor-pointer hover:bg-gray-100"
                                onClick={()=> item.onClick()}>{item.label}</div>
                        ))
                    )} 
                </div>                    
                )
            }
        </div>

    )

} 