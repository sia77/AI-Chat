import { useState } from "react"
import type { Message } from "../types/types"

export const UseStreamJsonMultipeCandidates = () => {
  const base_url = import.meta.env.VITE_BASE_URL;
  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = async(message:string) => {
    // create the local history snapshot that includes the new user message
    const localHistory = [...messages, {role: 'user', text: message}];

    // update UI immediately with user message and placeholder for model
    setMessages(prev => [...prev, {role: 'user', text: message}, {role: 'model', text: ""}]);

    try {
      const response = await fetch(`${base_url}/api/chat/stream/json`, {
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify({prompt: message, temperature: 0.7, history: localHistory})
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      // Keep reference to index of the placeholder model message (last item)
      // We inserted user message then a model placeholder, so placeholder index is current length-1
      let placeholderIndex = (messages.length + 1);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // split NDJSON lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            const incomingText = obj.text ?? "";

            // Update the placeholder message in UI (append incremental text)
            setMessages(prev => {
              const copy = prev.slice();
              // If placeholderIndex is out of bounds, push a new model message
              if (placeholderIndex >= copy.length) {
                copy.push({ role: "model", text: incomingText });
                placeholderIndex = copy.length - 1;
              } else {
                // replace/update the placeholder entry
                copy[placeholderIndex] = { role: "model", text: incomingText };
              }
              return copy;
            });

          } catch (err) {
            console.error("JSON parse error:", err, "line:", line);
          }
        }
      }

      console.log("stream finished");
    } catch (err) {
      console.error("stream error", err);
      // update placeholder to show an error
      setMessages(prev => {
        const copy = prev.slice();
        const idx = copy.length - 1;
        if (idx >= 0 && copy[idx].role === "model") copy[idx].text = "Error: stream failed";
        return copy;
      });
    }
  }

  return { messages, handleSend }
}