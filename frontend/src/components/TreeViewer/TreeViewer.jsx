import React, { useState, useEffect, useRef } from "react";
import styles from "./TreeViewer.module.css";
import { Tree } from "../Tree/Tree";
import { InfoWindow } from "../../components/InfoWindow/InfoWindow";
import { replaceSpaceCharacters } from "../../utils/utils";
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
let VIEWED_NODE = null;

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
    numChildren: obj.numChildren,
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

/* Traverse from currNode to the ancestor node called ancestorNodeName
 *  and collect all the node names along the path.
 */
function pathToAncestor(currNode, ancestorNodeName, history = []) {
  if (currNode && currNode.data.name !== ancestorNodeName) {
    history.push(currNode.data.name);
    pathToAncestor(currNode.parent, ancestorNodeName, history);
  }

  return history;
}

/**
 * toggleInfoBoxVisibility determines whether to hide or show the text
 * box to the right of the screen.
 * @param clickedNodeName: The name of the node that was just clicked
 * TODO: Change the param to an ID when we integrate that feature
 */
function toggleInfoBoxVisibility(clickedNodeName, previouslyClickedNodeName) {
  const articleDiv = document.getElementsByClassName("article")[0];
  const treeDiv = document.getElementById("course-tree");
  let isViewing = null;

  if (
    articleDiv.classList.contains("span-1-of-2") &&
    previouslyClickedNodeName === clickedNodeName
  ) {
    // Already displaying and the user clicked on the same node again
    articleDiv.classList.remove("col");
    articleDiv.classList.remove("span-1-of-2");
    treeDiv.classList.remove("col");
    treeDiv.classList.remove("span-1-of-2");
  } else {
    //Not yet displaying
    articleDiv.classList.add("col");
    articleDiv.classList.add("span-1-of-2");
    treeDiv.classList.add("col");
    treeDiv.classList.add("span-1-of-2");
    isViewing = clickedNodeName;

    //Set the height of the textbox equal to the height of the
    //treeDiv
    const treeHeightpx = treeDiv.offsetHeight.toString().concat("px");
    articleDiv.style.height = treeHeightpx;
  }
  return isViewing;
}

export const TreeViewer = ({ data, treeID }) => {
  const [trimmedData, setTrimmedData] = useState({});
  const [nameToNodeMapping, setNameToNodeMapping] = useState({});
  const [nodeInfoContent, setNodeInfoContent] = useState("");
  const previouslyClickedNode = useRef("");
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
    if (clickedNode.data.numChildren > 0) {
      const path = pathToAncestor(
        clickedNode,
        currentPath[currentPath.length - 1]
      );
      path.reverse(); // We want ancestor -> clicked node
      historyRecorder.resetPath([...currentPath, ...path]);
    }
  };

  /**
   * The function to handle right clicks - opens up a window to show
   * summarized information for a given wiki link.
   */
  const rightClickHandler = (event, clickedNode) => {
    event.preventDefault();
    VIEWED_NODE = toggleInfoBoxVisibility(
      clickedNode.data.name,
      previouslyClickedNode.current
    );
    previouslyClickedNode.current = clickedNode.data.name;
    const nodeInfoUrl = replaceSpaceCharacters(
      `http://localhost:3003/get-node-info/${clickedNode.data.name}-${treeID}`
    );
    fetch(nodeInfoUrl)
      .then((res) => {
        if (res.status !== 200) {
          throw Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        setNodeInfoContent(res);
      })
      .catch((err) => {
        const defaultInfo = {
          content: "No additional information available for the topic ".concat(
            clickedNode.data.name
          ),
        };
        setNodeInfoContent(defaultInfo);
      });
  };

  /* This function handles the event where a user clicks a name in the
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
   * in the path do exist in the right place. If the case is
   * incorrect for any words, then the path parameter is
   * updated.
   */
  const validatePath = (path, index = 0, json = { children: [data] }) => {
    if (index >= path.length) return [true, false];

    /**
     * Check if node exists in the json's children array.
     * If it does, then recursively call this function with
     * the next element in 'path' and considering the child node
     * found as the new 'json'.
     */
    const itemIndex = json.children.findIndex(
      (obj) =>
        (obj.name && obj.name.toLowerCase()) ===
        (path[index] && path[index].toLowerCase())
    );
    if (itemIndex !== -1) {
      let currentChanged = false;
      if (json.children[itemIndex].name !== path[index]) {
        path[index] = json.children[itemIndex].name;
        currentChanged = true;
      }

      const [isValid, childPathChanged] = validatePath(
        path,
        index + 1,
        json.children[itemIndex]
      );

      return [isValid, childPathChanged || currentChanged];
    }
    return [false, false];
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
          validatePath={validatePath}
        />
      </Toolbar>
      <div className="row treeViewerContainer">
        <div className="tree" id="course-tree">
          <Tree
            jsonData={trimmedData}
            onNodeClick={nodeClickHandler}
            onRightClick={rightClickHandler}
            viewedNode={VIEWED_NODE}
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
