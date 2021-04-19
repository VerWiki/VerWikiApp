import React from "react";
import DOMPurify from "dompurify";

/**
 * The react component for the information window for each node
 * in the concept tree.
 * Note: dangerouslySetInnerHTML property used here becomes safe if
 * sanitization is done to the incoming htmlInfo using DOMPurify
 */

export const InfoWindow = ({ info, linkHoverHandler, linkClickHandler }) => {
  const highlightRelatedNode = (e) => {
    const elementType = e.target.tagName;
    //Check if we hovered over a link (as opposed to plain text etc)
    if (elementType === "A") {
      const link = e.target.getAttribute("href");
      if (!link.startsWith("#")) {
        // Link to a webpage
        linkHoverHandler(e.target);
      }
    } else {
      linkHoverHandler(null);
    }
  };
  const clickInfoViewerHandler = (e) => {
    const elementType = e.target.tagName;
    //Check if we clicked a link (as opposed to plain text etc)
    if (elementType === "A") {
      const link = e.target.getAttribute("href");
      if (!link.startsWith("#")) {
        // Link to a webpage
        linkClickHandler(e);
      }
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
        onClick={clickInfoViewerHandler}
      ></div>
    </div>
  );
};
