import React from "react";
import styles from "./ExplorePage.module.css";
// import { Navigation } from '../../components/Navigation/Navigation';
import { Card } from "../../components/Card/Card";
import { courseData } from "../../model/courseData";

export const ExplorePage = () => {
  const CourseItems = Object.keys(courseData).map((courseId) => (
    <Card key={courseId} courseId={courseId} />
  ));

  return (
    <div className={styles.pageContainer}>
      {/* <Navigation /> */}
      <h1 className={styles.heading}>Explore Courses</h1>
      <div className={styles.courseGrid}>{CourseItems}</div>
    </div>
  );
};
