import type { MediaType } from "./types";
export const ACCEPT_HEADERS: Record<MediaType, string> = {
    json: 'application/json',
    text: 'text/plain',
};

export const TEMPERATURE = 0.7;