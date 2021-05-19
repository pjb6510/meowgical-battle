import * as PIXI from "pixi.js";

export default class Skill {
  constructor({
    x,
    y,
    rowIndex,
    xOffset,
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

    this.xOffset = xOffset;
    if (!isHeadingToRight) {
      this.xOffset = -(this.xOffset);
    }

    this.isTerminated = false;
    this.isAbleToHit = true;
    this.damage = 0;
    this.anchor = null;
    this.animationSpeed = 0.4;

    this.handleHit = null;

    this.skillZindexOffset = 0.5;

    this.container = new PIXI.Container();
    this.container.zIndex = this.rowIndex + this.skillZindexOffset;
  }

  setSpriteProperties(sprite) {
    if (!this.isHeadingToRight) {
      sprite.scale.x *= -1;
    }

    sprite.x = this.x;
    sprite.y = this.y;
    sprite.anchor.set(
      this.anchor.x,
      this.anchor.y
    );

    sprite.animationSpeed = this.animationSpeed;
  }

  terminate() {
    this.isTerminated = true;

    this.terminationCallback(this);
  }
}
