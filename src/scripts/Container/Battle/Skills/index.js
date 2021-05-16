import * as PIXI from "pixi.js";

export default class Skill {
  constructor({ x, y, rowIndex, isHeadingToRight = true }) {
    this.x = x;
    this.y = y;
    this.rowIndex = rowIndex;
    this.isHeadingToRight = isHeadingToRight;
    this.isTerminated = false;

    this.skillZindexOffset = 0.5;

    this.container = new PIXI.Container();
    this.container.zIndex = this.rowIndex + this.skillZindexOffset;
  }

  terminate() {
    this.isTerminated = true;
  }
}
