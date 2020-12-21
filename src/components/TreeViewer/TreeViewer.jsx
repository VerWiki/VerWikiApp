import React from 'react';
import styles from './TreeViewer.module.css';

export const TreeViewer = ({ courseId }) => { 
  return (
    <div className={styles.nav}>
        Display the tree for course id: {courseId} here
    </div>
  );
}