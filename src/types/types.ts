export type Message = {
    role: 'user' | 'model',
    text: string
}

type DeliveryMode = "stream" | "complete";
type HistoryMode = "stateless" | "with-history";
type ResponseFormat = "text" | "json";
type Transport = "fetch" | "sse";

export interface LLMMode {
  delivery: DeliveryMode;
  history: HistoryMode;
  format: ResponseFormat;
  transport?: Transport;
}