import React from "react";
import Box from "@material-ui/core/Box";
// import styles from "./Toolbar.module.css";

const convertToArray = (obj) => {
  if (obj && !Array.isArray(obj)) {
    return [obj];
  }
  return obj;
};

export const Toolbar = ({ left, center, right }) => {
  left = convertToArray(left);
  center = convertToArray(center);
  right = convertToArray(right);

  // Need to set flexGrow=1 to left and right if center exists, so that
  // those elements are always centered
  let addFlex = false;
  if (center) {
    addFlex = true;
  }

  return (
    <Box
      borderBottom="1px solid #bdbdbd"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="nowrap"
      minHeight={40}
      overflow="scroll"
      className="scrollbar"
    >
      <Box
        p={1.5}
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flex={addFlex ? 1 : null}
      >
        {left &&
          left.map((element, index) => (
            <Box px={1} key={index}>
              {element}
            </Box>
          ))}
      </Box>
      <Box p={1.5} display="flex" alignItems="center" justifyContent="center">
        {center &&
          center.map((element, index) => (
            <Box px={1} key={index}>
              {element}
            </Box>
          ))}
      </Box>
      <Box
        p={1.5}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        flex={addFlex ? 1 : null}
      >
        {right &&
          right.map((element, index) => (
            <Box px={1} key={index}>
              {element}
            </Box>
          ))}
      </Box>
    </Box>
  );
};
