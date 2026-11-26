import { useState, useEffect } from "react";

function readStoredValue(key, initialState) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  } catch (error) {
    return initialState;
  }
}

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() => readStoredValue(key, initialState));

  useEffect(
    function () {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        return;
      }
    },
    [value, key],
  );

  return [value, setValue];
}
