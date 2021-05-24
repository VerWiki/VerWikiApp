import React, { useState, useEffect } from "react";
import styles from "./NodePathHistory.module.css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import TextField from "@material-ui/core/TextField";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import NavigateNext from "@material-ui/icons/NavigateNext";
import EditRounded from "@material-ui/icons/EditRounded";
import DoneRounded from "@material-ui/icons/DoneRounded";
import { NPHConf } from "../../utils/config";
import { convertPathToString, convertStringToPath } from "../../utils/utils";

export const NodePathHistory = ({
  path,
  onNodeNameClick,
  onPathChange,
  validatePath,
}) => {
  const [mode, setMode] = useState(NPHConf.MODE_VIEW);
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
    const pathAsList = convertStringToPath(currentText);
    const [isValid, pathChanged] = validatePath(pathAsList);
    setIsCurrentTextValid(isValid);

    // isValidPath can change the list if any words are not correct
    // in their casing. If this happens, we need to update currentText.
    if (isValid && pathChanged) {
      setCurrentText(convertPathToString(pathAsList));
    }
  }, [currentText, validatePath]);

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
    setMode(NPHConf.MODE_VIEW);
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
      classes={{
        root: `${styles.breadcrumbContainer} scrollbar`,
        ol: styles.breadcrumbOl,
      }}
      maxItems={NPHConf.MAX_ITEMS}
      itemsAfterCollapse={NPHConf.ITEMS_AFTER_COLLAPSE}
      itemsBeforeCollapse={NPHConf.ITEMS_BEFORE_COLLAPSE}
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
      color="#2d94ed"
      variant="outlined"
      size="large"
      onClick={() => setMode(NPHConf.MODE_EDIT)}
    >
      <EditRounded fontSize="small" />
    </Button>
  );

  const DoneButton = (
    <Button
      color="#2d94ed"
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
      <Box>{mode === NPHConf.MODE_VIEW ? BreadcrumbsView : EditPathView}</Box>
      <Box pl={1.5}>{mode === NPHConf.MODE_VIEW ? EditButton : DoneButton}</Box>
    </Box>
  );
};
