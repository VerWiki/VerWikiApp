import React from "react";
import DOMPurify from "dompurify";

/**
 * The react component for the information window for each node
 * in the concept tree.
 * Note: dangerouslySetInnerHTML property used here becomes safe if
 * sanitization is done to the incoming htmlInfo using DOMPurify
 */

export const InfoWindow = ({ info, linkHoverHandler, linkClickHandler }) => {
  const goToRelatedNode = (tag) => {
    const elementType = tag.target.tagName;
    //Check if we hovered over a link (as opposed to plain text etc)
    if (elementType === "A") {
      const link = tag.target.getAttribute("href");
      if (!link.startsWith("#")) {
        // Link to a webpage
        linkClickHandler(tag.target);
      }
    } else {
      linkClickHandler(null);
    }
  };

  const highlightRelatedNode = (tag) => {
    const elementType = tag.target.tagName;
    //Check if we hovered over a link (as opposed to plain text etc)
    if (elementType === "A") {
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
        onClick={(e) => {
          e.preventDefault();
          goToRelatedNode(e);
        }}
      ></div>
    </div>
  );
};
