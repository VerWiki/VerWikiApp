import React from "react";
import DOMPurify from "dompurify";

/**
 * The react component for the information window for each node
 * in the concept tree.
 * Note: dangerouslySetInnerHTML property used here becomes safe if
 * sanitization is done to the incoming htmlInfo using DOMPurify
 */

export const InfoWindow = ({ info, linkHoverHandler }) => {
  const highlightRelatedNode = (tag) => {
    const tagName = tag.target.tagName;
    if (tagName === "A") {
      const link = tag.target.getAttribute("href");
      if (!link.startsWith("#")) {
        // Link to a webpage
        linkHoverHandler(tag.target);
      }
    } else {
      linkHoverHandler(null);
    }
  };
  const safeHTML = DOMPurify.sanitize(info);
  return (
    <div>
      <h2>Wiki Information</h2>
      <div
        id="infoWindowDiv"
        dangerouslySetInnerHTML={{ __html: safeHTML }}
        onMouseOver={highlightRelatedNode}
      ></div>
    </div>
  );
};

/**
 * if (node being hovered over has depth < MAXDEPTH) {
 * Idea #1 - instead of highlighting the path from cur node to highlighted node,
 * just highlight the subtree of the node itself
 * } else {
 * Idea #2 - When hovering over a link that is off the tree, just preview the subtree
 * of the node that is being hovered over, and go to that subtree with animation when clicked
 * on the said link - Use Mit's code to get back to the previously rendered tree
 * }
 */
