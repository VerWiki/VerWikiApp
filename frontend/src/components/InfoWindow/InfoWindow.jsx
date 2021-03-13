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

export const InfoWindow = ({ info }) => {
  const highlightRelatedNode = (tag) => {
    const tagName = tag.target.tagName;
    if (tagName === "A") {
      console.log(tag.target.getAttribute("href"));
    }
  };

  const safeHTML = DOMPurify.sanitize(info);
  const htmlInfo = new DOMParser().parseFromString(safeHTML, "text/html");

  const aTags = htmlInfo.getElementsByTagName("a");
  for (let i = 0; i < aTags.length; i++) {
    aTags[i].onmouseover = highlightRelatedNode;
  }
  console.log(aTags);

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
      <a
        href="https://google.com"
        onMouseEnter={highlightRelatedNode}
        onMouseLeave={highlightRelatedNode}
      >
        Link
      </a>
      <div
        id="infoWindowDiv"
        dangerouslySetInnerHTML={{ __html: newHTML }}
        onMouseOver={highlightRelatedNode}
      ></div>
    </div>
  );
};
