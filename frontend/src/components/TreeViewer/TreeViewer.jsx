import React, { useState, useEffect } from "react";
import styles from "./TreeViewer.module.css";
import { Tree } from "../Tree/Tree";
import { NodePathHistory } from "../NodePathHistory/NodePathHistory";
import { Toolbar } from "../Toolbar/Toolbar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import NavigateBeforeRounded from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRounded from "@material-ui/icons/NavigateNextRounded";
import HomeRounded from "@material-ui/icons/HomeRounded";
import { HistoryRecorder } from "../../utils/HistoryRecorder";
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
  const [historyRecorder, setHistoryRecorder] = useState();

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

    historyRecorder.resetPath([...currentPath, ...path]);
  };

  /**
   * This function handles the event where a user clicks a name in the
   * NodePathHistory component.
   */
  const nodeNameClickHandler = (nodeName) =>
    historyRecorder.goBackward(nodeName);

  /**
   * This function is triggered when the home button is clicked.
   */
  const homeClickHandler = () => historyRecorder.goBackward("");

  /**
   * This function is triggered when the back button is clicked.
   * It goes back one level in the tree.
   */
  const backClickHandler = () => historyRecorder.goBackward();

  /**
   * This function is triggered when the forward button is clicked.
   * It goes forward one level in the tree, if that exists.
   */
  const forwardClickHandler = () => historyRecorder.goForward();

  /**
   * This function is triggered when an edit is made
   * to the current path.
   */
  const pathChangeHandler = (newPath) => historyRecorder.resetPath(newPath);

  /**
   * This function is triggered whenever a change is made
   * to historyRecorder.
   */
  const historyChangeHandler = (path) => setCurrentPath(path);

  /**
   * Recursive function that traverses the
   * path given by 'path' and verifies that all the nodes
   * in the path do exist in the right place.
   */
  const isValidPath = (path, index = 0, json = { children: [data] }) => {
    if (index >= path.length) return true;

    /**
     * Check if node exists in the json's children array.
     * If it does, then recursively call this function with
     * the next element in 'path' and considering the child node
     * found as the new 'json'.
     */
    const itemIndex = json.children.findIndex(
      (obj) => obj.name === path[index]
    );
    if (itemIndex !== -1) {
      return isValidPath(path, index + 1, json.children[itemIndex]);
    }
    return false;
  };

  /**
   * When this component mounts, create the node name -> node pointer
   * mapping from the data and set current path to the root. Also,
   * instantiate the history recorder for tracking path history.
   */
  useEffect(() => {
    setNameToNodeMapping(createNameToNodeMapping(data));
    setCurrentPath([data.name]);
    setHistoryRecorder(new HistoryRecorder(historyChangeHandler));
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
        <ButtonGroup>
          <Button
            disabled={historyRecorder && !historyRecorder.canGoBackward()}
            onClick={backClickHandler}
          >
            <NavigateBeforeRounded
              classes={{
                root: styles.button,
              }}
            />
          </Button>
          <Button
            disabled={historyRecorder && !historyRecorder.canGoForward()}
            onClick={forwardClickHandler}
          >
            <NavigateNextRounded
              classes={{
                root: styles.button,
              }}
            />
          </Button>
        </ButtonGroup>
        <Button variant="outlined" onClick={homeClickHandler}>
          <HomeRounded
            classes={{
              root: styles.button,
            }}
          />
        </Button>
        <NodePathHistory
          path={currentPath}
          onNodeNameClick={nodeNameClickHandler}
          onPathChange={pathChangeHandler}
          isValidPath={isValidPath}
        />
      </Toolbar>
      <Tree jsonData={trimmedData} onNodeClick={nodeClickHandler}></Tree>
    </div>
  );
};
