import React, { useState, useRef, useEffect } from "react";
import styles from "./Tree.module.css";
import { select, hierarchy, tree, linkRadial, ascending } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import "./Tree.module.css";
import { usePrevious, sigmoid, autoBox } from "../../utils/utils";

const DIMMED_OPACITY = 0.25;

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
 * Function to render the hovered subtree when hovering over a given tree
 * @param {Array} renderedNodesList Array of all nodes that were rendered with opacity 1
 * @param {string} hoveredNodeLink The link of the node being hovered on
 * @param {Node} node The node to render
 */
function renderNodeAndTag(renderedNodesList, hoveredNodeLink, node) {
  if (hoveredNodeLink === "") {
    // Nothing being hovered on, so return full opacity
    node.data.opacity = 1;
    renderedNodesList.push(node);
    return 1;
  } else if (node.data.url === hoveredNodeLink) {
    // Node being hovered on, hence add opacity 1 for children to follow
    node.data.opacity = 1;
    renderedNodesList.push(node);
    return 1;
  } else {
    if (node.parent !== null && node.parent.data.opacity === 1) {
      // Node is a child of highlighted node, so highlight and
      // add opacity 1 for its children to follow
      node.data.opacity = 1;
      renderedNodesList.push(node);
      return 1;
    }
    // Unrelated node, so dim opacity
    node.data.opacity = DIMMED_OPACITY;
    return DIMMED_OPACITY;
  }
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
 * @param hoveredNodeLink: String representing the link that the
 * user is currently hovering over
 * @param renderedNodesList: A list of all the nodes that were
 * rendered with opacity = 1
 * @returns SVG groupings of nodes-and-text, and inter-node links
 */

function renderTree(
  dimensions,
  jsonData,
  svgRef,
  onNodeClick,
  onRightClick,
  hoveredNodeLink,
  renderedNodesList
) {
  if (renderedNodesList.length > 0) {
    renderedNodesList.length = 0;
  }
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
    .attr("fill", (d) => (d.data.numChildren === 0 ? "#b30000" : "#555"))
    .attr("r", 6)
    .attr("opacity", (d) => {
      return renderNodeAndTag(renderedNodesList, hoveredNodeLink, d);
    });

  // Add labels to the node group
  nodeGroupEnter
    .append("text")
    .merge(nodeGroup.select("text"))
    .attr("text-anchor", "middle")
    .attr("font-size", Math.max(6, sigmoid(width) * 17))
    .attr("y", -15)
    .attr(
      "transform",
      (d) => `
        rotate(${(d.x * 180) / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `
    )
    .attr("dy", "0.90em")
    .attr("dx", "0.0em")
    // Adds spacing between the node and the label; At even numbered depths, the label is on the
    // left side; at even numbered depths on the right side hence the if statament
    .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    .attr("text-anchor", (d) =>
      d.x < Math.PI === !d.children ? "start" : "end"
    )
    .attr("opacity", (d) => {
      return renderNodeAndTag(renderedNodesList, hoveredNodeLink, d);
    })
    .text((node) => node.data.name + " ");

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
    .attr("opacity", (link) => {
      if (link.source.data.opacity === 1) {
        // If source opaque, make target opaque
        return 1;
      }
      if (hoveredNodeLink !== "") {
        // if unrelated link, make translucent
        return DIMMED_OPACITY;
      }
      // default, return opaque link
      return 1;
    });
  svg.attr("viewBox", autoBox).node();
  return [nodeGroupEnterAndUpdate, enteringAndUpdatingLinks];
}

/**
 *
 * @param jsonData: JSON data representing the tree structure
 * @param onNodeClick: Function to execute when one clicks on a node of the tree
 * @param onRightClick: Function to execute when one clicks on a node of the tree
 * @param hoveredNodeLink: Link that the user is currently hovering over, else ""
 * @returns the tree component
 */
export function Tree({
  jsonData,
  onNodeClick,
  onRightClick,
  hoveredNodeLink,
  renderedNodesList,
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
      hoveredNodeLink,
      renderedNodesList
    );
    if (renderedNodesList.length === 0) {
      console.log("RENDER ALTERNATIVE TREE"); // TODO

      /**
       * Possible steps here:
       * Search function to check if the hoveredNodeLink does indeed corespond to a node in the tree
       * If so, then call onNodeClick() on that node in the tree
       * Ensure that the animation doesn't run over here; will be too slow; should just show the new subtree
       * When the hovering finishes, ensure to display the previously seen tree, again without hovering
       * This can be done by calling onNodeClick() on the previously root node
       *
       *
       **/

      console.log(hoveredNodeLink);
      // [nodeGroupEnterAndUpdate, enteringAndUpdatingLinks] = renderTree(
      //   dimensions,
      //   previewData,
      //   svgRef,
      //   onNodeClick,
      //   onRightClick,
      //   hoveredNodeLink,
      //   renderedNodesList
      // );
    }
    if (jsonData !== previouslyRenderedData) {
      animateTree(nodeGroupEnterAndUpdate, enteringAndUpdatingLinks);
    }
  }, [
    jsonData,
    dimensions,
    previouslyRenderedData,
    onNodeClick,
    onRightClick,
    hoveredNodeLink,
    renderedNodesList,
  ]);

  return (
    <React.Fragment>
      <div ref={wrapperRef}>
        <svg className={styles.tree} ref={svgRef}></svg>
      </div>
    </React.Fragment>
  );
}

/**
 * RENDER PREVIEW-TREE WHEN HOVERING OVER A LINK THAT IS NOT IN THE PRESENT VIEW [NEXT TICKET]
 * 1. how to make the decision of whether to show a preview window or to highlight subtree?
 * - COULD HAVE A LIST OF ALL NODES THAT WERE MADE OPAQUE DURING A HIGHLIGHT, IF THAT NUMBER IS 0 THEN TRIGGER A PREVIEW WINDOW [DONE]
 * 2. a good path to use as experiment is WISDOM > FRONT > WEBSITE > VIDEOS
 * 3. if the list of highlighted nodes is empty, trigger a preview window [DONE]
 * 4. When triggering the preview window, get the URL of the thing youre hovering over, and call the TrimTree and RenderTree and display
 * 5. When not rendering, render whatever you were rendering before
 */
