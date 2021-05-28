import { Logger } from "./Logger";

export class ZoomManager {
  constructor(curZoom, maxDepth) {
    this.minZoom = 1;
    this.maxZoom = maxDepth;
    this.curZoom = curZoom;
  }
  zoomIn() {
    if (this.canZoomIn()) {
      this.curZoom -= 1;
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom in when zooming in was disabled");
    return this.curZoom;
  }

  zoomOut() {
    if (this.canZoomOut()) {
      this.curZoom += 1;
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom out when zooming in was disabled");
    return this.curZoom;
  }

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
    return this.curZoom >= this.minZoom;
  }

  canZoomOut() {
    return this.curZoom <= this.maxZoom;
  }
}
