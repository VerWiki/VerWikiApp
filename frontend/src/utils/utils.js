import { useRef, useEffect } from "react";

/**
 * Join the list of node names into one string, and add
 * an extra slash at the end so the user knows what the
 * delimiter is initially, when there is only one node
 * in the path.
 */
export function convertPathToString(path) {
  return path.join("/") + "/";
}

export function convertStringToPath(string) {
  // Remove preceding or trailing slashes and spaces
  return string.trim().replace(/^\/+/, "").replace(/\/+$/, "").split("/");
}

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

/**
 * Gets the arguments of the query string from a given URL
 * @param {string} name The name of the query-string parameter to get
 * @param {string} url The url from where to parse query string
 */
export const getParameterByName = (name, url) => {
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export function calculateMaxDepth(root) {
  if (root == null || root === undefined) {
    return 0;
  }
  let maxDepth = 0;
  if (root.children == null || root.children === undefined) {
    return 0;
  }
  root.children.forEach((child) => {
    const depth = calculateMaxDepth(child);
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  });
  return 1 + maxDepth;
}
