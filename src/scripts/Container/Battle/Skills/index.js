import * as PIXI from "pixi.js";

export default class Skill {
  constructor({
    x,
    y,
    rowIndex,
    isHeadingToRight = true,
    startCallback,
    terminationCallback,
  }) {
    this.x = x;
    this.y = y;
    this.rowIndex = rowIndex;
    this.isHeadingToRight = isHeadingToRight;
    this.startCallback = startCallback;
    this.terminationCallback = terminationCallback;

    this.isTerminated = false;
    this.isAbleHit = true;
    this.damage = 0;

    this.handleHit = null;

    this.skillZindexOffset = 0.5;

    this.container = new PIXI.Container();
    this.container.zIndex = this.rowIndex + this.skillZindexOffset;

    if (this.startCallback) {
      this.startCallback(this);
    }
  }

  terminate() {
    this.isTerminated = true;

    this.terminationCallback(this);
  }
}
