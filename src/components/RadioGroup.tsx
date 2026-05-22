import type { MenuOptions } from "../interface/interface";

 
interface RadioGroupProps {
    groupLabel:string;
    options:MenuOptions[];
    name:string;
    current:string;
    onChange: (e:any)=> void;
    disabledValue?: string | null;
}


export const RadioGroup = ({groupLabel, options, name, current, onChange, disabledValue}:RadioGroupProps) => {
    
    return(
        <div className="">
            <p className="font-bold text-xs uppercase text-gray-400 mb-2">{ groupLabel }</p>
            {options.map( (opt:any) =>(
                <div key={opt.id}>
                    <div className = "">
                        <label htmlFor={opt.id} className="text-gray-800 text-sm">
                            <input
                                type = "radio" 
                                id = {opt.id} 
                                name = {name}
                                value = {opt.id} 
                                checked = {current === opt.id} 
                                onChange = {onChange}
                                disabled = {opt.id === disabledValue} 
                                className="mr-2"
                            />
                        {opt.label} 
                        </label>
                    </div>
                </div>
            ))}
        </div>
    )
}