import { useState } from "react"
import { Settings } from 'lucide-react';
import { RadioGroup } from "./RadioGroup";
import { MEDIA_OPTIONS, RESPONSE_OPTIONS } from "../config/panelOptions";

interface SidePanelProps {
    selectedResponseType:string;
    setSelectedResponseType: (val:string) => void;
    selectedMediaType:string;
    setSelectedMediaType: (val:string) => void;
}

export const SidePanel = ({ ...props }: SidePanelProps) => {

    const [open, setOpen] = useState(false);

    return (
        <div className="text-left ml-5 mt-3 relative inline-block">
            <div
                className="relative z-10000000" 
                onClick={() => setOpen((prev) => !prev)}>
                <Settings className={`cursor-pointer h-5 w-5 transition-transform duration-300 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out pt-10 pl-5 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`} >
                <form>
                    <RadioGroup
                        groupLabel="Response Type"
                        name="response"
                        options = {RESPONSE_OPTIONS}
                        current={props.selectedResponseType}
                        onChange={(e: any) => props.setSelectedResponseType(e.target.value)}
                    />
                    <hr className="w-[60%] opacity-10 mt-2 mb-4" />
                    <RadioGroup
                        groupLabel="Media Type"
                        name="media"
                        options = {MEDIA_OPTIONS}
                        current = {props.selectedMediaType}
                        onChange = { (e:any) => props.setSelectedMediaType(e.target.value)}
                        disabledValue={props.selectedResponseType === 'sse' ? 'text' : null}
                    />
                </form>
            </div>
        </div>
    )
}