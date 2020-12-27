import React from "react";
import styles from "./TreeViewer.module.css";
import { useParams } from "react-router-dom";
import ReactJson from "react-json-view";
import { Tree } from "../Tree/Tree";

export const TreeViewer = ({ data }) => {
  const { courseId } = useParams();

  let tree = null;
  let element = null;
  if (!data || Object.keys(data).length === 0) {
    element = <h2>"Loading..."</h2>;
  } else {
    element = (
      <ReactJson
        name={null}
        src={data}
        theme="ocean"
        style={{ padding: 10, textAlign: "left" }}
        collapsed={2}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    );
  }

  return (
    <div className={styles.nav}>
      Display the tree for course id: {courseId} here:
      <br />
      <br />
      <br />
      <Tree></Tree>
      {element}
    </div>
  );
};
