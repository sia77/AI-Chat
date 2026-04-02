import { RESPONSE_MODE } from "../shared/constant"

export const RESPONSE_OPTIONS = [
    { id:RESPONSE_MODE.STREAM, label: 'Stream' },
    { id:RESPONSE_MODE.COMPLETE, label: 'Complete' },
    { id:RESPONSE_MODE.SSE, label: 'SSE' },
]

export const MEDIA_OPTIONS = [
    { id:'json', label: 'Json' },
    { id:'text', label: 'Text' },
]