import { Logger } from "./Logger";

export class ZoomManager {
  constructor(curZoom, maxDepth) {
    this.minZoom = 1;
    this.maxZoom = maxDepth;
    this.curZoom = curZoom;
  }

  canZoomOut() {
    return this.curZoom >= this.minZoom;
  }

  canZoomIn() {
    return this.curZoom <= this.maxZoom;
  }

  zoomIn() {
    if (this.canZoomIn()) {
      this.curZoom += 1;
      return this.curZoom;
    }
    Logger.warn("ZoomManager: Tried to zoom in when zooming in was disabled");
    return this.curZoom;
  }

  zoomOut() {
    if (this.canZoomOut()) {
      this.curZoom -= 1;
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
}

function calculateMaxDepth(root) {
  //console.log("The root is: ", root);
  if (root == null || root === undefined) {
    return 0;
  }
  let maxDepth = 0;
  if (root.children == null || root.children === undefined) {
    return 1;
  }
  root.children.forEach((child) => {
    const depth = calculateMaxDepth(child);
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  });
  return 1 + maxDepth;
}
