
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Message } from "../shared/types"; 


const remarkPlugins = [remarkGfm, remarkBreaks];

type MessageProps = {
  message: Message;
};

export const MessageItem = ({ message }: MessageProps) => {

  if(message.role === "user"){
    return(
      <div className="flex justify-end mb-4">
        <div className="relative max-w-[75%] bg-blue-500 text-white p-3 rounded-lg shadow">
          <ReactMarkdown remarkPlugins={remarkPlugins}>
            {message.text}
          </ReactMarkdown>

          {/* The notch */}
          <div
            className="absolute -right-1.5 top-3 w-0 h-0
                        border-t-8 border-t-transparent
                        border-l-8 border-l-blue-500
                        border-b-8 border-b-transparent"
          />
        </div>
      </div>
    );
  }

  if(message.role === "model"){
    return(
      <div className="flex justify-start mb-4">
        <div className="markdown relative max-w-[75%] bg-[#9f007d] text-white p-3 rounded-lg shadow">
          <ReactMarkdown  remarkPlugins={remarkPlugins}>
            {message.text}
          </ReactMarkdown>

          {/* The notch */}
          <div
            className="absolute -left-1.5 top-3 w-0 h-0
                      border-t-8 border-t-transparent
                      border-r-8 border-r-[#9f007d]
                      border-b-8 border-b-transparent"
          />
        </div>          
      </div>
    );
  }

  if(message.role === "system"){
    return(
      <div className="flex justify-left my-10">
        <div 
          className="text-xs uppercase  
                  text-gray-500 bg-gray-100 px-4 
                    py-1 rounded-lg border 
                  border-gray-200">{message.text}
        </div>
      </div>
    );
  }

  if(message.role === "error"){
    return(
      <div className="flex justify-left my-10">
        <div 
          className="text-xs uppercase  
                  text-red-500 bg-red-100 px-4 
                    py-1 rounded-lg border 
                  border-red-200">{message.text}
        </div>
      </div>
    );
  }

  return null;
  
};
