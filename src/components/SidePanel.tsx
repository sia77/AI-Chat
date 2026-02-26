import { useState } from "react"
import { Settings } from 'lucide-react';


export const SidePanel = () => {

    const [open, setOpen] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState('stream');
    const [selectedMediaType, setSelectedMediaType] = useState('json');

    const handleChangeResponse = (event:any) => {
        setSelectedResponse(event.target.value);
    }

    const handleChangeMediaType = (event:any) => {
        setSelectedMediaType(event.target.value);
    }

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
                    <div>
                        <div className = "">
                            <label htmlFor="stream">
                                <input className="mr-2" type="radio" id="stream" name="response" value="stream" checked = {selectedResponse === 'stream'} onChange={handleChangeResponse} />
                                Stream
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className = "">
                            <label htmlFor="complete">
                                <input className="mr-2" type="radio" id="complete" name="response" value="complete" checked = {selectedResponse === 'complete'} onChange={handleChangeResponse} />
                                Complete
                            </label>
                        </div>
                    </div>

                    <div>
                        <div className = "">
                            <label htmlFor="sse">
                                <input className="mr-2" type="radio" id="sse" name="response" value="sse" checked = {selectedResponse === 'sse'} onChange={handleChangeResponse} />
                                SSE
                            </label>
                        </div>
                    </div>
                    <hr className="my-2 w-[60%] opacity-10" />
                    <div>
                        <div className = "">
                            <label htmlFor="json">
                                <input type="radio" className="mr-2" id='json' name="mediaType" value="json" checked = {selectedMediaType === 'json'} onChange = {handleChangeMediaType} />
                                Json
                            </label>                            
                        </div>                        
                    </div>
                    <div>                
                        <div className = "">
                            <label htmlFor="text">
                                <input type="radio" className="mr-2" id="text" name="mediaType" value="text" checked = {selectedMediaType === 'text'} onChange = {handleChangeMediaType} disabled = {selectedResponse === 'sse'} />
                            Text
                            </label>
                        </div>
                    </div>

                </form>


            </div>
        </div>
    )
}