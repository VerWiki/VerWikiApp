import React from 'react';
import styles from './CoursePage.module.css';
import { Navigation } from '../../components/Navigation/Navigation';
import { TreeViewer } from '../../components/TreeViewer/TreeViewer';
import { useParams } from 'react-router-dom';
import { courseData } from '../../model/courseData';

export const CoursePage = () => {
  let { courseId } = useParams();
  
  return (
    <>
      <Navigation />
      <h1 className={styles.heading}>{courseData[courseId].name}</h1>
      <TreeViewer courseId={courseId} />
    </>
  );
}