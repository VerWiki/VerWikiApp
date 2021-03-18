import React, { useState, useRef, useEffect } from "react";
import styles from "./Tree.module.css";
import { select, hierarchy, tree, linkRadial, ascending } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import "./Tree.module.css";
import { usePrevious, sigmoid, autoBox } from "../../utils/utils";
import { VConf } from "../../utils/config";

const ANIMATE_TIME = 200; //How long the animation effect lasts
const RADIUS_SCALER = 1 / 2.5; //Multiplicative factor; how much to scale radius relative to min(container.width, container.height)
const NODE_ROTATE_FACTOR = 180; //How much to rotate the nodes
const LABEL_ROTATE_OFFSET = 0; //Offset of label in relation to node
const LABEL_HEIGHT_OFFSET = -15; //Height of the label in relation to the "dot"
const LEAF_COLOUR = "#b30000"; //Colour of leaf nodes
const NODE_COLOUR = "#555"; //Colour of non-leaf nodes
const NODE_SIZE = 6; //How large the node "dot" is
const MIN_FONT_SIZE = 8; //Smallest font size. Note - font size may be scaled up when the browser window gets larger
const MAX_FONT_SIZE = 17; // Largest font size. Note - font size may be scaled down when the browser window gets smaller
const NODE_LABEL_SPACING = 7; //How far the node "dot" and its label are
const SIBLING_SPACING = 1.0; //Spacing of sibling nodes (this can be a decimal)

/**
 * This function takes node-text grouping, and inter-node link grouping and performs the animation
 * of the links between them.
 * @param nodeGroupEnterAndUpdate : A grouping of nodes and text boxes grouped together under the SVG tag
 * @param enteringAndUpdatingLinks : The inter-node links, represented as lines joining
 * nodes together on the tree.
 */

function animateTree(nodeGroupEnterAndUpdate, enteringAndUpdatingLinks) {
  nodeGroupEnterAndUpdate
    .attr("opacity", 0)
    .transition()
    .duration(ANIMATE_TIME)
    .delay((node) => node.depth * ANIMATE_TIME)
    .attr("opacity", VConf.FULL_OPACITY);

  enteringAndUpdatingLinks
    .attr("stroke-dashoffset", function () {
      return this.getTotalLength();
    })
    .transition()
    .duration(ANIMATE_TIME)
    .delay((link) => link.source.depth * ANIMATE_TIME)
    .attr("stroke-dashoffset", 0);
}

/**
 * A function to render the tree.
 * @param dimensions : A struct with fields width and height
 * specifying the desired size of the passed-in tree
 * @param jsonData : A JSON object representing the structure
 * of the tree
 * @param svgRef : A wrapper HTML element within which the tree
 * will be displayed
 * @param onNodeClick : Function pointer specifying the action
 * to take when a node in the tree is clicked
 * @param onRightClick: Function pointer specifying the action
 * to take when a node in the tree is right-clicked
 * @returns SVG groupings of nodes-and-text, and inter-node links
 */

