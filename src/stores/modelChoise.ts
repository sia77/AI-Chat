import { create } from 'zustand';
//import { persist } from 'zustand/middleware';

type ModelIdStore = {
    modelId:string;
    setModelId:(modelId:string) => void;
}

export const useModelIdStore = create<ModelIdStore>((set) => ({
    modelId:"gemini-2.5-flash-lite",
    setModelId:(modelId:string) => {
        
        set(() => {
            return {modelId: modelId}
        })
    },
}));

