import React, { useState, useEffect } from "react";
import styles from "./CoursePage.module.css";
import { Navigation } from "../../components/Navigation/Navigation";
import { TreeViewer } from "../../components/TreeViewer/TreeViewer";
import { useParams } from "react-router-dom";
import { courseData } from "../../model/courseData";

/**
 * 1. How to put links in each of the nodes
 * 2. How to display information on the screen
 * 3. Backend connectivity to facilitate this
 */

export const CoursePage = () => {
  const { courseId } = useParams();

  const [error, setError] = useState(null);
  const [treeObj, setTreeObj] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3003/get-tree-by-id/${courseId}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setTreeObj(result);
        },

        (error) => {
          setError(error);
        }
      );
  }, [courseId]);

  let Viewer = null;
  if (error) {
    Viewer = <h2>{`Error: ${error.message}`}</h2>;
  } else {
    Viewer = <TreeViewer data={treeObj} treeID={courseId} />;
  }

  return (
    <>
      <Navigation />
      <h1 className={styles.heading}>{courseData[courseId].name}</h1>
      <div className="tree">{Viewer}</div>
    </>
  );
};
