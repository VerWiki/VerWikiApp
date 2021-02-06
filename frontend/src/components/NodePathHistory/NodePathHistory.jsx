import React, { useState, useEffect } from "react";
// import styles from "./NodePathHistory.module.css";
import {
  Box,
  Button,
  IconButton,
  Breadcrumbs,
  TextField,
  ClickAwayListener,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { NavigateNext, EditRounded, DoneRounded } from "@material-ui/icons";

const MODES = { VIEW: 0, EDIT: 1 };

/**
 * Join the list of node names into one string
 */
function convertPathToString(path) {
  return path.join("/");
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
    <Button key={index} onClick={(e) => onNodeNameClick(e, name)}>
      <Box>{name}</Box>
    </Button>
  ));

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

  const EditPathView = (
    <ClickAwayListener onClickAway={clearChanges}>
      <TextField
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
        fullWidth
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
