import React, { useState, useEffect } from "react";
import styles from "./CoursePage.module.css";
import { Navigation } from "../../components/Navigation/Navigation";
import { TreeViewer } from "../../components/TreeViewer/TreeViewer";
import { useParams } from "react-router-dom";
import { courseData } from "../../model/courseData";

export const CoursePage = () => {
  const { courseId } = useParams();

  const [error, setError] = useState(null);
  const [treeObj, setTreeObj] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3003/get-tree-by-id/${courseId}`)
      .then((res) => {
        return res.json();
      })
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
    Viewer = <TreeViewer data={treeObj} />;
  }

  return (
    <>
      <Navigation />
      <h1 className={styles.heading}>{courseData[courseId].name}</h1>
      <div>{Viewer}</div>
    </>
  );
};
