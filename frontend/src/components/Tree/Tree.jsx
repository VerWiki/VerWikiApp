import React, { useState, useRef, useEffect } from "react";
import styles from "./Tree.module.css";
import { select, hierarchy, tree, linkHorizontal } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import "./Tree.module.css";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function Tree({ jsonData, onNodeClick }) {
  const [currentView, setCurrentView] = useState({});
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // We save data to see if it changed
  const previouslyRenderedData = usePrevious(currentView);

  useEffect(() => {
    setCurrentView(jsonData);
  }, [jsonData]);

  // Will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // Use dimensions from useResizeObserver,
    // but use getBoundingClientRect on initial render
    // (dimensions are null for the first render)
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // Transform hierarchical data
    const root = hierarchy(currentView);
    const treeLayout = tree().size([height, width - 200]);

    // Creates the links between nodes
    const linkGenerator = linkHorizontal()
      .x((link) => link.y)
      .y((link) => link.x);

    // Enrich hierarchical data with coordinates
    treeLayout(root);

    // Create the node group, which will hold the nodes and labels
    const nodeGroup = svg.selectAll(".node-group").data(root.descendants());
    const nodeGroupEnter = nodeGroup.enter().append("g");

    nodeGroupEnter
      .merge(nodeGroup)
      .attr("class", "node-group")
      .attr("transform", (node) => `translate(${node.y},${node.x})`)
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

    // Add links between nodes and animate them in
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

    // This is needed so the animations don't happen again every
    // time we resize the window
    if (currentView !== previouslyRenderedData) {
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
  }, [currentView, dimensions, previouslyRenderedData, onNodeClick]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg className={styles.treeContainer} ref={svgRef} height="1000"></svg>
      </div>
    </React.Fragment>
  );
}
