/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "../useTimer";

describe("useTimer hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("initializes elapsedTime to 0", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.timerElapsedSeconds).toBe(0);
  });

  it("increments elapsedTime after 1 second", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timerElapsedSeconds).toBe(1);
  });

  it("resets elapsedTime to 0 when reset is called", () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.timerElapsedSeconds).toBe(3);
    act(() => {
      result.current.resetTimer();
    });
    expect(result.current.timerElapsedSeconds).toBe(0);
  });
});
