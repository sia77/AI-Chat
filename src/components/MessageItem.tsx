
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Message } from "../types/types"; // adjust import to your project

const remarkPlugins = [remarkGfm, remarkBreaks];

type MessageProps = {
  message: Message;
};

export const MessageItem = ({ message }: MessageProps) => {
//   // normalize CRLF -> LF and ensure we always have a string
//     const raw = (message.text ?? "")
//     .replace(/\\n/g, "\n")  // converts literal "\n" into real newlines
//     .replace(/\r\n/g, "\n");

//   // Only tweak formatting for AI messages (optional)
//   const formattedText =
//     message.sender === "ai"
//       ? // collapse 2+ newlines to exactly 2 (keeps paragraph spacing predictable)
//         raw.replace(/\n{2,}/g, "\n\n")
//       : raw;

    //   console.log("raw: ", JSON.stringify(message));
    //   console.log("Formatted: ", JSON.stringify(message));  

  return (
    <>
      {message.sender === "user" ? (
        <div className="flex justify-end mb-2">
          <div className="relative max-w-[75%] bg-blue-500 text-white p-3 rounded-lg shadow">
            <ReactMarkdown remarkPlugins={remarkPlugins}>
              {message.text}
            </ReactMarkdown>

            <div
              className="absolute -right-1.5 top-3 w-0 h-0
                         border-t-8 border-t-transparent
                         border-l-8 border-l-blue-500
                         border-b-8 border-b-transparent"
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-start mb-2">
          <div className="markdown relative max-w-[75%] bg-[#9f007d] text-white p-3 rounded-lg shadow">
            <ReactMarkdown  remarkPlugins={remarkPlugins}>
              {message.text}
            </ReactMarkdown>

            <div
              className="absolute -left-1.5 top-3 w-0 h-0
                         border-t-8 border-t-transparent
                         border-r-8 border-r-[#9f007d]
                         border-b-8 border-b-transparent"
            />
          </div>
        </div>
      )}
    </>
  );
};
