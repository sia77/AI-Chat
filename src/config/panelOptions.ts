import type { MenuOptions } from "../interface/interface";
import { RESPONSE_MODE } from "../shared/constant"

export const RESPONSE_OPTIONS:MenuOptions[] = [
    { id:RESPONSE_MODE.STREAM, label: 'Stream' },
    { id:RESPONSE_MODE.COMPLETE, label: 'Complete' },
    { id:RESPONSE_MODE.SSE, label: 'SSE' },
]

export const MEDIA_OPTIONS:MenuOptions[] = [
    { id:'json', label: 'Json' },
    { id:'text', label: 'Text' },
]