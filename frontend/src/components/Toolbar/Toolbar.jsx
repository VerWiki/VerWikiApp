import React from "react";
import Box from "@material-ui/core/Box";

export const Toolbar = ({ children }) => {
  return (
    <Box
      borderColor="grey.400"
      border={1}
      borderLeft={0}
      borderRight={0}
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      p={1.5}
      minHeight={40}
    >
      {children.map((child, index) => (
        <Box px={1} key={index}>
          {child}
        </Box>
      ))}
    </Box>
  );
};
