import React, { useState, useEffect } from "react";
import styles from "./TreeViewer.module.css";
import ReactJson from "react-json-view";
import { Tree } from "../Tree/Tree";
import { InfoWindow } from "../../components/InfoWindow/InfoWindow";
import { tree } from "d3";

const MAX_DEPTH = 2;

/**
 * Given the original data which has an unbounded number
 * of levels, this function trims the total depth of the tree
 * to the given depth.
 */
function extractObjectWithMaxDepth(obj, depth = MAX_DEPTH) {
  if (depth < 0) {
    return null;
  }

  // Recursively add children of the object if they do not
  // exceed the max depth
  return {
    name: obj.name,
    children: obj.children
      ? obj.children
          .map((node) => extractObjectWithMaxDepth(node, depth - 1))
          .filter((node) => node !== null)
      : [],
  };
}

/**
 * Creates an index so that we can get the reference to
 * a particular node given its name, in constant time.
 *
 * Note: The name of the node is a key within the particular tree
 *
 */
function createNameToNodeMapping(currNode, mapping = {}) {
  mapping[currNode.name] = currNode;
  if (currNode.children) {
    currNode.children.forEach((child) =>
      createNameToNodeMapping(child, mapping)
    );
  }
  return mapping;
}

export const TreeViewer = ({ data, treeID }) => {
  const [trimmedData, setTrimmedData] = useState({});
  const [nameToNodeMapping, setNameToNodeMapping] = useState({});
  const [nodeInfoContent, setNodeInfoContent] = useState("");

  /**
   * This function handles the event where a user clicks a node on the tree
   * and displays the subtree from that point onwards up to MAX_DEPTH.
   */
  const nodeClickHandler = (event, clickedNode) => {
    const subTree = nameToNodeMapping[clickedNode.data.name];

    // Trim the subtree to MAX_DEPTH and set it as the new tree
    setTrimmedData(extractObjectWithMaxDepth(subTree));
  };

  const toggleInfoBoxVisibiliy = () => {
    const articleDiv = document.getElementsByClassName("article")[0];
    const treeDiv = document.getElementById("course-tree");

    if (articleDiv.classList.contains("span-1-of-4")) {
      // Already displaying
      articleDiv.classList.remove("col");
      articleDiv.classList.remove("span-1-of-4");
      treeDiv.classList.remove("col");
      treeDiv.classList.remove("span-3-of-4");
    } else {
      //Not yet displaying
      articleDiv.classList.add("col");
      articleDiv.classList.add("span-1-of-4");
      treeDiv.classList.add("col");
      treeDiv.classList.add("span-3-of-4");
    }
  };

  /**
   * The function to handle right clicks - opens up a window to show
   * summarized information for a given wiki link.
   */
  const rightClickHandler = (event, clickedNode) => {
    event.preventDefault();
    toggleInfoBoxVisibiliy();
    const nodeInfoUrl = replaceSpaceCharacters(
      `http://localhost:3003/get-node-info/${clickedNode.data.name}-${treeID}`
    );
    console.log(nodeInfoUrl);
    fetch(nodeInfoUrl)
      .then((res) => {
        if (res.status !== 200) {
          throw { "Error occurred": res.status };
        }
        return res.json();
      })
      .then((res) => {
        setNodeInfoContent(res);
      })
      .catch((err) => {
        console.log("An error occurred: ", err);
        const defaultInfo = {
          content: "No additional information available for this topic",
        };
        setNodeInfoContent(defaultInfo);
      });
  };

  /**
   * Replaces the spaces in a given string with hyphens.
   * @param {string} urlString The string to be converted from spaces to hyphens.
   */
  const replaceSpaceCharacters = (urlString) => {
    let url = "";
    for (let i = 0; i < urlString.length; i++) {
      if (urlString[i] !== " ") {
        url = url.concat(urlString[i]);
      } else {
        url = url.concat("-");
      }
    }
    return url;
  };

  /**
   * When this component mounts, create the node name -> node pointer mapping
   * from the data and also trim the data so we only render a limited number
   * of levels of the tree.
   */
  useEffect(() => {
    setNameToNodeMapping(createNameToNodeMapping(data));
    setTrimmedData(extractObjectWithMaxDepth(data));
  }, [data]);

  // While the data is still not loaded, render a loading message
  let element = null;
  if (!data || Object.keys(data).length === 0) {
    element = <h2>"Loading..."</h2>;
  } else {
    element = (
      <ReactJson
        name={null}
        src={data}
        theme="ocean"
        style={{ padding: 10, textAlign: "left" }}
        collapsed={2}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    );
  }

  return (
    <div className={styles.nav}>
      <div className="row treeViewerContainer">
        <div className="tree" id="course-tree">
          <Tree
            jsonData={trimmedData}
            onNodeClick={nodeClickHandler}
            onRightClick={rightClickHandler}
          ></Tree>
        </div>
        <div className="article">
          <p>
            <InfoWindow info={nodeInfoContent.content} />
          </p>
        </div>
      </div>
    </div>
  );
};
