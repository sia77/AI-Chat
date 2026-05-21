import { Settings } from 'lucide-react';
import { RadioGroup } from "./RadioGroup";
import { MEDIA_OPTIONS, RESPONSE_OPTIONS } from "../config/panelOptions";
import type { MediaType, PanelMode, ResponseTypeLLM } from "../shared/types";
import { type Dispatch, type SetStateAction } from 'react';
import { DisplayResponseMode } from './DisplayResponseMode';
import { useFetchModelNameService } from '../hooks/useFetchModelNameService';
import { OptionDisplay } from './OptionDisplay';
import { useModelIdStore } from '../stores/modelChoise';

interface SidePanelProps {
    panelRef:React.RefObject<HTMLDivElement | null>;
    selectedResponseType:ResponseTypeLLM;
    setSelectedResponseType: (val:ResponseTypeLLM) => void;
    selectedMediaType:MediaType;
    setSelectedMediaType: (val:MediaType) => void;
    panelMode:PanelMode;
    setPanelMode: Dispatch<SetStateAction<PanelMode>>;
}

export const SidePanel = ({ ...props }: SidePanelProps) => { 

    const { data, isLoading, isError, error } = useFetchModelNameService()
    const modelId = useModelIdStore((state) => state.modelId)
    const setModelId = useModelIdStore((state) => state.setModelId);

    if(isLoading) return <div>Fetching availiable model list</div>
    if(isError) return <div>Only default model available: {error.message}</div>
    
    const handleResponseTypeChange = (responseType:ResponseTypeLLM) => {

        props.setSelectedResponseType(responseType)

        if(responseType === "sse"){
            props.setSelectedMediaType("json");
        }
    }
    
    return (
        <div className="text-left ml-5 mt-3 relative inline-block" ref={props.panelRef}>
            <div
                className="relative z-45" 
                onClick={() =>
                    props.setPanelMode((prev: PanelMode) =>
                        prev === 'closed' ? 'floating' : 'closed'
                    )
                }>
                <Settings className={`cursor-pointer h-5 w-5 transition-transform duration-300 ease-in-out ${props.panelMode == 'closed' ? 'rotate-180' : 'rotate-0'}`} />
                
            </div>
            <DisplayResponseMode responseType={props.selectedResponseType} mediaType= {props.selectedMediaType} />
            <div className="relative z-40">
                <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out pt-10 pl-5 ${
            props.panelMode === 'floating' ? 'translate-x-0' : '-translate-x-full'
            }`} >
                    <form>
                        <RadioGroup
                            groupLabel="Response Type"
                            name="response"
                            options = {RESPONSE_OPTIONS}
                            current={props.selectedResponseType}
                            onChange={(e: any) => handleResponseTypeChange(e.target.value)}
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
                        <hr className="w-[60%] opacity-10 mt-2 mb-4" />
                        {/* <Dropdown items={data?.models} /> */}
                        <OptionDisplay
                            groupLabel="Available LLMs" 
                            items={data?.models}
                            selectedId = {modelId}
                            onChange = {setModelId} />
                    </form>
                </div>

            </div>
        </div>
    )
}