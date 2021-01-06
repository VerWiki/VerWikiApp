import React, { useState, useRef, useEffect } from "react";
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

export default function Tree({ jsonData }) {
  const [currentView, setCurrentView] = useState({});
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // we save data to see if it changed
  const previouslyRenderedData = usePrevious(currentView);

  useEffect(() => {
    setCurrentView(jsonData);
  }, [jsonData]);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // use dimensions from useResizeObserver,
    // but use getBoundingClientRect on initial render
    // (dimensions are null for the first render)
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // transform hierarchical data
    const root = hierarchy(currentView);
    const treeLayout = tree().size([height, width - 200]);

    const linkGenerator = linkHorizontal()
      .x((link) => link.y)
      .y((link) => link.x);

    // enrich hierarchical data with coordinates
    treeLayout(root);

    const nodeGroup = svg.selectAll(".node-group").data(root.descendants());
    const nodeGroupEnter = nodeGroup.enter().append("g");

    nodeGroupEnter
      .merge(nodeGroup)
      .attr("class", "node-group")
      .attr("transform", (node) => `translate(${node.y},${node.x})`)
      .style("cursor", "pointer")
      .on("click", function (event, obj) {
        setCurrentView(obj.data);
      });

    nodeGroup.exit().remove();

    // nodes
    nodeGroupEnter
      .append("circle")
      .merge(nodeGroup.select("circle"))
      .attr("r", 4);

    // labels
    nodeGroupEnter
      .append("text")
      .merge(nodeGroup.select("text"))
      .attr("text-anchor", "middle")
      .attr("font-size", 18)
      .attr("y", -15)
      .text((node) => node.data.name);

    // links
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
  }, [currentView, dimensions, previouslyRenderedData]);
  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg
          style={{ marginLeft: 40 }}
          ref={svgRef}
          height="1540"
          width="500"
        ></svg>
      </div>
    </React.Fragment>
  );
}
