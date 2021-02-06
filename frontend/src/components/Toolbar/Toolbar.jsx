import React from "react";
import { Box } from "@material-ui/core";

export const Toolbar = ({ children }) => {
  return (
    <Box
      borderColor="grey.400"
      border={1}
      borderLeft={0}
      borderRight={0}
      display="flex"
      p={1.5}
    >
      {children.map((child, index) => (
        <Box px={1} key={index}>
          {child}
        </Box>
      ))}
    </Box>
  );
};
