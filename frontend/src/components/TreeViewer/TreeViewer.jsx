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
 * a particular node, given its name, in constant time.
 *
 * TODO: Confirm if duplicate names are possible or not
 */
function createNameToNodeMapping(obj) {
  const mapping = {};

  const helper = (currNode) => {
    mapping[currNode.name] = currNode;

    if (currNode.children) {
      currNode.children.forEach((child) => helper(child));
    }
  };

  helper(obj);
  return mapping;
}

export const TreeViewer = ({ data }) => {
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
      <Tree jsonData={trimmedData} onNodeClick={nodeClickHandler}></Tree>
      {element}
    </div>
  );
};
