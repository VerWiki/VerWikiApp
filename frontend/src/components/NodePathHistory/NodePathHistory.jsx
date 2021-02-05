import React from "react";
import styles from "./NodePathHistory.module.css";
import { Breadcrumbs } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Link } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export const NodePathHistory = ({ path }) => {
  const Links = path.slice(0, -1).map((name, index) => (
    <Link key={index} color="inherit" href="#" onClick={handleClick}>
      <p>{name}</p>
    </Link>
  ));

  return (
    <div className={styles.breadcrumbsContainer}>
      <Breadcrumbs
        maxItems={4}
        itemsAfterCollapse={3}
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {Links}

        {/* The last element is styled differently and not a link */}
        <Typography color="textPrimary">{path[path.length - 1]}</Typography>
      </Breadcrumbs>
    </div>
  );
};
