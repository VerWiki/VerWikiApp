/**
 * The react component for the information window for each node
 * in the concept tree.
 * Note: dangerouslySetInnerHTML property used here becomes safe if
 * sanitization is done to the incoming htmlInfo using DOMPurify
 */

import React from "react";
import DOMPurify from "dompurify";

export const InfoWindow = ({ info }) => {
  const safeHTML = DOMPurify.sanitize(info);
  return (
    <div>
      <h2>Wiki Information</h2>
      <div
        id="infoWindowDiv"
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      ></div>
    </div>
  );
};
