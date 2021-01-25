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

/**
 * Replaces the spaces in a given string with hyphens.
 * @param {string} urlString The string to be converted from spaces to hyphens.
 */
export function replaceSpaceCharacters(urlString) {
  let url = "";
  for (let i = 0; i < urlString.length; i++) {
    if (urlString[i] !== " ") {
      url = url.concat(urlString[i]);
    } else {
      url = url.concat("-");
    }
  }
  return url;
}
