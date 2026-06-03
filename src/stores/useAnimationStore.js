import { create } from "zustand";

const useAnimationStore = create((set) => ({
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
}));

export default useAnimationStore;
