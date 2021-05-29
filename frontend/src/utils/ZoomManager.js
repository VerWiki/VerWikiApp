import { Logger } from "./Logger";

export class ZoomManager {
  constructor(curZoom, maxDepth) {
    this.minZoom = 0;
    this.maxZoom = maxDepth;
    this.curZoom = curZoom;
  }
  zoomIn() {
    Logger.debug("ZoomManager: zooming in; current zoom is ");
    Logger.debug(this.curZoom);
    if (this.canZoomIn()) {
      this.curZoom -= 1;
      Logger.debug("ZoomManager: new zoom after zooming in is ");
      Logger.debug(this.curZoom);
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom in when zooming in was disabled");
    return this.curZoom;
  }

  zoomOut() {
    Logger.debug("ZoomManager: zooming out; current zoom is ");
    Logger.debug(this.curZoom);
    if (this.canZoomOut()) {
      this.curZoom += 1;
      Logger.debug("ZoomManager: new zoom after zooming out is ");
      Logger.debug(this.curZoom);
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom out when zooming in was disabled");
    return this.curZoom;
  }

  updateMaxZoom(newMaxZoom) {
    this.maxZoom = newMaxZoom;
    console.log("UpdateMaxZoom: Current zoom is ", this.curZoom);
    console.log("UpdateMaxZoom: Max zoom is ", this.maxZoom);
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
    console.log("canZoomOut: Current zoom is ", this.curZoom);
    console.log("canZoomOut: Max zoom is ", this.maxZoom);
    return this.curZoom < this.maxZoom;
  }
}
