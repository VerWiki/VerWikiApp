import React from "react";
import DOMPurify from "dompurify";

/**
 * The react component for the information window for each node
 * in the concept tree.
 * Note: dangerouslySetInnerHTML property used here becomes safe if
 * sanitization is done to the incoming htmlInfo using DOMPurify
 */

export const InfoWindow = ({ info }) => {
  //const safeHTML = DOMPurify.sanitize(info);

  const highlightRelatedNode = () => {
    console.log("Reached here");
  };

  const safeHTML = info;
  return (
    <div>
      <h2>Wiki Information</h2>
      <a
        href="https://google.com"
        onMouseEnter={highlightRelatedNode}
        onMouseLeave={highlightRelatedNode}
      >
        Link
      </a>
      <div
        id="infoWindowDiv"
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      ></div>
    </div>
  );
};
