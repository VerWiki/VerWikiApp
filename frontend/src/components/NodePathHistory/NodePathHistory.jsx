import React from "react";
import { Box, Button, Breadcrumbs } from "@material-ui/core";
import { NavigateNext } from "@material-ui/icons";

export const NodePathHistory = ({ path, onNodeNameClick }) => {
  const Links = path.slice(0, -1).map((name, index) => (
    <Button key={index} onClick={(e) => onNodeNameClick(e, name)}>
      <Box>{name}</Box>
    </Button>
  ));

  return (
    <Box>
      <Breadcrumbs
        maxItems={4}
        itemsAfterCollapse={3}
        itemsBeforeCollapse={0}
        color="primary"
        aria-label="breadcrumb"
        separator={<NavigateNext fontSize="small" />}
      >
        {Links}

        {/* The last element is styled differently and not rendered as a link */}
        <Button disableRipple>
          <Box>{path[path.length - 1]}</Box>
        </Button>
      </Breadcrumbs>
    </Box>
  );
};
