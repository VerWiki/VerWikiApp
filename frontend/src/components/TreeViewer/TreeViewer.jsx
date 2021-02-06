import React, { useState, useEffect } from "react";
import styles from "./TreeViewer.module.css";
import { Tree } from "../Tree/Tree";
import { NodePathHistory } from "../NodePathHistory/NodePathHistory";
import { Toolbar } from "../Toolbar/Toolbar";
import { Button, ButtonGroup } from "@material-ui/core";
import {
  NavigateBeforeRounded,
  NavigateNextRounded,
  HomeRounded,
} from "@material-ui/icons";
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
  const [forwardHistory, setForwardHistory] = useState([]);

  /**
   * This function handles the event where a user clicks a node on the tree
   * and displays the subtree from that point onwards up to MAX_DEPTH.
   */
  const nodeClickHandler = (event, clickedNode) => {
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
    setForwardHistory([]); // Reset forward history
  };

  /**
   * This function handles the event where a user clicks a name in the
   * NodePathHistory component.
   */
  const nodeNameClickHandler = (event, nodeName) => {
    // Keep popping from currentPath until we find nodeName
    const currentPathCopy = [...currentPath];
    const forwardHistoryCopy = [...forwardHistory];
    while (currentPathCopy[currentPathCopy.length - 1] !== nodeName) {
      forwardHistoryCopy.push(currentPathCopy.pop());
    }

    setCurrentPath(currentPathCopy);
    setForwardHistory(forwardHistoryCopy);
  };

  /**
   * This function is triggered when the home button is clicked.
   */
  const homeClickHandler = () => {
    if (currentPath.length < 2) return;

    // Keep popping from currentPath up to the beginning
    const currentPathCopy = [...currentPath];
    const forwardHistoryCopy = [...forwardHistory];
    while (currentPathCopy.length > 1) {
      forwardHistoryCopy.push(currentPathCopy.pop());
    }

    setCurrentPath(currentPathCopy);
    setForwardHistory(forwardHistoryCopy);
  };

  /**
   * This function is triggered when the back button is clicked.
   * It goes back one level in the tree.
   */
  const backClickHandler = () => {
    /**
     * We need at least 2 nodes in the path to go back
     * If there is only 1, it would be the root, and
     * we can't go back any further.
     */
    if (currentPath.length < 2) return;

    // Pop the last node from the current path
    const currentPathCopy = [...currentPath];
    const poppedNodeName = currentPathCopy.pop();

    setCurrentPath(currentPathCopy);
    setForwardHistory([...forwardHistory, poppedNodeName]);
  };

  /**
   * This function is triggered when the forward button is clicked.
   * It goes forward one level in the tree, if that exists.
   */
  const forwardClickHandler = () => {
    if (!forwardHistory.length) return;

    // Pop the last node from forward history
    const forwardHistoryCopy = [...forwardHistory];
    const poppedNodeName = forwardHistoryCopy.pop();

    setForwardHistory(forwardHistoryCopy);
    setCurrentPath([...currentPath, poppedNodeName]);
  };

  /**
   * When this component mounts, create the node name -> node pointer mapping
   * from the data and set current path to the root.
   */
  useEffect(() => {
    setNameToNodeMapping(createNameToNodeMapping(data));
    setCurrentPath([data.name]);
  }, [data]);

  /**
   * This is called every time the current path changes, which can happen
   * if the user interacts with the BreadCrumb, or clicks the back/forward
   * buttons and updates the tree.
   */
  useEffect(() => {
    // The last name in the currentPath should be the new root node
    const nodeName = currentPath[currentPath.length - 1];
    const subTree = nameToNodeMapping[nodeName] || {};

    // Trim the subtree to MAX_DEPTH and set it as the new tree
    setTrimmedData(extractObjectWithMaxDepth(subTree));
  }, [currentPath, nameToNodeMapping]);

  return (
    <div className={styles.nav}>
      <Toolbar>
        <Button variant="outlined" onClick={homeClickHandler}>
          <HomeRounded
            classes={{
              root: styles.button,
            }}
          />
        </Button>
        <ButtonGroup>
          <Button disabled={currentPath.length < 2} onClick={backClickHandler}>
            <NavigateBeforeRounded
              classes={{
                root: styles.button,
              }}
            />
          </Button>
          <Button
            disabled={!forwardHistory.length}
            onClick={forwardClickHandler}
          >
            <NavigateNextRounded
              classes={{
                root: styles.button,
              }}
            />
          </Button>
        </ButtonGroup>
        <NodePathHistory
          path={currentPath}
          onNodeNameClick={nodeNameClickHandler}
        />
      </Toolbar>
      <Tree jsonData={trimmedData} onNodeClick={nodeClickHandler}></Tree>
    </div>
  );
};
