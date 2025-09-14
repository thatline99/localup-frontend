import { create } from 'zustand';

interface AIState {
  selectedSessionId: string | null;
  setSelectedSessionId: (sessionId: string | null) => void;
}

const useAIStore = create<AIState>((set) => ({
  selectedSessionId: null,
  setSelectedSessionId: (sessionId) => set({ selectedSessionId: sessionId }),
}));

export default useAIStore;