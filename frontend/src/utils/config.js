// Config values for the entire application. Ensure to document each constant!
// See README.md for more details.

//TreeViewer.jsx config
export const VConf = Object.freeze({
  MAX_DEPTH: 2, //The maximum depth of nodes to be visible to the viewer in the tree
  INTIAL_ZOOM: 2, //The maximum depth of nodes to be visible to the viewer in the tree
  FADE_OPACITY: 0.25, //The opacity of the faded nodes when the user hovers over a link in the infoViewer
  FULL_OPACITY: 1.0, //The opacity of the fully visible nodes
  NO_DEPTH_LIMIT: -1, //Constant to disable depth limit when searching for a node with particular link
  COMPLETE_PATH: "", //Constant passed in to PathToAncestor which signals it to find the entire path from current node to global root
  OPEN_INFO_VIEWER: 2, // Constant indicating the mode where a closed info-window is to be opened
  CLOSE_INFO_VIEWER: 1, // Constant indicating the mode where an open info-window has to be closed
  TOGGLE_INFO_VIEWER: 0, // Constant indicating the mode where an info-window is to be toggled
});

//Tree.jsx config
export const TreeConf = Object.freeze({
  SHORT_ANIMATE_TIME: "100", //Tree node mouseover and mouseout function handlers
  ANIMATE_TIME: 200, //How long the animation effect lasts
  RADIUS_SCALER: 1 / 2.5, //Multiplicative factor, how much to scale radius relative to min(container.width, container.height)

  LABEL_ROTATE_OFFSET: 0, //Offset of label in relation to node
  LABEL_HEIGHT_OFFSET: -15, //Height of the label in relation to the "dot"
  LABEL_TRUNCATION_LENGTH: 8, // Max length of the displayed name post truncation
  MIN_FONT_SIZE: 8, //Smallest font size. Note - font size may be scaled up when the browser window gets larger
  MAX_FONT_SIZE: 17, // Largest font size. Note - font size may be scaled down when the browser window gets smaller
  LABEL_NODE_SPACING: 7, //How far the node "dot" and its label are

  NODE_ROTATE_FACTOR: 180, //How much to rotate the nodes
  LEAF_COLOUR: "#d2d2e0", //Colour of leaf nodes
  NODE_COLOUR: "#555", //Colour of non-leaf nodes
  VIEWING_NODE_COLOUR: "#2d94ed", //Colour of a node whose article we are viewing
  NODE_SIZE: 7, //How large the node "dot" is
  VIEWING_NODE_SIZE: 10, //How large the node "dot" is when we are viewing the related article
  SIBLING_SPACING: 1.0, //Spacing of sibling nodes (this can be a decimal)
});

//Logger.js config
export const LoggerConf = Object.freeze({
  LOG_LEVEL: 4, //The current log level of the logger; displays all logs less than or equal to the level -> e.g. if 2, then display
  // LEVEL_WARNING and LEVEL_ERROR logs
  LEVEL_SILENT: 0, //The lowest log level; no logs shown; logs should not be assigned to this level
  LEVEL_ERROR: 1, //Error logs only - logs describing errors that directly interfere with the user's experience
  LEVEL_WARNING: 2, //warning-level logs; logs that indicate an issue but do not immediately cause issues for the user
  LEVEL_INFO: 3, //General information logs
  LEVEL_DEBUG: 4, //Logs for debugging purposes
});

// NodePathHistory.jsx config
export const NPHConf = Object.freeze({
  MODE_VIEW: 0, //Constant to denote the node path being in view mode, where the user can click on individual items
  MODE_EDIT: 1, //Constant to denote the node path being in edit mode, where the user can manually type a path
  MAX_ITEMS: 4, // Max items to show in the node path history at once
  ITEMS_AFTER_COLLAPSE: 4, // Number of items to show after the collapsed "..." part of the path
  ITEMS_BEFORE_COLLAPSE: 0, // Number of items to show before the collapsed "..." part of the path
});
