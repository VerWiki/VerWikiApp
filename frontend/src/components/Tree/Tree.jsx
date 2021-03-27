import React, { useState, useRef, useEffect } from "react";
import styles from "./Tree.module.css";
import { select, hierarchy, tree, linkRadial, ascending } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import "./Tree.module.css";
import { usePrevious, sigmoid, autoBox } from "../../utils/utils";

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
    .duration(500)
    .delay((node) => node.depth * 300)
    .attr("opacity", 1);

  enteringAndUpdatingLinks
    .attr("stroke-dashoffset", function () {
      return this.getTotalLength();
    })
    .transition()
    .duration(500)
    .delay((link) => link.source.depth * 500)
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
 * @returns SVG groupings of nodes-and-text, and inter-node links
 */

function renderTree(
  dimensions,
  jsonData,
  svgRef,
  onNodeClick,
  onRightClick,
  curViewingNodeID
) {
  const svg = select(svgRef.current);
  const { width, height } = dimensions;

  const radius = Math.min(width, height) / 2.5;
  const translateStr = "translate(" + width / 2 + "," + height / 2 + ")";

  // Transform hierarchical data
  const root = hierarchy(jsonData).sort((a, b) =>
    ascending(a.data.name, b.data.name)
  );
  const treeLayout = tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

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
    .attr("transform", translateStr)
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
        rotate(${(d.x * 180) / Math.PI - 90})
        translate(${d.y},0)
      `
    )
    .attr("opacity", (d) => {
      return d.data.opacity;
    })
    .attr("fill", (treeNode) => {
      // Separate color if a node is being viewed by the user
      if (treeNode.data.name === curViewingNodeID) {
        return "#377bfa";
      } else if (treeNode.data.numChildren === 0) {
        return "#b30000";
      }
      return "#555";
    })
    .attr("r", (treeNode) => {
      // Makes node bigger to help differentiate which node
      // is being looked at
      if (treeNode.data.name === curViewingNodeID) {
        return 10;
      }
      return 7;
    });

  // Add labels to the node group
  nodeGroupEnter
    .append("text")
    .merge(nodeGroup.select("text"))
    .attr("text-anchor", "middle")
    .attr("font-size", Math.max(6, sigmoid(width) * 17))
    .attr("y", (d) => {
      return -20;
    })
    .attr("transform", (d) => {
      return `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y},${d.x})
          rotate(${d.x >= Math.PI ? 180 : 0})
        `;
    })
    .attr("dy", "0.90em")
    .attr("dx", "0.0em")
    .text((node) => node.data.name + " ")
    .attr("opacity", (d) => {
      return d.data.opacity;
    })
    // Adds spacing between the node and the label; At even numbered depths, the label is on the
    // left side; at even numbered depths on the right side hence the if statament
    .attr("x", (d) => {
      let distance = 8;
      if (d.x < Math.PI === !d.children) {
        return distance;
      }
      return -1 * distance;
    })
    .attr("text-anchor", (d) => {
      if (d.x < Math.PI === !d.children) {
        return "start";
      }
      return "end";
    });

  // Add links between nodes
  const enteringAndUpdatingLinks = svg
    .selectAll(".link")
    .data(root.links())
    .join("path")
    .attr("class", "link")
    .attr("transform", translateStr)
    .attr("d", linkGenerator)
    .attr("stroke-dasharray", function () {
      const length = this.getTotalLength();
      return `${length} ${length}`;
    })
    .attr("stroke", "black")
    .attr("fill", "none")
    //If the parent node is highlighted, also highlight the link
    .attr("opacity", (link) => (link.source.data.opacity === 1 ? 1 : 0.25));

  svg.attr("viewBox", autoBox).node();
  return [nodeGroupEnterAndUpdate, enteringAndUpdatingLinks];
}

/**
 * The tree component; returns the component that actually renders the radial
 * tree.
 * @param jsonData: JSON data representing the tree structure
 * @param onNodeClick: Function to execute when one clicks on a node of the tree
 * @param onRightClick: Function to execute when one clicks on a node of the tree
 * @param isHovering: Boolean, is true when a link is being hovered over
 * @param curViewingNodeID: String, a node that is currently being viewed (if any)
 * @returns the tree component
 */
export function Tree({
  jsonData,
  onNodeClick,
  onRightClick,
  isHovering,
  curViewingNodeID,
}) {
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
      onRightClick,
      curViewingNodeID
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
    curViewingNodeID,
  ]);

  return (
    <React.Fragment>
      <div ref={wrapperRef}>
        <svg className={styles.tree} ref={svgRef}></svg>
      </div>
    </React.Fragment>
  );
}
