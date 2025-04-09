/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react";
import { useCookie } from "../useCookie";

describe("useCookie hook", () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  });

  it("initializes with default value when cookie doesn't exist", () => {
    const { result } = renderHook(() => useCookie("test-cookie", "default-value"));
    expect(result.current[0]).toBe("default-value");
  });

  it("reads existing cookie value", () => {
    document.cookie = "test-cookie=existing-value;path=/";
    const { result } = renderHook(() => useCookie("test-cookie", "default-value"));
    expect(result.current[0]).toBe("existing-value");
  });

  it("updates cookie value", () => {
    const { result } = renderHook(() => useCookie("test-cookie", "default-value"));
    act(() => {
      result.current[1]("new-value");
    });
    expect(result.current[0]).toBe("new-value");
    expect(document.cookie).toContain("test-cookie=new-value");
  });

  it("handles multiple cookies", () => {
    document.cookie = "other-cookie=other-value;path=/";
    document.cookie = "test-cookie=test-value;path=/";
    const { result } = renderHook(() => useCookie("test-cookie", "default-value"));
    expect(result.current[0]).toBe("test-value");
  });
});
