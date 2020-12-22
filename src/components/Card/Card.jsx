import React from 'react';
import styles from './Card.module.css';
import { Link } from 'react-router-dom';
import { courseData } from '../../model/courseData';

export const Card = ({ courseId }) => { 
  return (
    <Link className={styles.card} to={`/courses/${courseId}`}>{courseData[courseId].name}</Link>
  );
}