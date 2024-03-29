import React, { useState, useRef, useEffect } from "react";
import styles from "./Tree.module.css";
import { select, hierarchy, tree, linkRadial, ascending } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import "./Tree.module.css";
import { usePrevious, sigmoid, autoBox } from "../../utils/utils";
import { VConf, TreeConf } from "../../utils/config";

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
    .duration(TreeConf.ANIMATE_TIME)
    .delay((node) => node.depth * TreeConf.ANIMATE_TIME)
    .attr("opacity", VConf.FULL_OPACITY);

  enteringAndUpdatingLinks
    .attr("stroke-dashoffset", function () {
      return this.getTotalLength();
    })
    .transition()
    .duration(TreeConf.ANIMATE_TIME)
    .delay((link) => link.source.depth * TreeConf.ANIMATE_TIME)
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
 * @param curViewingNodeID: A node that is currently being viewed
 * (if any)
 * @param hoverText: A variable that decides the heading of the
 * info window
 * @param setHoverText: A function that sets the hover text
 * @returns SVG groupings of nodes-and-text, and inter-node links
 */

function renderTree(
  dimensions,
  jsonData,
  svgRef,
  onNodeClick,
  onRightClick,
  curViewingNodeID,
  hoverText,
  setHoverText
) {
  const svg = select(svgRef.current);
  const { width, height } = dimensions;

  const radius = Math.min(width, height) * TreeConf.RADIUS_SCALER;

  // Transform hierarchical data
  const root = hierarchy(jsonData).sort((a, b) =>
    ascending(a.data.name, b.data.name)
  );
  const treeLayout = tree()
    .size([2 * Math.PI, radius])
    .separation(
      (a, b) => (a.parent === b.parent ? TreeConf.SIBLING_SPACING : 1) / a.depth
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
        rotate(${(d.x * TreeConf.NODE_ROTATE_FACTOR) / Math.PI - 90})
        translate(${d.y},0)
      `
    )
    .attr("opacity", (d) => {
      return d.data.opacity;
    })
    .attr("fill", (treeNode) => {
      // Separate color if a node is being viewed by the user
      if (treeNode.data.name === curViewingNodeID) {
        return TreeConf.VIEWING_NODE_COLOUR;
      } else if (treeNode.data.numChildren === 0) {
        return TreeConf.LEAF_COLOUR;
      }
      return TreeConf.NODE_COLOUR;
    })
    .attr("r", (treeNode) => {
      // Makes node bigger to help differentiate which node
      // is being looked at
      if (treeNode.data.name === curViewingNodeID) {
        return TreeConf.VIEWING_NODE_SIZE;
      }
      return TreeConf.NODE_SIZE;
    });

  // Add labels to the node group
  nodeGroupEnter
    .append("text")
    .merge(nodeGroup.select("text"))
    .attr("text-anchor", "middle")
    .attr(
      "font-size",
      Math.max(TreeConf.MIN_FONT_SIZE, sigmoid(width) * TreeConf.MAX_FONT_SIZE)
    )
    .attr("y", TreeConf.LABEL_HEIGHT_OFFSET)
    .attr(
      "transform",
      (d) => `
        rotate(${(d.x * TreeConf.NODE_ROTATE_FACTOR) / Math.PI - 90}) 
        translate(${d.y}, ${TreeConf.LABEL_ROTATE_OFFSET}) 
        rotate(${d.x >= Math.PI ? TreeConf.NODE_ROTATE_FACTOR : 0})
      `
    )
    .attr("dy", "1.00em")
    .attr("dx", "0.0em")
    .attr("opacity", (d) => {
      return d.data.opacity;
    })
    // Adds spacing between the node and the label; At even numbered depths, the label is on the
    // left side; at even numbered depths on the right side hence the if statament
    .attr("x", (d) =>
      d.x < Math.PI === !d.children
        ? TreeConf.LABEL_NODE_SPACING
        : -1 * TreeConf.LABEL_NODE_SPACING
    )
    .attr("text-anchor", (d) =>
      d.x < Math.PI === !d.children ? "start" : "end"
    )
    .attr("opacity", (d) => {
      return d.data.opacity;
    })
    .text((node) => {
      if (hoverText === node.data.name) return node.data.name;

      // if name length more than the LABEL_TRUNCATION_LENGTH plus buffer
      if (node.data.name.length > TreeConf.LABEL_TRUNCATION_LENGTH + 3) {
        // truncate at LABEL_TRUNCATION_LENGTH
        return (
          node.data.name.substr(0, TreeConf.LABEL_TRUNCATION_LENGTH) + "..."
        );
      } else {
        // else return full name
        return node.data.name;
      }
    })
    .on("mouseover", (d, i) => {
      setHoverText(i.data.name);
    })
    .on("mouseout", (d, i) => {
      setHoverText("");
    });

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
 * The tree component; returns the component that actually renders the radial
 * tree.
 * @param jsonData: JSON data representing the tree structure
 * @param onNodeClick: Function to execute when one clicks on a node of the tree
 * @param onRightClick: Function to execute when one clicks on a node of the tree
 * @param curViewingNodeID: String, a node that is currently being viewed (if any)
 * @returns the tree component
 */
export function Tree({
  jsonData,
  onNodeClick,
  onRightClick,
  curViewingNodeID,
}) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverText, setHoverText] = useState("");
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
      onRightClick,
      curViewingNodeID,
      hoverText,
      setHoverText
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
    curViewingNodeID,
    hoverText,
  ]);

  return (
    <React.Fragment>
      <div ref={wrapperRef}>
        <svg className={styles.tree} ref={svgRef}></svg>
      </div>
    </React.Fragment>
  );
}