function renderTree(dimensions, jsonData, svgRef, onNodeClick, onRightClick) {
  const svg = select(svgRef.current);
  const { width, height } = dimensions;

  const radius = Math.min(width, height) * RADIUS_SCALER;

  // Transform hierarchical data
  const root = hierarchy(jsonData).sort((a, b) =>
    ascending(a.data.name, b.data.name)
  );
  const treeLayout = tree()
    .size([2 * Math.PI, radius])
    .separation(
      (a, b) => (a.parent === b.parent ? SIBLING_SPACING : 1) / a.depth
    );

  // Creates the links between nodes
  const linkGenerator = linkRadial()
    .source((link) => link.source)
    .target((link) => link.target)
    .angle((d) => d.x)
    .radius((d) => d.y);

  // Enrich hierarchical data with coordinates
  treeLayout(root);

  // Create the node group, which will hold the nodes and labels
  const nodeGroup = svg.selectAll(".node-group").data(root.descendants());

  // Append a `g` element, to group SVG shapes together.
  // More info at https://stackoverflow.com/questions/17057809/d3-js-what-is-g-in-appendg-d3-js-code
  const nodeGroupEnter = nodeGroup.enter().append("g");
  const nodeGroupEnterAndUpdate = nodeGroupEnter.merge(nodeGroup);

  nodeGroupEnterAndUpdate
    .attr("class", "node-group")
    .style("cursor", "pointer")
    .on("click", onNodeClick)
    .on("contextmenu", onRightClick);

  nodeGroup.exit().remove();

  // Add nodes to the node group
  nodeGroupEnter
    .append("circle")
    .merge(nodeGroup.select("circle"))
    .attr(
      "transform",
      (d) => `
        rotate(${(d.x * NODE_ROTATE_FACTOR) / Math.PI - 90})
        translate(${d.y},0)
      `
    )
    .attr("fill", (d) => (d.data.numChildren === 0 ? LEAF_COLOUR : NODE_COLOUR))
    .attr("r", NODE_SIZE)
    .attr("opacity", (d) => {
      return d.data.opacity;
    });

  // Add labels to the node group
  nodeGroupEnter
    .append("text")
    .merge(nodeGroup.select("text"))
    .attr("text-anchor", "middle")
    .attr("font-size", Math.max(MIN_FONT_SIZE, sigmoid(width) * MAX_FONT_SIZE))
    .attr("y", LABEL_HEIGHT_OFFSET)
    .attr(
      "transform",
      (d) => `
        rotate(${(d.x * NODE_ROTATE_FACTOR) / Math.PI - 90}) 
        translate(${d.y}, ${LABEL_ROTATE_OFFSET}) 
        rotate(${d.x >= Math.PI ? NODE_ROTATE_FACTOR : 0})
      `
    )
    .attr("dy", "1.00em")
    .attr("dx", "0.0em")
    // Adds spacing between the node and the label; At even numbered depths, the label is on the
    // left side; at even numbered depths on the right side hence the if statament
    .attr("x", (d) =>
      d.x < Math.PI === !d.children
        ? NODE_LABEL_SPACING
        : -1 * NODE_LABEL_SPACING
    )
    .attr("text-anchor", (d) =>
      d.x < Math.PI === !d.children ? "start" : "end"
    )
    .attr("opacity", (d) => {
      return d.data.opacity;
    })
    .text((node) => node.data.name);

  // Add links between nodes
  const enteringAndUpdatingLinks = svg
    .selectAll(".link")
    .data(root.links())
    .join("path")
    .attr("class", "link")
    .attr("d", linkGenerator)
    .attr("stroke-dasharray", function () {
      const length = this.getTotalLength();
      return `${length} ${length}`;
    })
    .attr("stroke", "black")
    .attr("fill", "none")
    //If the parent node is highlighted, also highlight the link
    .attr("opacity", (link) =>
      link.source.data.opacity === VConf.FULL_OPACITY
        ? VConf.FULL_OPACITY
        : VConf.FADE_OPACITY
    );
  svg.attr("viewBox", autoBox).node();
  return [nodeGroupEnterAndUpdate, enteringAndUpdatingLinks];
}

/**
 *
 * @param jsonData: JSON data representing the tree structure
 * @param onNodeClick: Function to execute when one clicks on a node of the tree
 * @param onRightClick: Function to execute when one clicks on a node of the tree
 * @param isHovering: Boolean, is true when a link is being hovered over
 * @returns the tree component
 */
export function Tree({ jsonData, onNodeClick, onRightClick, isHovering }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // We save data to see if it changed
  const previouslyRenderedData = usePrevious(jsonData);

  /**
   * This effect updates the dimensions' state every time the user
   * resizes their window
   */
  useEffect(() => {
    const observeTarget = wrapperRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [wrapperRef]);

  /**
   * Re-renders whenever the list of dependencies updates;
   * animates the tree links only when the data changes.
   */
  useEffect(() => {
    if (jsonData.name === undefined) {
      //Skip rerender if the data hasn't been fetched yet
      return;
    }
    const [nodeGroupEnterAndUpdate, enteringAndUpdatingLinks] = renderTree(
      dimensions,
      jsonData,
      svgRef,
      onNodeClick,
      onRightClick
    );
    // Animate only when the tree root changes
    if (jsonData.name !== previouslyRenderedData.name) {
      animateTree(nodeGroupEnterAndUpdate, enteringAndUpdatingLinks);
    }
  }, [
    jsonData,
    dimensions,
    previouslyRenderedData,
    onNodeClick,
    onRightClick,
    isHovering,
  ]);

  return (
    <React.Fragment>
      <div ref={wrapperRef}>
        <svg className={styles.tree} ref={svgRef}></svg>
      </div>
    </React.Fragment>
  );
}
