// A class to keep track of previously visited nodes
export class HistoryRecorder {
  constructor() {
    this.backwardHistory = [];
    this.forwardHistory = [];
  }

  /**
   * We need at least 1 items in the backwardHistory to go back
   * @returns {bool} whether going back is valid
   */
  canGoBackward() {
    return this.backwardHistory.length >= 1;
  }
  /**
   * We need at least 1 items in the forwardHistory to go forward
   * @returns {bool} whether going forward is valid
   */
  canGoForward() {
    return this.forwardHistory.length >= 1;
  }

  /**
   * Adds a historyStruct to the backward history, in the form of {
        currentRootName: <String>,
        currentlyViewingNodeName: <String>,
        currentZoom: <int>
      }
   * @param {string} currentRootName : Current root of the visible tree
   * @param {string} currentlyViewingNodeName : Node whose article is being seen in infoViewer, "" if infoViewer not open
   * @param {int} currentZoom : The current zoom level
   */
  addBackwardHistory(currentRootName, currentlyViewingNodeName, currentZoom) {
    //Check that we are not adding a duplicate entry into the history - can happen if the user left-clicked on the same node
    //again without going to another infoview article
    if (
      this.backwardHistory.length === 0 ||
      this.backwardHistory[this.backwardHistory.length - 1].currentRootName !==
        currentRootName ||
      this.backwardHistory[this.backwardHistory.length - 1]
        .currentlyViewingNodeName !== currentlyViewingNodeName ||
      this.backwardHistory[this.backwardHistory.length - 1].currentZoom !==
        currentZoom
    ) {
      this.backwardHistory.push({
        currentRootName: currentRootName,
        currentlyViewingNodeName: currentlyViewingNodeName,
        currentZoom: currentZoom,
      });
    }
    this.forwardHistory = [];
  }

  /**
   * Pops and returns the previous historyStruct; adds the currently
   * root node and the currently viewing node to the forward history (in the form of a historyStruct)
   * so that the forward history works.
   * @param {String} currentRootName: The name of the currently visible root
   * @param {String} currentlyViewingNodeName : Node whose article is being seen in infoViewer, "" if infoViewer not open
   * @param {int} currentZoom : The current zoom level
   * @returns {struct} in the form of {
        currentRootName: <String>,
        currentlyViewingNodeName: <String>,
        currentZoom: <int>
      }
   */
  goBackward(currentRootName, currentlyViewingNodeName, currentZoom) {
    if (!this.canGoBackward()) return "";
    // Pop the last node from the current path and add
    // it to the forwardHistory
    const historyStruct = this.backwardHistory.pop();
    this.forwardHistory.push({
      currentRootName: currentRootName,
      currentlyViewingNodeName: currentlyViewingNodeName,
      currentZoom: currentZoom,
    });
    return historyStruct;
  }

  /**
   * Pops and returns the forward visited node and article being viewed in the infoViewer; adds the currently
   * root node to the backward history so that the backward history works.
   * @param {String} currentRootName The name of the currently visible root
   * @param {string} currentlyViewingNodeName : Node whose article is being seen in infoViewer, "" if infoViewer not open
   * @param {int} currentZoom : The current zoom level
   * @returns {struct} in the form of {
        currentRootName: <String>,
        currentlyViewingNodeName: <String>,
        currentZoom: <int>,
      }
   */
  goForward(currentRootName, currentlyViewingNodeName, currentZoom) {
    if (!this.canGoForward()) return "";
    this.backwardHistory.push({
      currentRootName: currentRootName,
      currentlyViewingNodeName: currentlyViewingNodeName,
      currentZoom: currentZoom,
    });
    const historyStruct = this.forwardHistory.pop();
    return historyStruct;
  }
}
