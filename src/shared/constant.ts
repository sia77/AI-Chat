import type { MediaType } from "./types";
export const ACCEPT_HEADERS: Record<MediaType, string> = {
    json: 'application/json',
    text: 'text/plain',
};

export const RESPONSE_MODE = {
  STREAM: "stream",
  COMPLETE: "complete",
  SSE: "sse",
} as const;

export type ResponseMode = typeof RESPONSE_MODE[keyof typeof RESPONSE_MODE];

export const TEMPERATURE = 0.7;