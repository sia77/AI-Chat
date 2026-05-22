
interface ResponseModeProps {
    responseType:string;
    mediaType:string;

}

export const DisplayResponseMode = ({...props}:ResponseModeProps) => {

    return(
        <>
            <div className="w-fit border border-[#443d3d36] rounded-2xl 
                            text-[12px] text-[#000000c4]
                            px-2 mt-2.5
                            bg-[#f6f6f6]">
                <div>{props.responseType}/{props.mediaType}</div>
            </div>
        </>
    )
}