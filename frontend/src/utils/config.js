// Config values for the entire application. Ensure to document each constant!
// See README.md for more details.

//TreeViewer.jsx config
export const VConf = Object.freeze({
  MAX_DEPTH: 2, //The maximum depth of nodes to be visible to the viewer in the tree
  FADE_OPACITY: 0.25, //The opacity of the faded nodes when the user hovers over a link in the infoViewer
  FULL_OPACITY: 1.0, //The opacity of the fully visible nodes
  NO_DEPTH_LIMIT: -1, //Constant to disable depth limit when searching for a node with particular link
});

//Tree.jsx config
export const TreeConf = Object.freeze({
  ANIMATE_TIME: 200, //How long the animation effect lasts
  RADIUS_SCALER: 1 / 2.5, //Multiplicative factor, how much to scale radius relative to min(container.width, container.height)

  LABEL_ROTATE_OFFSET: 0, //Offset of label in relation to node
  LABEL_HEIGHT_OFFSET: -15, //Height of the label in relation to the "dot"
  MIN_FONT_SIZE: 8, //Smallest font size. Note - font size may be scaled up when the browser window gets larger
  MAX_FONT_SIZE: 17, // Largest font size. Note - font size may be scaled down when the browser window gets smaller
  LABEL_NODE_SPACING: 7, //How far the node "dot" and its label are

  NODE_ROTATE_FACTOR: 180, //How much to rotate the nodes
  LEAF_COLOUR: "#b30000", //Colour of leaf nodes
  NODE_COLOUR: "#555", //Colour of non-leaf nodes
  VIEWING_NODE_COLOUR: "#377bfa", //Colour of a node whose article we are viewing
  NODE_SIZE: 7, //How large the node "dot" is
  VIEWING_NODE_SIZE: 10, //How large the node "dot" is when we are viewing the related article
  SIBLING_SPACING: 1.0, //Spacing of sibling nodes (this can be a decimal)
});
