import React, { useState, useRef, useEffect } from "react";
import styles from "./Tree.module.css";
import { select, hierarchy, tree, linkHorizontal } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import "./Tree.module.css";

/**
 * This function takes two parameters and performs the animation
 * of the links between them.
 * @param nodeGroupEnter : TODO sultan help pls
 * @param enteringAndUpdatingLinks : TODO sultan help pls
 */

function animateTree(nodeGroupEnter, enteringAndUpdatingLinks) {
  nodeGroupEnter
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
 * @returns TODO sultan help pls
 */

function renderTree(dimensions, jsonData, svgRef, onNodeClick) {
  const svg = select(svgRef.current);
  const { width, height } = dimensions;
  const marginLeft = 70;
  const marginTop = 30;

  // Transform hierarchical data
  const root = hierarchy(jsonData);
  const treeLayout = tree().size([height, width]);

  // Creates the links between nodes
  const linkGenerator = linkHorizontal()
    .x((link) => link.y + marginLeft)
    .y((link) => link.x + marginTop);

  // Enrich hierarchical data with coordinates
  treeLayout(root);

  // Create the node group, which will hold the nodes and labels
  const nodeGroup = svg.selectAll(".node-group").data(root.descendants());
  const nodeGroupEnter = nodeGroup.enter().append("g");

  nodeGroupEnter
    .merge(nodeGroup)
    .attr("class", "node-group")
    .attr(
      "transform",
      (node) => `translate(${node.y + marginLeft},${node.x + marginTop})`
    )
    .style("cursor", "pointer")
    .on("click", onNodeClick);

  nodeGroup.exit().remove();

  // Add nodes to the node group
  nodeGroupEnter
    .append("circle")
    .merge(nodeGroup.select("circle"))
    .attr("r", 4);

  // Add labels to the node group
  nodeGroupEnter
    .append("text")
    .merge(nodeGroup.select("text"))
    .attr("text-anchor", "middle")
    .attr("font-size", 18)
    .attr("y", -15)
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
    .attr("opacity", 1);
  return [nodeGroupEnter, enteringAndUpdatingLinks];
}

/**
 * Tracks the previous value of the given item. Returns
 * the previous value
 * @param value : The object to be tracked
 */

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function Tree({ jsonData, onNodeClick }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // We save data to see if it changed
  const previouslyRenderedData = usePrevious(jsonData);

  /**
   * This effect updates the dimension's state every time the user
   * resizes their window
   */
  useEffect(() => {
    const observeTarget = wrapperRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions({
          // add margins to prevent chopped off content
          width: entry.contentRect.width - 200,
          height: entry.contentRect.height - 50,
        });
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [wrapperRef]);

  /***
   * Re-renders whenever the list of dependencies updates;
   * animates the tree links only when the data changes.
   */
  useEffect(() => {
    const [nodeGroupEnter, enteringAndUpdatingLinks] = renderTree(
      dimensions,
      jsonData,
      svgRef,
      onNodeClick
    );
    if (jsonData !== previouslyRenderedData) {
      animateTree(nodeGroupEnter, enteringAndUpdatingLinks);
    }
  }, [jsonData, dimensions, previouslyRenderedData, onNodeClick]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg className={styles.treeContainer} ref={svgRef}></svg>
      </div>
    </React.Fragment>
  );
}
