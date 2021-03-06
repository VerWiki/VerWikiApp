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
const FADE_OPACITY = 0.25;
const FULL_OPACITY = 1;
const NO_DEPTH_LIMIT = -1;

/**
 * Recursive function to find the node, and its parent with a given link.
 * @param subTree: The root of the subtree in which to search.
 * @param link: The link for which we want to find the corresponding node & parent
 * @param depth : The depth for which to search for; pass NO_DEPTH_LIMIT for no limit.
 * @param parent: The parent node of the subTree; null if the subTree is the entire tree
 * @return : A struct with form {node: Node, parent: Node}. null values if node not found
 */

const findNodeWithLink = (subTree, link, depth, parent = null) => {
  if (subTree == null || link === "") {
    return {
      node: null,
      parent: null,
    };
  }
  if (subTree.url === link) {
    return {
      node: subTree,
      parent: parent,
    };
  } else if (depth === 0) {
    return {
      node: null,
      parent: null,
    };
  }

  for (let i = 0; i < subTree.numChildren; i++) {
    let result = findNodeWithLink(
      subTree.children[i],
      link,
      depth - 1,
      subTree
    );
    if (result.node !== null) {
      return result;
    }
  }
  return {
    node: null,
    parent: null,
  };
};

/**
 * Function to find the tree to be displayed on next render.
 * @param {list} currentPath : List of nodes from the tree's root to the displayed root
 * @param {Object} nameToNodeMapping : Dictionary mapping node IDs to nodes
 * @param {string} hoveredNodeLink : String representing the link currently being hovered over,
 * or "" if the user is not currently hovering over any link in the InfoViewer
 * @param {Object} entireData : Struct with all nodes in the tree
 * @returns : Object representing the tree to be displayed on next render
 */

const findVisibleSubtree = (
  currentPath,
  nameToNodeMapping,
  hoveredNodeLink,
  entireData
) => {
  // Get the visible root from the last element of the path
  const curRootName = currentPath[currentPath.length - 1];
  const treeToDisplay = extractObjectWithMaxDepth(
    nameToNodeMapping[curRootName] || {}
  );
  // If the user is not hovering over anything, then no changes to be made
  if (hoveredNodeLink === "") {
    return treeToDisplay;
  }
  // Check if the link that the user is hovering over corresponds to an
  // already visible node
  const hoveredNodeObject = findNodeWithLink(
    treeToDisplay,
    hoveredNodeLink,
    MAX_DEPTH
  );

  if (hoveredNodeObject.node !== null) {
    return treeToDisplay;
  }
  // If none of the visible nodes corresponds to the link, check the entire tree
  const searchResult = findNodeWithLink(
    entireData,
    hoveredNodeLink,
    NO_DEPTH_LIMIT
  );

  if (searchResult.node === null) {
    //Just show the old tree if the link does not have a corresponding node
    console.log(`The link ${hoveredNodeLink} was not found in the tree`);
    return treeToDisplay;
  } else if (searchResult.parent === null) {
    // If the link corresponded to the tree root, display a tree starting there
    return extractObjectWithMaxDepth(searchResult.node);
  }
  // Else display a tree starting at the parent of the hovered node
  return extractObjectWithMaxDepth(searchResult.parent);
};

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
    url: obj.url,
    children: obj.children
      ? obj.children
          .map((node) => extractObjectWithMaxDepth(node, depth - 1))
          .filter((node) => node !== null)
      : [],
  };
}

/**
 * Updates the opacity rating on each of the nodes based on where the node corresponding to
 * the link is found.
 * If no link is being hovered over, all nodes are fully visible
 * If a link is being hovered over, then the corresponding node (if it exists) and all
 * descendents are highlighted, everything else is greyed out
 * @param {Object} data The data to traverse to add the opacity
 * @param {string} link The link we are equating to, refers to the link being hovered on
 * @param {float} currentOpacity Current opacity rating
 */
const setOpacity = (data, link, currentOpacity) => {
  if (currentOpacity !== FADE_OPACITY && currentOpacity !== FULL_OPACITY) {
    console.log("WARNING: invalid passed in opacity...");
  }
  let childOpacity;
  if (link === "" || data.url === link || currentOpacity === FULL_OPACITY) {
    childOpacity = FULL_OPACITY;
  } else {
    /*currentOpacity === FADE_OPACITY*/
    childOpacity = FADE_OPACITY;
  }
  data.opacity = childOpacity;
  if (data.children) {
    data.children.forEach((child) => {
      child = setOpacity(child, link, childOpacity);
    });
  }
  return data;
};

/**
 * Creates an index so that we can get the reference to
 * a particular node given its name - in constant time.
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
function toggleInfoBoxVisibility(clickedNodeName, curViewingNodeName) {
  const articleDiv = document.getElementsByClassName("article")[0];
  const treeDiv = document.getElementById("course-tree");
  let nodeViewingAfterToggle;

  if (curViewingNodeName === clickedNodeName) {
    // Already displaying and the user clicked on the same node again
    articleDiv.classList.remove("col");
    articleDiv.classList.remove("span-1-of-2");
    treeDiv.classList.remove("col");
    treeDiv.classList.remove("span-1-of-2");
    nodeViewingAfterToggle = null;
  } else {
    //Not yet displaying
    articleDiv.classList.add("col");
    articleDiv.classList.add("span-1-of-2");
    treeDiv.classList.add("col");
    treeDiv.classList.add("span-1-of-2");
    nodeViewingAfterToggle = clickedNodeName;

    //Set the height of the textbox equal to the height of the
    //treeDiv
    const treeHeightpx = treeDiv.offsetHeight.toString().concat("px");
    articleDiv.style.height = treeHeightpx;
  }
  return nodeViewingAfterToggle;
}

export const TreeViewer = ({ data, treeID }) => {
  const [trimmedData, setTrimmedData] = useState({});
  const [nameToNodeMapping, setNameToNodeMapping] = useState({});
  const [nodeInfoContent, setNodeInfoContent] = useState("");
  const [currentPath, setCurrentPath] = useState([]);
  const [historyRecorder, setHistoryRecorder] = useState();
  const [hoveredNodeLink, setHoveredNodeLink] = useState("");
  const curViewingNode = useRef(null);

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
   * Sets the currently hovered link which eventually triggers a
   * re-render of the tree.
   */
  const linkHoverHandler = (hoveredElement) => {
    if (hoveredElement === null) {
      setHoveredNodeLink("");
      return;
    }
    setHoveredNodeLink(hoveredElement.getAttribute("href"));
  };

  /**
   * Function to handle right clicks - opens up a window to show
   * summarized information for a given wiki link.
   */
  const rightClickHandler = (event, clickedNode) => {
    event.preventDefault();
    curViewingNode.current = toggleInfoBoxVisibility(
      clickedNode.data.name,
      curViewingNode.current
    );
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
    const subTree = findVisibleSubtree(
      currentPath,
      nameToNodeMapping,
      hoveredNodeLink,
      data
    );

    // Trim the subtree to MAX_DEPTH and set it as the new tree
    setTrimmedData(setOpacity(subTree, hoveredNodeLink, FADE_OPACITY));
  }, [currentPath, nameToNodeMapping, hoveredNodeLink, data]);

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
            isHovering={hoveredNodeLink !== ""}
            curViewingNodeID={curViewingNode.current}
          ></Tree>
        </div>
        <div className="article">
          <p>
            <InfoWindow
              info={nodeInfoContent.content}
              linkHoverHandler={linkHoverHandler}
            ></InfoWindow>
          </p>
        </div>
      </div>
    </div>
  );
};
