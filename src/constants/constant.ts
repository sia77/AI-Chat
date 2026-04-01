export const RESPONSE_MODE = {
  STREAM: "stream",
  COMPLETE: "complete",
  SSE: "sse",
} as const;

export type ResponseMode = typeof RESPONSE_MODE[keyof typeof RESPONSE_MODE];