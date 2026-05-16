import { create } from 'zustand';
//import { persist } from 'zustand/middleware';

type ModelIdStore = {
    modelId:string;
    setModelId:() => void;
}

export const useModelIdStore = create<ModelIdStore>((set) => ({
    modelId:"gemini-2.5-flash-lite",
    setModelId:() => {
        set({modelId:"gemini-2.5-flash"})
    },
}));

    // persist({
    //     theme: 'light',
    //     language: 'en',
    //     selectedCategories: [],



    //     toggleCategory: (categoryId) =>
    //         set((state) => ({

    //         }))
    // }

    // )