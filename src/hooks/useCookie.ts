import { useState, useCallback } from "react";

export function useCookie(name: string, initialValue: string) {
  const getCookie = useCallback(() => {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) => c.trim().startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : initialValue;
  }, [name, initialValue]);

  const [value, setValue] = useState(getCookie);

  const updateCookie = useCallback(
    (newValue: string, days = 30) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${newValue};expires=${expires.toUTCString()};path=/`;
      setValue(newValue);
    },
    [name]
  );

  return [value, updateCookie] as const;
}
