import { Logger } from "./Logger";

export class ZoomManager {
  /**
   * Initializes a zoomManager; only need one in the app
   * @param {int} curZoom : current depth of the tree
   * @param {int} maxDepth  : max depth of the tree
   */
  constructor(curZoom, maxDepth) {
    this.minZoom = 0;
    this.maxZoom = maxDepth;
    this.curZoom = curZoom;
  }

  /**
   * Increases the zoom, if allowed by this.canZoomIn()
   * @returns {int} : curZoom
   */
  zoomIn() {
    if (this.canZoomIn()) {
      this.curZoom -= 1;
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom in when zooming in was disabled");
    return this.curZoom;
  }

  /**
   * Decreases the zoom, if allowed by this.canZoomOut()
   * @returns {int} : curZoom
   */
  zoomOut() {
    if (this.canZoomOut()) {
      this.curZoom += 1;
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom out when zooming out was disabled");
    return this.curZoom;
  }

  /**
   * Updates the max zoom whenever the currentRoot of the tree changes
   * @param {int} newMaxZoom : the new max zoom of the subtree
   * @returns {int} : the current zoom
   */
  updateMaxZoom(newMaxZoom) {
    this.maxZoom = newMaxZoom;
    if (this.curZoom > this.maxZoom) {
      this.curZoom = this.maxZoom;
    }
    return this.curZoom;
  }

  getCurZoom() {
    return this.curZoom;
  }

  getMaxZoom() {
    return this.maxZoom;
  }

  getMinZoom() {
    return this.minZoom;
  }

  canZoomIn() {
    return this.curZoom > this.minZoom;
  }

  canZoomOut() {
    return this.curZoom < this.maxZoom;
  }
}
