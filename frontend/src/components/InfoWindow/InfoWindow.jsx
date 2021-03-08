/**
 * The react component for the information window for each node
 * in the concept tree.
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
