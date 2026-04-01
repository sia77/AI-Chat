export type Message = {
    role: 'user' | 'model' | 'system' | 'error',
    text: string
}

export type MediaType = 'json' | 'text';
export type ResponseTypeLLM = 'stream' | 'complete' | 'sse';
export type PanelMode = 'closed' | 'floating' | 'docked';