import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
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
      if (link.startsWith("#")) {
        // This link is in the table of contents
        console.log("YOURE IN TABLE OF CONTENTS");
      } else {
        // Link to VerWiki
        linkHoverHandler(tag.target);
      }
    } else {
      linkHoverHandler(null);
    }
  };

  const safeHTML = DOMPurify.sanitize(info);
  const htmlInfo = new DOMParser().parseFromString(safeHTML, "text/html");

  const aTags = htmlInfo.getElementsByTagName("a");
  for (let i = 0; i < aTags.length; i++) {
    aTags[i].onmouseover = highlightRelatedNode;
  }
  // aTags.map((aTag) => {
  //   aTag.onmouseenter = highlightRelatedNode;
  //   aTag.onmouseleave = highlightRelatedNode;
  //   aTag.onclick((e) => {
  //     console.log(e);
  //   });
  //   return aTag;
  // });

  // console.log(aTags);

  const newHTML = new XMLSerializer().serializeToString(htmlInfo); //converts funcs to string

  // console.log(newHTML);

  // return (
  //   <div>
  //     <h2>Wiki Information</h2>
  //     <a href="https://google.com" onMouseOver={highlightRelatedNode}>
  //       Link
  //     </a>
  //     {ReactHtmlParser(newHTML)}
  //   </div>
  // );

  return (
    <div>
      <h2>Wiki Information</h2>
      <div
        id="infoWindowDiv"
        dangerouslySetInnerHTML={{ __html: newHTML }}
        onMouseOver={highlightRelatedNode}
      ></div>
    </div>
  );
};
