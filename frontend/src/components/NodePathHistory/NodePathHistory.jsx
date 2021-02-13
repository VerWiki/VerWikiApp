import React, { useState, useEffect } from "react";
// import styles from "./NodePathHistory.module.css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import NavigateNext from "@material-ui/icons/NavigateNext";
import EditRounded from "@material-ui/icons/EditRounded";
import DoneRounded from "@material-ui/icons/DoneRounded";

const MODES = { VIEW: 0, EDIT: 1 };

/**
 * Join the list of node names into one string, and add
 * an extra slash at the end so the user knows what the
 * delimiter is initially, when there is only one node
 * in the path.
 */
function convertPathToString(path) {
  return path.join("/") + "/";
}

function convertStringToPath(string) {
  // Remove preceding or trailing slashes and spaces
  return string.trim().replace(/^\/+/, "").replace(/\/+$/, "").split("/");
}

export const NodePathHistory = ({
  path,
  onNodeNameClick,
  onPathChange,
  isValidPath,
}) => {
  const [mode, setMode] = useState(MODES.VIEW);
  const [currentText, setCurrentText] = useState("");
  const [isCurrentTextValid, setIsCurrentTextValid] = useState(false);

  /**
   * Whenever the path is updated from the parent component,
   * set the current text to the path it represents.
   */
  useEffect(() => {
    setCurrentText(convertPathToString(path));
  }, [path]);

  /**
   * Any time that the current text is updated, which can happen
   * when the parent changes the path prop, or if the user types
   * in the text field, check if what is typed is valid or not
   * and store it.
   */
  useEffect(() => {
    setIsCurrentTextValid(isValidPath(convertStringToPath(currentText)));
  }, [currentText, isValidPath]);

  /**
   * Store the current text being typed
   */
  const onTextChangeHandler = (event) => {
    setCurrentText(event.target.value);
  };

  /**
   * Triggered when the user is finished editing a VALID path
   * and clicks done. Notifies the parent of the change
   * through a callback, passing in the new path as a parameter.
   */
  const onDoneClickHandler = () => {
    const newPath = convertStringToPath(currentText);

    // Inform the parent container of the change, if there was one
    if (currentText !== convertPathToString(path)) {
      onPathChange(newPath);
    }
  };

  /**
   * If the user clicks outside of the text field, reset
   * the text inside of it and go back to view mode.
   */
  const clearChanges = () => {
    setCurrentText(convertPathToString(path));
    setMode(MODES.VIEW);
  };

  const Links = path.slice(0, -1).map((name, index) => (
    <Button key={index} onClick={() => onNodeNameClick(name)}>
      <Box>{name}</Box>
    </Button>
  ));

  // This view renders the breadcrumbs that show the current
  // path from the root to the current node, with the ability
  // to click on any internal nodes within that path. This renders
  // at most 4 elements in the path. If there are more, an ellipsis
  // is added to hide everything besides the 3 nodes that are closest
  // to the current node.
  const BreadcrumbsView = (
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
  );

  // This view shows the text field that lets you edit the current
  // path from the root, and if the button is clicked, or enter is
  // pressed, the tree will update accordingly.
  const EditPathView = (
    <ClickAwayListener onClickAway={clearChanges}>
      <TextField
        fullWidth
        label="Path"
        value={currentText}
        variant="outlined"
        size="small"
        onChange={onTextChangeHandler}
        onKeyDown={(e) => {
          // If the enter key is pressed, and the text is valid
          // it is equivalent to clicking on Done
          if (e.keyCode === 13 && isCurrentTextValid) onDoneClickHandler();
        }}
      />
    </ClickAwayListener>
  );

  const EditButton = (
    <Button
      color="primary"
      variant="outlined"
      size="large"
      onClick={() => setMode(MODES.EDIT)}
    >
      <EditRounded fontSize="small" />
    </Button>
  );

  const DoneButton = (
    <Button
      color="primary"
      variant="outlined"
      size="large"
      disabled={!isCurrentTextValid}
      onClick={onDoneClickHandler}
    >
      <DoneRounded />
    </Button>
  );

  return (
    <Box display="flex" alignItems="center">
      <Box>{mode === MODES.VIEW ? BreadcrumbsView : EditPathView}</Box>
      <Box pl={1.5}>{mode === MODES.VIEW ? EditButton : DoneButton}</Box>
    </Box>
  );
};
