import {
  historyReducer,
  initialHistoryState,
  canGoBack,
  canGoForward,
  MAX_HISTORY,
  HistoryState,
} from "../../questionHistory";

describe("historyReducer", () => {
  describe("PUSH_NEXT", () => {
    test("adds entry and advances index from empty state", () => {
      const state = historyReducer(initialHistoryState, {
        type: "PUSH_NEXT",
        data: "A",
      });
      expect(state.entries).toHaveLength(1);
      expect(state.entries[0]).toEqual({ key: 0, data: "A" });
      expect(state.currentIndex).toBe(0);
      expect(state.nextKey).toBe(1);
    });

    test("appends entry after existing entries", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "B" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "C" });

      expect(state.entries).toHaveLength(3);
      expect(state.currentIndex).toBe(2);
      expect(state.entries.map((e) => e.data)).toEqual(["A", "B", "C"]);
    });

    test("assigns unique incrementing keys", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "B" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "C" });

      expect(state.entries.map((e) => e.key)).toEqual([0, 1, 2]);
    });

    test("truncates future entries when pushing after going back", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "B" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "C" });

      // Go back to B
      state = historyReducer(state, { type: "GO_BACK" });
      expect(state.currentIndex).toBe(1);

      // Push new — C should be discarded
      state = historyReducer(state, { type: "PUSH_NEXT", data: "D" });
      expect(state.entries).toHaveLength(3);
      expect(state.entries.map((e) => e.data)).toEqual(["A", "B", "D"]);
      expect(state.currentIndex).toBe(2);
    });

    test("caps at MAX_HISTORY entries", () => {
      let state = initialHistoryState;
      for (let i = 0; i < MAX_HISTORY + 3; i++) {
        state = historyReducer(state, { type: "PUSH_NEXT", data: `Q${i}` });
      }

      expect(state.entries).toHaveLength(MAX_HISTORY);
      expect(state.currentIndex).toBe(MAX_HISTORY - 1);
      // Oldest entries should have been shifted off
      expect(state.entries[0].data).toBe("Q3");
      expect(state.entries[MAX_HISTORY - 1].data).toBe(`Q${MAX_HISTORY + 2}`);
    });
  });

  describe("GO_BACK", () => {
    test("decrements currentIndex", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "B" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "C" });

      state = historyReducer(state, { type: "GO_BACK" });
      expect(state.currentIndex).toBe(1);

      state = historyReducer(state, { type: "GO_BACK" });
      expect(state.currentIndex).toBe(0);
    });

    test("is a no-op when index is 0", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });

      const before = state;
      const after = historyReducer(state, { type: "GO_BACK" });
      expect(after).toBe(before); // same reference — no change
    });

    test("is a no-op on empty state", () => {
      const after = historyReducer(initialHistoryState, { type: "GO_BACK" });
      expect(after).toBe(initialHistoryState);
    });
  });

  describe("GO_FORWARD", () => {
    test("increments currentIndex", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "B" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "C" });

      state = historyReducer(state, { type: "GO_BACK" });
      state = historyReducer(state, { type: "GO_BACK" });
      expect(state.currentIndex).toBe(0);

      state = historyReducer(state, { type: "GO_FORWARD" });
      expect(state.currentIndex).toBe(1);

      state = historyReducer(state, { type: "GO_FORWARD" });
      expect(state.currentIndex).toBe(2);
    });

    test("is a no-op when at the end", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });

      const before = state;
      const after = historyReducer(state, { type: "GO_FORWARD" });
      expect(after).toBe(before);
    });

    test("is a no-op on empty state", () => {
      const after = historyReducer(initialHistoryState, { type: "GO_FORWARD" });
      expect(after).toBe(initialHistoryState);
    });

    test("preserves entries when going forward", () => {
      let state = initialHistoryState;
      state = historyReducer(state, { type: "PUSH_NEXT", data: "A" });
      state = historyReducer(state, { type: "PUSH_NEXT", data: "B" });
      state = historyReducer(state, { type: "GO_BACK" });
      state = historyReducer(state, { type: "GO_FORWARD" });

      expect(state.entries.map((e) => e.data)).toEqual(["A", "B"]);
      expect(state.currentIndex).toBe(1);
    });
  });

  describe("canGoBack", () => {
    test("returns false for empty state", () => {
      expect(canGoBack(initialHistoryState)).toBe(false);
    });

    test("returns false when at index 0", () => {
      const state: HistoryState = {
        entries: [{ key: 0, data: "A" }],
        currentIndex: 0,
        nextKey: 1,
      };
      expect(canGoBack(state)).toBe(false);
    });

    test("returns true when index > 0", () => {
      const state: HistoryState = {
        entries: [
          { key: 0, data: "A" },
          { key: 1, data: "B" },
        ],
        currentIndex: 1,
        nextKey: 2,
      };
      expect(canGoBack(state)).toBe(true);
    });
  });

  describe("canGoForward", () => {
    test("returns false for empty state", () => {
      expect(canGoForward(initialHistoryState)).toBe(false);
    });

    test("returns false when at the end", () => {
      const state: HistoryState = {
        entries: [{ key: 0, data: "A" }],
        currentIndex: 0,
        nextKey: 1,
      };
      expect(canGoForward(state)).toBe(false);
    });

    test("returns true when there are future entries", () => {
      const state: HistoryState = {
        entries: [
          { key: 0, data: "A" },
          { key: 1, data: "B" },
        ],
        currentIndex: 0,
        nextKey: 2,
      };
      expect(canGoForward(state)).toBe(true);
    });
  });
});
