import React, { useState, useEffect, useRef, createRef } from "react";
import styles from "./TreeViewer.module.css";
import { Tree } from "../Tree/Tree";
import { InfoWindow } from "../../components/InfoWindow/InfoWindow";
import {
  replaceSpaceCharacters,
  getParameterByName,
  calculateMaxDepth,
} from "../../utils/utils";
import { NodePathHistory } from "../NodePathHistory/NodePathHistory";
import { Toolbar } from "../Toolbar/Toolbar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import NavigateBeforeRounded from "@material-ui/icons/NavigateBeforeRounded";
import NavigateNextRounded from "@material-ui/icons/NavigateNextRounded";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import HomeRounded from "@material-ui/icons/HomeRounded";
import { HistoryRecorder } from "../../utils/HistoryRecorder";
import "fontsource-roboto";
import { VConf } from "../../utils/config";
import { Logger } from "../../utils/Logger";
import { Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { ZoomManager } from "../../utils/ZoomManager";

/**
 * Recursive function to find the node, and its parent with a given link.
 * @param subTree: The root of the subtree in which to search.
 * @param link: The link for which we want to find the corresponding node & parent
 * @param depth : The depth for which to search for; pass NO_DEPTH_LIMIT for no limit.
 * @param parent: The parent node of the subTree; null if the subTree is the entire tree
 * @return : A struct with form {node: Node, parent: Node}. null values if node not found
 */

const findNodeWithLink = (subTree, link, depth, parent = null) => {
  if (subTree == null || link === "" || link === undefined) {
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
  entireData,
  curDepth
) => {
  // Get the visible root from the last element of the path
  const curRootName = getCurrentRootName(currentPath);
  const treeToDisplay = extractObjectWithMaxDepth(
    nameToNodeMapping[curRootName] || {},
    curDepth
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
    curDepth
  );

  if (hoveredNodeObject.node !== null) {
    return treeToDisplay;
  }
  // If none of the visible nodes corresponds to the link, check the entire tree
  const searchResult = findNodeWithLink(
    entireData,
    hoveredNodeLink,
    VConf.NO_DEPTH_LIMIT
  );

  if (searchResult.node === null) {
    //Just show the old tree if the link does not have a corresponding node
    Logger.debug(
      `findVisibleSubtree: The link ${hoveredNodeLink} was not found in the tree`
    );
    return treeToDisplay;
  } else if (searchResult.parent === null) {
    // If the link corresponded to the tree root, display a tree starting there
    return extractObjectWithMaxDepth(searchResult.node, curDepth);
  }
  // Else display a tree starting at the parent of the hovered node
  return extractObjectWithMaxDepth(searchResult.parent, curDepth);
};

/**
 * Given the original tree data which has an unbounded number
 * of levels, this function trims the total depth of the tree
 * to the given depth.
 */
function extractObjectWithMaxDepth(obj, depth) {
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
  if (
    currentOpacity !== VConf.FADE_OPACITY &&
    currentOpacity !== VConf.FULL_OPACITY
  ) {
    Logger.warn("setOpacity: invalid passed in opacity...");
  }
  let childOpacity;
  if (
    link === "" ||
    data.url === link ||
    currentOpacity === VConf.FULL_OPACITY
  ) {
    childOpacity = VConf.FULL_OPACITY;
  } else {
    /*currentOpacity === FADE_OPACITY*/
    childOpacity = VConf.FADE_OPACITY;
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
function createNameToNodeMapping(currNode, mapping = {}, parent = "") {
  currNode.parent = parent;
  mapping[currNode.name] = currNode;
  if (currNode.children) {
    currNode.children.forEach((child) =>
      createNameToNodeMapping(child, mapping, currNode.name)
    );
  }
  return mapping;
}

/**
 * Traverse from node to the ancestor node called ancestorNodeName
 * and collect all the node names along the path.
 * @param {Node} node : The node to start from
 * @param {dict} nameToNodeMapping : A mapping of node names to nodes
 * @param {*} ancestorNodeName : The node to stop the path at; if not given,
 * finds the complete path to the root
 * @returns {List{string}} representing list of names from currNode to ancestorNode
 */

function pathToAncestor(node, nameToNodeMapping, ancestorNodeName) {
  if (node == null || !node.name || node.name === "") {
    Logger.warn("pathToAncestor: null node provided, or node without name");
    return [];
  }
  const currentPath = [node.name];
  while (
    node.name !== ancestorNodeName &&
    getParent(node.name, nameToNodeMapping)
  ) {
    node = getParent(node.name, nameToNodeMapping);
    currentPath.push(node.name);
  }
  return currentPath;
}

/**
 * Provides the parent object, given the name of the current node else null
 * if no parent found
 * @param {string} nodeName : Name of the node whose parent to find
 * @param {dict} nameToNodeMapping : Map of node names to node objects
 * @return {Node} representing the parent of nodeName
 */
function getParent(nodeName, nameToNodeMapping) {
  const node = nameToNodeMapping[nodeName];
  if (node == null) {
    Logger.error("getParent: node not found in mapping: getParent function");
    return null;
  }
  const nodeParentName = node.parent;
  if (nodeParentName == null) {
    return null;
  }
  return nameToNodeMapping[nodeParentName];
}

/**
 * closeInfoViewer closes the infoviewer component, and updates the appropriate
 * TreeViewer variables to signal that the infoviewer component has closed
 * @param {Ref} curViewingNodeID : A ref whose "current" property
 * represents the currently viewing node
 * @param {func(string)} setViewingUrl : A pointer to the function to set the
 * currently viewing URL
 */
function closeInfoViewer(curViewingNodeID, setViewingUrl) {
  const articleDiv = document.getElementsByClassName("article")[0];
  const treeDiv = document.getElementById("course-tree");
  articleDiv.style["animation-name"] = "fadeOut";
  articleDiv.classList.remove("col");
  articleDiv.classList.remove("span-1-of-2");
  treeDiv.classList.remove("col");
  treeDiv.classList.remove("span-1-of-2");
  setViewingUrl("");
  curViewingNodeID.current = "";
}

/**
 * openInfoViewer closes the infoviewer component, and updates the appropriate
 * TreeViewer variables to signal that the infoviewer component has opened
 * @param {string} clickedNode : The name of the node which was clicked
 * @param {string} url : The URL of the node whose infoViewer article we want to view
 * @param {Ref} curViewingNodeID : A ref whose "current" property
 * represents the currently viewing node
 * @param {func(string)} setViewingUrl : A pointer to the function to set the
 * currently viewing URL
 */
function openInfoViewer(clickedNode, url, curViewingNodeID, setViewingUrl) {
  const articleDiv = document.getElementsByClassName("article")[0];
  const treeDiv = document.getElementById("course-tree");

  articleDiv.style["animation-name"] = "fadeIn";
  articleDiv.classList.add("col");
  articleDiv.classList.add("span-1-of-2");
  treeDiv.classList.add("col");
  treeDiv.classList.add("span-1-of-2");

  //Set the height of the textbox equal to the height of the
  //treeDiv
  const treeHeightpx = treeDiv.offsetHeight.toString().concat("px");
  articleDiv.style.height = treeHeightpx;
  setViewingUrl(url);
  curViewingNodeID.current = clickedNode;
}

/**
 * toggleInfoViewerVisibility determines whether to hide or show the text
 * box to the right of the screen.
 * @param {string} clickedNodeName: The name of the node that was just clicked
 * TODO: Change the param to an ID when we integrate that feature
 * @param {string} curViewingNodeID: The ID of the node whose article is currently
 * being viewed in the infoViewer; "" if nothing currently viewed
 * @param {string} url: The URL that we are currently viewing
 * @param {func(string)} setViewingUrl: A function pointer to update the currently viewing URL
 */
function toggleInfoViewerVisibility(
  clickedNodeName,
  currentViewingNodeID,
  url,
  setViewingUrl
) {
  if (currentViewingNodeID.current === clickedNodeName) {
    closeInfoViewer(currentViewingNodeID, setViewingUrl);
  } else {
    openInfoViewer(clickedNodeName, url, currentViewingNodeID, setViewingUrl);
  }
}

/**
 * Provides the name of the root in the VISIBLE subtree
 * @param {List[string]} currentPath : The list of nodes in the current path
 * @returns {string} representing the name of the current root in the VISIBLE subtree
 */
function getCurrentRootName(currentPath) {
  if (currentPath == null || currentPath.length === 0) {
    Logger.warn("getCurrentRootName: invalid current path passed in");
    return null;
  }
  return currentPath[currentPath.length - 1];
}

/**
 * Provides the name of the root of the ENTIRE tree
 * @param {List[string]} currentPath The list of nodes in the current path
 * @returns string representing the name of the current root in the ENTIRE tree
 */
function getAbsoluteRootName(currentPath) {
  if (currentPath == null || currentPath.length === 0) {
    Logger.error("getAbsoluteRootName: invalid current path passed in");
    return null;
  }
  return currentPath[0];
}

export const TreeViewer = ({ data, heading }) => {
  const [trimmedData, setTrimmedData] = useState({});
  const [nameToNodeMapping, setNameToNodeMapping] = useState({});
  const [nodeInfoContent, setNodeInfoContent] = useState("");
  const [nodeInfoName, setNodeInfoName] = useState("");
  const [currentPath, setCurrentPath] = useState([]);
  const [historyRecorder, setHistoryRecorder] = useState();
  const [zoomManager, setZoomManager] = useState();
  const [hoveredNodeLink, setHoveredNodeLink] = useState("");
  const [infoViewingLink, setInfoViewingLink] = useState("");
  const curViewingNodeID = useRef("");
  const contentRef = createRef();
  const [curZoomLevel, setCurZoomLevel] = useState(VConf.INTIAL_ZOOM);

  /**
   * Given a node, this function resets the path to indicate that the node will
   * now be the new root of the visible tree.
   * The path resetting eventually triggers a rerender, with newRoot being the new
   * visible root.
   * @param {Node} newRoot The node which is to be the new visible root
   * @param {bool} addHistory Whether to add to history or not; default true
   * @param {bool} force whether to force rerender regardless of if we are at the newRoot
   * already or not
   * @return {bool} returns whether the newVisibleRoot was set or not
   */
  const setNewVisibleRoot = (newRoot, addHistory = true, force = false) => {
    if (newRoot.name == null || newRoot.name === undefined) {
      Logger.warn("setNewVisibleRoot: Node has no name");
      return false;
    }
    if (newRoot.name === getCurrentRootName(currentPath) && !force) {
      //We are already at the new root
      return false;
    }
    const path = pathToAncestor(newRoot, nameToNodeMapping);
    path.reverse(); // We want ancestor -> clicked node
    if (addHistory) {
      historyRecorder.addBackwardHistory(
        getCurrentRootName(currentPath),
        curViewingNodeID.current,
        zoomManager.getCurZoom()
      );
    }

    //Set new max zoom based on the max depth of this new subtree
    const maxDepth = calculateMaxDepth(newRoot);
    zoomManager.updateMaxZoom(maxDepth);
    setCurrentPath(path);
    return true;
  };

  /**
   * This function handles the event where a user clicks a node on the tree
   * and displays the subtree from that point onwards up to ZoomManager's curZoom.
   */
  const nodeClickHandler = (event, clickedNode) => {
    /**
     * Traverse from the clicked node to the last node in the current path
     * to determine all the nodes in between, and append those to the
     * current path.
     */
    if (clickedNode.data.name === getCurrentRootName(currentPath)) {
      return;
    }
    if (clickedNode.data.numChildren > 0) {
      // Get the node from the name to node mapping which has consistent structure
      const clickedNodeFromMapping = nameToNodeMapping[clickedNode.data.name];
      if (clickedNodeFromMapping == null) {
        Logger.error("nodeClickHandler: clicked node not found in mapping");
        return;
      }
      setNewVisibleRoot(clickedNodeFromMapping);
    }
  };

  /**
   * manageInfoViewer allows the caller to apply an action to the infoViewer, to open, close
   * or toggle it.
   * @param {Node} clickedNode : The node which was clicked on, else {} if no node clicked
   * @param {int} managerOption : The action to take. Must be one of the following options:
   * VConf.TOGGLE_INFO_VIEWER, VConf.OPEN_INFO_VIEWER, VConf.CLOSE_INFO_VIEWER
   * @param {bool} addHistory : whether to add to the history, default true
   * @returns null
   */
  const manageInfoViewer = (clickedNode, managerOption, addHistory = true) => {
    if (addHistory) {
      historyRecorder.addBackwardHistory(
        getCurrentRootName(currentPath),
        curViewingNodeID.current,
        zoomManager.getCurZoom()
      );
    }

    if (clickedNode === {} && managerOption !== VConf.CLOSE_INFO_VIEWER) {
      Logger.error(
        "manageInfoViewer: empty node passed in when trying to open or toggle the infoViewer!"
      );
      return;
    }

    let clickedNodeFromMapping = clickedNode;
    if (clickedNode.data) {
      //There are two representations of nodes, one from the page itself and
      //one from our nameToNodeMapping. If the passed in value is of the former type, convert it
      // to the latter.
      clickedNodeFromMapping = nameToNodeMapping[clickedNode.data.name];
      if (clickedNodeFromMapping === undefined) {
        Logger.error("manageInfoViewer: clicked node not found in mapping");
        return;
      }
    }

    const url = clickedNodeFromMapping.url;

    if (managerOption === VConf.TOGGLE_INFO_VIEWER) {
      toggleInfoViewerVisibility(
        clickedNodeFromMapping.name,
        curViewingNodeID,
        url,
        setInfoViewingLink
      );
    } else if (managerOption === VConf.OPEN_INFO_VIEWER) {
      openInfoViewer(
        clickedNodeFromMapping.name,
        url,
        curViewingNodeID,
        setInfoViewingLink
      );
    } else if (managerOption === VConf.CLOSE_INFO_VIEWER) {
      closeInfoViewer(curViewingNodeID, setInfoViewingLink);
    } else {
      Logger.error("manageInfoViewer: Invalid managerOption specified");
      return;
    }

    const nodeID = getParameterByName("id", clickedNodeFromMapping.url);
    const nodeInfoUrl = replaceSpaceCharacters(`/get-node-info/${nodeID}`);
    fetch(nodeInfoUrl)
      .then((res) => {
        if (res.status !== 200) {
          throw Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        setNodeInfoContent(res);
        setNodeInfoName(clickedNodeFromMapping.name);
      })
      .catch((err) => {
        const defaultInfo = {
          content: "No additional information available for the topic ".concat(
            clickedNodeFromMapping.name
          ),
        };
        setNodeInfoContent(defaultInfo);
      });
  };

  /**
   * Function to handle right clicks - open/close a window to show
   * summarized information for the clicked node's wiki link.
   * @param {Event} event: The event object
   * @param {Node} clickedNode: The node that was clicked on
   */
  const rightClickHandler = (event, clickedNode) => {
    event.preventDefault();
    manageInfoViewer(clickedNode, VConf.TOGGLE_INFO_VIEWER);
  };

  /* This function handles the event where a user clicks a name in the
   * NodePathHistory component.
   */
  const nodeNameClickHandler = (nodeName) => {
    const clickedNode = nameToNodeMapping[nodeName];
    if (clickedNode == null) {
      Logger.error("nodeNameClickHandler: node name not in mapping");
      return;
    }
    setNewVisibleRoot(clickedNode);
  };

  /**
   * This function is triggered when the home button is clicked.
   */
  const homeClickHandler = () => {
    if (getCurrentRootName(currentPath) === getAbsoluteRootName(currentPath)) {
      return; //No action taken if we are already at the root/home
    }
    const absoluteRoot = nameToNodeMapping[getAbsoluteRootName(currentPath)];
    if (absoluteRoot == null) {
      Logger.error("homeClickHandler: cannot find absolute root");
      return;
    }
    setNewVisibleRoot(absoluteRoot);
  };

  const zoomOutHandler = () => {
    if (zoomManager.canZoomOut()) {
      const currentRoot = nameToNodeMapping[getCurrentRootName(currentPath)];
      setNewVisibleRoot(currentRoot, true, true);
      setCurZoomLevel(zoomManager.zoomOut());
    }
  };

  const zoomInHandler = () => {
    if (zoomManager.canZoomIn()) {
      const currentRoot = nameToNodeMapping[getCurrentRootName(currentPath)];
      setNewVisibleRoot(currentRoot, true, true);
      setCurZoomLevel(zoomManager.zoomIn());
    }
  };

  /**
   * This function is triggered when the back button is clicked.
   * It goes back one level in the tree.
   */
  const backClickHandler = () => {
    const historyStruct = historyRecorder.goBackward(
      getCurrentRootName(currentPath),
      curViewingNodeID.current,
      zoomManager.getCurZoom()
    );
    zoomManager.setCurZoom(historyStruct.currentZoom);
    setCurZoomLevel(historyStruct.currentZoom);
    const previouslyVisitedNodeName = historyStruct.currentRootName;
    if (previouslyVisitedNodeName === "") {
      Logger.warn("backClickHandler: no previously visted node");
      return;
    }
    const previouslyVisitedNode = nameToNodeMapping[previouslyVisitedNodeName];
    if (previouslyVisitedNode === null) {
      Logger.warn(
        "backClickHandler: error finding the previously visited node given name"
      );
      return;
    }
    // Open/close the infoviewer depending on if in this state we were viewing a node
    if (historyStruct.currentlyViewingNodeName !== "") {
      const viewingNode =
        nameToNodeMapping[historyStruct.currentlyViewingNodeName];
      if (!viewingNode) {
        Logger.error("backClickHandler: error retrieving node from name");
      } else {
        manageInfoViewer(viewingNode, VConf.OPEN_INFO_VIEWER, false);
      }
    } else {
      manageInfoViewer({}, VConf.CLOSE_INFO_VIEWER, false);
    }
    setNewVisibleRoot(previouslyVisitedNode, false);
  };

  /**
   * This function is triggered when the forward button is clicked.
   * It goes forward one level in the tree, if that exists.
   */
  const forwardClickHandler = () => {
    const historyStruct = historyRecorder.goForward(
      getCurrentRootName(currentPath),
      curViewingNodeID.current,
      zoomManager.getCurZoom()
    );
    zoomManager.setCurZoom(historyStruct.currentZoom);
    setCurZoomLevel(historyStruct.currentZoom);
    const forwardNodeName = historyStruct.currentRootName;
    if (forwardNodeName === "") {
      Logger.warn("forwardClickHandler: no forward node");
      return;
    }
    const forwardNode = nameToNodeMapping[forwardNodeName];
    if (forwardNode === null) {
      Logger.warn(
        "forwardClickHandler: error finding the forward node given name"
      );
      return;
    }
    //Open/close the infoviewer depending on if we were viewing any node's article in this current state
    if (historyStruct.currentlyViewingNodeName !== "") {
      const currentlyViewingNode =
        nameToNodeMapping[historyStruct.currentlyViewingNodeName];
      if (!currentlyViewingNode) {
        Logger.error(
          "forwardClickHandler: error getting currently viewing node from name"
        );
      } else {
        manageInfoViewer(currentlyViewingNode, VConf.OPEN_INFO_VIEWER, false);
      }
    } else {
      manageInfoViewer({}, VConf.CLOSE_INFO_VIEWER, false);
    }
    setNewVisibleRoot(forwardNode, false);
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
    const link = hoveredElement.getAttribute("href");
    const hashIndex = link.indexOf("#");
    if (hashIndex > -1) {
      setHoveredNodeLink(link.substring(0, hashIndex));
    } else {
      setHoveredNodeLink(link);
    }
  };

  /**
   * For the infoViewer, when a link is clicked this function is
   * called with the link as the href in e.target
   * If the link refers to an element in the tree, that element's parent
   * becomes the new visibleRoot (unless the element is the root). Else
   * open the link in a new tab
   * @param {Event} e : the event related to the link click
   */
  const linkClickHandler = (e) => {
    e.preventDefault();
    let clickedLink = e.target.getAttribute("href");
    const hashIndex = clickedLink.indexOf("#");
    if (hashIndex > -1) {
      clickedLink = clickedLink.substring(0, hashIndex);
    }
    const searchResult = findNodeWithLink(data, clickedLink);

    if (searchResult.parent == null && searchResult.node == null) {
      //external link
      window.open(clickedLink, "_blank");
      return;
    } else if (searchResult.parent == null) {
      // The link refers to the root node which has no parent
      if (!setNewVisibleRoot(searchResult.node)) {
        Logger.debug(
          "linkClickHandler: New root not set as we are already at new root, or error occurred"
        );
      }
    } else {
      if (!setNewVisibleRoot(searchResult.parent)) {
        Logger.debug(
          "linkClickHandler: New root not set as we are already at new root, or error occurred"
        );
      }
    }
    manageInfoViewer(searchResult.node, VConf.OPEN_INFO_VIEWER);
  };

  /**
   * This function is triggered when an edit is made
   * to the current path.
   */
  const pathChangeHandler = (newPath) => {
    if (newPath == null || newPath.length === 0) {
      Logger.warn("pathChangeHandler: invalid path passed in");
      return;
    }
    let newRootName = getCurrentRootName(newPath);
    const newRoot = nameToNodeMapping[newRootName];
    if (newRoot == null) {
      Logger.warn("pathChangeHandler: invalid path given");
      return;
    }
    setNewVisibleRoot(newRoot);
  };

  /**
   * Recursive function that traverses the
   * path given by 'path' and verifies that all the nodes
   * in the path do exist in the right place. If the case is
   * incorrect for any words, then the path parameter is
   * updated.
   * @param {list[string]} path List of elements that will make up the new
   * path
   * @param {int} index specifies the current element in the path to check,
   * this is a recursive parameter
   * @param {tree} json The structure representing the tree; default to data
   * @returns {list[bool, bool]} 2 element list indicating whether the path
   * is valid or if it was changed (for linting purposes)
   */

  const validatePath = (path, index = 0, json = { children: [data] }) => {
    if (index >= path.length) return [true, false];
    if (index === path.length - 1) {
      // Check that the user does not want to make a leaf be the new
      // center of the tree
      const newProposedRootName = path[index];
      const newProposedRoot = nameToNodeMapping[newProposedRootName];
      if (
        newProposedRoot != null &&
        (newProposedRoot.children == null ||
          newProposedRoot.children.length === 0)
      ) {
        return [false, false];
      }
    }

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
    setHistoryRecorder(new HistoryRecorder());
    setZoomManager(new ZoomManager(VConf.INTIAL_ZOOM, 4));
    const maxDepth = calculateMaxDepth(data);
    if (zoomManager) {
      zoomManager.updateMaxZoom(maxDepth);
    }
    //This effect should ONLY be activated on initial render, so we
    //have to tell eslint to ignore the zoomManager dependency
    // eslint-disable-next-line
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
      data,
      zoomManager ? zoomManager.getCurZoom() : VConf.INTIAL_ZOOM
    );
    // Trim the subtree to Zoomanager.curZoom and set it as the new tree
    setTrimmedData(setOpacity(subTree, hoveredNodeLink, VConf.FADE_OPACITY));
  }, [
    currentPath,
    nameToNodeMapping,
    hoveredNodeLink,
    data,
    zoomManager,
    curZoomLevel,
  ]);

  return (
    <div>
      <Toolbar
        left={[
          <Link className={styles.backButton} to={"/"}>
            <div className={styles.backButtonArrow}>
              <NavigateBeforeRounded />
            </div>
            Explore
          </Link>,
          <ButtonGroup>
            <Button
              disabled={zoomManager && !zoomManager.canZoomOut()}
              onClick={zoomOutHandler}
            >
              <ZoomOutIcon
                classes={{
                  root: styles.button,
                }}
              />
            </Button>
            <Button
              disabled={zoomManager && !zoomManager.canZoomIn()}
              onClick={zoomInHandler}
            >
              <ZoomInIcon
                classes={{
                  root: styles.button,
                }}
              />
            </Button>
          </ButtonGroup>,
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
          </ButtonGroup>,
          <Button variant="outlined" onClick={homeClickHandler}>
            <HomeRounded
              classes={{
                root: styles.button,
              }}
            />
          </Button>,
          <NodePathHistory
            path={currentPath}
            onNodeNameClick={nodeNameClickHandler}
            onPathChange={pathChangeHandler}
            validatePath={validatePath}
          />,
        ]}
        // Search bar for the next phase
        right={[
          <div
            className={styles.heading}
            style={{
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            {heading}
          </div>,
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            classes={{
              root: styles.search,
            }}
          />,
        ]}
      />
      <div className={styles.treeViewerContainer}>
        <div
          id="course-tree"
          style={{
            borderRadius: "50%",
          }}
        >
          <Tree
            jsonData={trimmedData}
            onNodeClick={nodeClickHandler}
            onRightClick={rightClickHandler}
            curViewingNodeID={curViewingNodeID.current}
          ></Tree>
        </div>
        <div
          className="article"
          ref={contentRef}
          style={{
            overflow: "scroll",
            boxSizing: "border-box",
            padding: "20px",
            backgroundColor: "#ededed",
            boxShadow: "2px 2px 2px 2px #ededed",
          }}
        >
          <p>
            <InfoWindow
              info={nodeInfoContent.content}
              linkHoverHandler={linkHoverHandler}
              linkClickHandler={linkClickHandler}
              curViewedLink={infoViewingLink}
              contentRef={contentRef}
              manageInfoViewer={manageInfoViewer}
              title={nodeInfoName}
            ></InfoWindow>
          </p>
        </div>
      </div>
    </div>
  );
};
