export const MAX_HISTORY = 11;

export interface HistoryEntry {
  key: number;
  data: any;
}

export interface HistoryState {
  entries: HistoryEntry[];
  currentIndex: number;
  nextKey: number;
}

export type HistoryAction =
  | { type: "PUSH_NEXT"; data: any }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" };

export const initialHistoryState: HistoryState = {
  entries: [],
  currentIndex: -1,
  nextKey: 0,
};

export function canGoBack(state: { currentIndex: number }): boolean {
  return state.currentIndex > 0;
}

export function canGoForward(state: { entries: unknown[]; currentIndex: number }): boolean {
  return state.currentIndex < state.entries.length - 1;
}

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "PUSH_NEXT": {
      const truncated = state.entries.slice(0, state.currentIndex + 1);
      const newEntry: HistoryEntry = { key: state.nextKey, data: action.data };
      let entries = [...truncated, newEntry];
      let currentIndex = entries.length - 1;

      if (entries.length > MAX_HISTORY) {
        entries = entries.slice(entries.length - MAX_HISTORY);
        currentIndex = entries.length - 1;
      }

      return { entries, currentIndex, nextKey: state.nextKey + 1 };
    }
    case "GO_BACK": {
      if (!canGoBack(state)) return state;
      return { ...state, currentIndex: state.currentIndex - 1 };
    }
    case "GO_FORWARD": {
      if (!canGoForward(state)) return state;
      return { ...state, currentIndex: state.currentIndex + 1 };
    }
  }
}
