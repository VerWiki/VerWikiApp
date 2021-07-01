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
   * Adds a node to the backward history
   * @param {string} currentRootName : Current root of the visible tree
   * @param {string} currentlyViewingNodeName : Node whose article is being seen in infoViewer, "" if infoViewer not open
   */
  addBackwardHistory(currentRootName, currentlyViewingNodeName) {
    if (
      this.backwardHistory.length === 0 ||
      this.backwardHistory[this.backwardHistory.length - 1].currentRootName !==
        currentRootName ||
      this.backwardHistory[this.backwardHistory.length - 1]
        .currentlyViewingNodeName !== currentlyViewingNodeName
    ) {
      this.backwardHistory.push({
        currentRootName: currentRootName,
        currentlyViewingNodeName: currentlyViewingNodeName,
      });
    }
    this.forwardHistory = [];
  }

  /**
   * Pops and returns the previously visited node; adds the currently
   * root node to the forward history so that the forward history works.
   * @param {String} currentRootName: The name of the currently visible root
   * @param {string} currentlyViewingNodeName : Node whose article is being seen in infoViewer, "" if infoViewer not open
   * @returns {String} previously visited node name
   */
  goBackward(currentRootName, currentlyViewingNodeName) {
    if (!this.canGoBackward()) return "";
    // Pop the last node from the current path and add
    // it to the forwardHistory
    const historyStruct = this.backwardHistory.pop();
    this.forwardHistory.push({
      currentRootName: currentRootName,
      currentlyViewingNodeName: currentlyViewingNodeName,
    });
    return historyStruct;
  }

  /**
   * Pops and returns the forward visited node; adds the currently
   * root node to the backward history so that the backward history works.
   * @param {String} currentRootName The name of the currently visible root
   * @param {string} currentlyViewingNodeName : Node whose article is being seen in infoViewer, "" if infoViewer not open
   * @returns {String} the name of the next node in the forward history
   */
  goForward(currentRootName, currentlyViewingNodeName) {
    if (!this.canGoForward()) return "";
    if (this.backwardHistory.length === 0 || true) {
      this.backwardHistory.push({
        currentRootName: currentRootName,
        currentlyViewingNodeName: currentlyViewingNodeName,
      });
    }
    const historyStruct = this.forwardHistory.pop();
    return historyStruct;
  }
}
