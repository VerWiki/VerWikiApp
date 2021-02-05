import React, { useState, useEffect } from "react";
import styles from "./TreeViewer.module.css";
import ReactJson from "react-json-view";
import { Tree } from "../Tree/Tree";
import { NodePathHistory } from "../NodePathHistory/NodePathHistory";
import "fontsource-roboto";

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

/**
 * Traverse from currNode to the ancestor node called ancestorNodeName
 * and collect all the node names along the path.
 */
function pathToAncestor(currNode, ancestorNodeName, history = []) {
  if (currNode && currNode.data.name !== ancestorNodeName) {
    history.push(currNode.data.name);
    pathToAncestor(currNode.parent, ancestorNodeName, history);
  }

  return history;
}

export const TreeViewer = ({ data }) => {
  const [trimmedData, setTrimmedData] = useState({});
  const [nameToNodeMapping, setNameToNodeMapping] = useState({});
  const [currentPath, setCurrentPath] = useState([]);

  /**
   * This function handles the event where a user clicks a node on the tree
   * and displays the subtree from that point onwards up to MAX_DEPTH.
   */
  const nodeClickHandler = (event, clickedNode) => {
    const nodeName = clickedNode.data.name;
    const subTree = nameToNodeMapping[nodeName];

    // Trim the subtree to MAX_DEPTH and set it as the new tree
    setTrimmedData(extractObjectWithMaxDepth(subTree));

    /**
     * Traverse from the clicked node to the last node in the current path
     * to determine all the nodes in between, and append those to the
     * current path.
     */
    const path = pathToAncestor(
      clickedNode,
      currentPath[currentPath.length - 1]
    );
    path.reverse(); // We want ancestor -> clicked node

    setCurrentPath([...currentPath, ...path]);
  };

  /**
   * When this component mounts, create the node name -> node pointer mapping
   * from the data, trim the data so we only render a limited number
   * of levels of the tree, and set current path to the root.
   */
  useEffect(() => {
    setNameToNodeMapping(createNameToNodeMapping(data));
    setTrimmedData(extractObjectWithMaxDepth(data));
    setCurrentPath([data.name]);
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
      <NodePathHistory path={currentPath} />
      <Tree jsonData={trimmedData} onNodeClick={nodeClickHandler}></Tree>
      {element}
    </div>
  );
};
