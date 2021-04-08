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
   * @param {Node} nodeName : Node to add to the backward history
   */
  addBackwardHistory(nodeName) {
    if (
      this.backwardHistory.length === 0 ||
      this.backwardHistory[this.backwardHistory.length - 1] !== nodeName
    ) {
      this.backwardHistory.push(nodeName);
    }
    this.forwardHistory = [];
  }

  /**
   * Pops and returns the previously visited node; adds the currently
   * root node to the forward history so that the forward history works.
   * @param {String} currentRootName: The name of the currently visible root
   * @returns {String} previously visited node name
   */
  goBackward(currentRootName) {
    if (!this.canGoBackward()) return "";
    // Pop the last node from the current path and add
    // it to the forwardHistory
    const previouslyVisitedNodeName = this.backwardHistory.pop();
    this.forwardHistory.push(currentRootName);
    return previouslyVisitedNodeName;
  }

  /**
   * Pops and returns the forward visited node; adds the currently
   * root node to the backward history so that the backward history works.
   * @param {String} currentRootName The name of the currently visible root
   * @returns {String} the name of the next node in the forward history
   */
  goForward(currentRootName) {
    if (!this.canGoForward()) return "";
    if (
      this.backwardHistory.length === 0 ||
      this.backwardHistory[this.backwardHistory.length - 1] !== currentRootName
    ) {
      this.backwardHistory.push(currentRootName);
    }
    const forwardNodeName = this.forwardHistory.pop();
    return forwardNodeName;
  }
}
