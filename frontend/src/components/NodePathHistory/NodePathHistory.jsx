import React from "react";
import styles from "./NodePathHistory.module.css";
import { Breadcrumbs } from "@material-ui/core";
import { Link } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

export const NodePathHistory = ({ path, onNodeNameClick }) => {
  const Links = path.slice(0, -1).map((name, index) => (
    <Link key={index} color="inherit" onClick={(e) => onNodeNameClick(e, name)}>
      <p>{name}</p>
    </Link>
  ));

  return (
    <div className={styles.breadcrumbsContainer}>
      <Breadcrumbs
        maxItems={4}
        itemsAfterCollapse={3}
        itemsBeforeCollapse={0}
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {Links}

        {/* The last element is styled differently and not rendered as a link */}
        <Link color="textPrimary" underline="none">
          <p>{path[path.length - 1]}</p>
        </Link>
      </Breadcrumbs>
    </div>
  );
};
