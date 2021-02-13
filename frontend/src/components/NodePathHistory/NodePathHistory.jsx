import React, { useState, useEffect } from "react";
// import styles from "./NodePathHistory.module.css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
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

export const NodePathHistory = ({
  path,
  onNodeNameClick,
  onPathChange,
  isValidPath,
}) => {
  const [mode, setMode] = useState(MODES.VIEW);
  const [currentText, setCurrentText] = useState("");
  const [errorOpen, setErrorOpen] = React.useState(false);

  useEffect(() => {
    setCurrentText(convertPathToString(path));
  }, [path]);

  /**
   * Store the current text being typed
   */
  const onTextChangeHandler = (event) => {
    setCurrentText(event.target.value);
  };

  /**
   * Triggered when the user is finished editing the path
   * and clicks done. Notifies the parent of the change
   * through a callback, passing in the new path as a parameter.
   */
  const onDoneClickHandler = () => {
    // Remove preceding or trailing slashes and spaces
    const newPath = currentText
      .trim()
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .split("/");

    // Inform the parent container of the change, if there was one and
    // given that the path is valid
    if (currentText !== convertPathToString(path)) {
      if (isValidPath(newPath)) {
        onPathChange(newPath);
      } else {
        setErrorOpen(true);
        clearChanges();
      }
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

  /**
   * This function is called when the alert close button
   * is clicked or there is a timeout.
   */
  const handleClose = (event, reason) => {
    // Should not close if the user just clicks anywhere
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
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
          // If the enter key is pressed, it is equivalent
          // to clicking on Done
          if (e.keyCode === 13) onDoneClickHandler();
        }}
      />
    </ClickAwayListener>
  );

  const EditButton = (
    <IconButton
      size="small"
      color="primary"
      onClick={() => setMode(MODES.EDIT)}
    >
      <EditRounded fontSize="small" />
    </IconButton>
  );

  const DoneButton = (
    <IconButton size="small" color="primary" onClick={onDoneClickHandler}>
      <DoneRounded />
    </IconButton>
  );

  return (
    <Box display="flex" alignItems="center">
      {/* Alert to display if the path entered is invalid */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleClose} severity="error">
          The path is invalid!
        </Alert>
      </Snackbar>

      <Box>{mode === MODES.VIEW ? BreadcrumbsView : EditPathView}</Box>
      <Box pl={1.5}>{mode === MODES.VIEW ? EditButton : DoneButton}</Box>
    </Box>
  );
};
