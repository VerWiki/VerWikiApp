import React from 'react';
import styles from './ExplorePage.module.css';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation/Navigation';
import { courseData } from '../../model/courseData';

export const ExplorePage = () => {
  const CourseItems = Object.keys(courseData).map((courseId) => 
    <li key={courseId}><Link to={`/courses/${courseId}`}>{courseData[courseId].name}</Link></li>
  );

  return (
    <>
      <Navigation />
      <h1 className={styles.heading}>Explore Courses</h1>
      <ul>
        {CourseItems}
      </ul>
    </>
  );
}