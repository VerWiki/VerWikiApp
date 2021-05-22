import React from "react";
import DOMPurify from "dompurify";
import { Button, BackTop } from "antd";
import { Toolbar } from "../Toolbar/Toolbar";
import { CloseOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

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
  closeButtonHandler,
  title,
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
  const closeInfoViewer = (event) => {
    closeButtonHandler(event, {}, false, true);
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
  const button = (
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
  );
  const safeHTML = DOMPurify.sanitize(info);
  return (
    <div>
      <div>
        <Toolbar
          left={
            <Button
              onClick={closeInfoViewer}
              size="medium"
              type="primary"
              icon={<CloseOutlined />}
            />
          }
          center={
            <h2
              style={{
                fontSize: "30px",
              }}
            >
              {title}
            </h2>
          }
          right={
            <Button
              type="primary"
              onClick={() => {
                if (curViewedLink !== "") {
                  window.open(curViewedLink, "_blank");
                }
              }}
            >
              View on CWSL Wiki
            </Button>
          }
        />

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
