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
  let url = urlString.trim();
  return url.replaceAll(" ", "-");
}

/**
 * A function to bound the passed in value to 1 upper bound
 * @param z - An integer to be bound between 0 and 1
 */
export function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Function to return the x, y, width and height of "this".
 * x, y are the coordinates of the root, and width, height are
 * the dimensions of the object.
 * See https://css-tricks.com/scale-svg/#the-viewbox-attribute
 */
export function autoBox() {
  const { x, y, width, height } = this.getBBox();
  return [x, y, width, height];
}
