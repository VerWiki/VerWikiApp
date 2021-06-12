import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { Button, BackTop } from "antd";
import "antd/dist/antd.css";
import { Logger } from "../../utils/Logger";

/**
 * The react component for the information window for each node
 * in the concept tree.
 * Note: dangerouslySetInnerHTML property used here becomes safe if
 * sanitization is done to the incoming htmlInfo using DOMPurify
 */

export const InfoWindow = ({
  info,
  linkHoverHandler,
  linkClickHandler,
  curViewedLink,
  contentRef,
}) => {
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
  /**
   * Scrolls to the top of the article whenever the
   * current article in the infoviewer changes
   */
  useEffect(() => {
    Logger.debug("Scrolling to top");
    contentRef.current.scrollTo(0, 0);
    // Don't want to include contentRef as a dependency as
    // this means that the scroll up will begin happening before
    // the article changes
    // eslint-disable-next-line
  }, [info]);
  const safeHTML = DOMPurify.sanitize(info);
  return (
    <div>
      <div>
        <h2
          style={{
            display: "inline-block",
            float: "left",
            paddingLeft: "20px",
            fontSize: "30px",
          }}
        >
          Wiki Information
        </h2>
        <Button
          type="primary"
          style={{
            display: "inline-block",
            float: "right",
            paddingRight: "20px",
          }}
          onClick={() => {
            if (curViewedLink !== "") {
              window.open(curViewedLink, "_blank");
            }
          }}
        >
          View on CWSL Wiki
        </Button>
        <div
          id="infoWindowDiv"
          style={{
            paddingTop: "50px",
            textAlign: "left",
          }}
          dangerouslySetInnerHTML={{ __html: safeHTML }}
          onMouseOver={highlightRelatedNode}
          onClick={clickInfoViewerHandler}
        ></div>
      </div>
      <BackTop target={() => contentRef.current} />
    </div>
  );
};
