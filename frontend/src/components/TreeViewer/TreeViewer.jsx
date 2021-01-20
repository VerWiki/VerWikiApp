import React, { useState, useEffect } from "react";
import styles from "./TreeViewer.module.css";
import ReactJson from "react-json-view";
import { Tree } from "../Tree/Tree";

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

  /**
   * This function handles the event where a user clicks a node on the tree
   * and displays the subtree from that point onwards up to MAX_DEPTH.
   */
  const nodeClickHandler = (event, clickedNode) => {
    const subTree = nameToNodeMapping[clickedNode.data.name];

    // Trim the subtree to MAX_DEPTH and set it as the new tree
    setTrimmedData(extractObjectWithMaxDepth(subTree));
  };

  /**
   * The function to handle right clicks - opens up a window to show
   * summarized information for a given wiki link.
   */
  const rightClickHandler = (event, clickedNode) => {
    event.preventDefault();
    const nodeInfoUrl = replaceSpaceCharacters(
      `http://localhost:3003/get-node-info/${clickedNode.data.name}-${treeID}`
    );
    console.log(nodeInfoUrl);
    fetch(nodeInfoUrl)
      .then((res) => res.json())
      .then((res) => {
        let content = res["content"];
        console.log(content);
      });
    /**
     * TODO: STRATEGY FOR THE NEXT STEPS
     * 1. create URL of the form {tree_id/node_name} [DONE]
     * 2. Pass URL through a function to replace all spaces with underscores/hyphens [DONE]
     * 3. Create a route in the backend - gets the link stored in the db [DONE]
     * 4. Create a method that parses the link's text [DONE]
     * 5. Use a NN to summarize it.
     * 6. display that summary in the information window
     */
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
      <Tree
        jsonData={trimmedData}
        onNodeClick={nodeClickHandler}
        onRightClick={rightClickHandler}
      ></Tree>
      {element}
    </div>
  );
};
