export class HistoryRecorder {
  constructor(onChange) {
    this.backwardHistory = [];
    this.forwardHistory = [];

    // Called every time the history changes and passes the current path
    // as a parameter
    this.onChange = onChange;
  }

  /**
   * We need at least 2 items in the path to go back
   * If there is only 1, it would be the root, and
   * we can't go back any further.
   */
  canGoBackward() {
    return this.backwardHistory.length >= 2;
  }

  canGoForward() {
    return this.forwardHistory.length > 0;
  }

  resetPath(path) {
    this.backwardHistory = [...path];
    this.forwardHistory = [];
    this.onChange([...this.backwardHistory]);
  }

  addBackwardHistory(nodeName) {
    console.log("This dot backward history before is ", this.backwardHistory);
    if (
      this.backwardHistory.length === 0 ||
      this.backwardHistory[this.backwardHistory.length - 1] !== nodeName
    ) {
      this.backwardHistory.push(nodeName);
    }
    console.log("This dot backward history after is ", this.backwardHistory);
    this.forwardHistory = [];
  }

  /**
   * If nodeName is passed as a parameter, go back up to that node.
   */
  goBackward(nodeName = null) {
    if (!this.canGoBackward()) return;

    do {
      // Pop the last node from the current path and add
      // it to the forwardHistory
      this.forwardHistory.push(this.backwardHistory.pop());
    } while (
      // Go back more than once only if they passed this argument to the function
      nodeName !== null &&
      this.canGoBackward() &&
      this.backwardHistory[this.backwardHistory.length - 1] !== nodeName
    );

    this.onChange([...this.backwardHistory]);
  }

  goForward() {
    if (!this.canGoForward()) return;
    this.backwardHistory.push(this.forwardHistory.pop());
    this.onChange([...this.backwardHistory]);
  }
}
