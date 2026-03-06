export type Message = {
    role: 'user' | 'model',
    text: string
}

export type MediaType = 'json' | 'text';
export type ResponseTypeLLM = 'stream' | 'complet' | 'sse';
export type PanelMode = 'closed' | 'floating' | 'docked';