import React from "react";
import styles from "./Navigation.module.css";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <Link to={"/"}>Explore</Link>
        </li>
      </ul>
    </div>
  );
};
