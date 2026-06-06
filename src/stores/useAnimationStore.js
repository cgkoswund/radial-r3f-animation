import { create } from "zustand";

const useAnimationStore = create((set) => ({
  currentStep: 0,
  keyElementIndex: 0,
  insertionSlotIndex: 0,
  arrayToSort: [],
  cachedTriangles: [],
  setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useAnimationStore;
