import { useRef, useEffect } from "react";
/**
 * Tracks the previous value of the given item. Returns
 * the previous value
 * @param value : The object to be tracked
 */

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
