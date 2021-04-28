import React, { useState, useEffect } from "react";
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
    Viewer = <TreeViewer data={treeObj} heading={courseData[courseId].name} />;
  }

  return (
    <>
      <div>{Viewer}</div>
    </>
  );
};

/**
 * TODO:
 * 1. put course name and explore button on the toolbar
 * 2. add animations to the info box appearing
 * 3. suggest antd backtop README improvement
 */
