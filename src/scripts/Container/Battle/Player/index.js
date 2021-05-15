import * as PIXI from "pixi.js";
import Tween from "@tweenjs/tween.js";
import loadPlayerTextureMixin from "./loadPlayerTextureMixin";

export default class Player {
  constructor({
    x,
    y,
    isHost,
    shouldTurnAround,
    xPositionRange,
    yPositionRange,
    xMovingDistance,
    yMovingDistance,
  }) {
    this.x = x;
    this.y = y;
    this.isHost = isHost;
    this.shouldTurnAround = shouldTurnAround;
    this.xPositionRange = xPositionRange;
    this.yPositionRange = yPositionRange;
    this.xMovingDistance = xMovingDistance;
    this.yMovingDistance = yMovingDistance;

    this.playerTexture = null;
    this.loadPlayerTexture();

    this.container = new PIXI.Container();

    this.xPosition = 0;
    this.yPosition = 0;
    this.anchor = {
      x: 0.5,
      y: 0.85,
    };
    this.scale = 0.7;
    this.movingDuration = 100;
    this.attackMotionSpeed = 0.2;

    this.normalSprite = null;
    this.attackMotionSprite = null;
    this.createNormalSprite();
    this.createAttackMotionSprite();

    this.render();
  }

  setSpriteProperties(sprite) {
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.scale.set(this.scale);
    sprite.anchor.set(
      this.anchor.x,
      this.anchor.y
    );

    if (this.shouldTurnAround) {
      sprite.scale.x *= -1;
    }
  }

  createNormalSprite() {
    this.normalSprite = new PIXI.Sprite(this.playerTexture.normal);
    this.setSpriteProperties(this.normalSprite);
  }

  createAttackMotionSprite() {
    this.attackMotionSprite = new PIXI.AnimatedSprite([
      this.playerTexture.attack1,
      this.playerTexture.attack2,
      this.playerTexture.attack3,
    ]);
    this.setSpriteProperties(this.attackMotionSprite);

    this.attackMotionSprite.animationSpeed = this.attackMotionSpeed;
    this.attackMotionSprite.loop = false;
  }

  render() {
    this.container.addChild(this.normalSprite);
  }

  move({
    axis,
    nextPosition,
    condition,
    isBackMoving = false,
    positionIncrease,
  }) {
    if (!condition) {
      return;
    }

    const tween = new Tween.Tween(this.normalSprite);

    tween.to(
      { [axis]: nextPosition },
      this.movingDuration
    );
    tween.onStart((player) => {
      if (isBackMoving) {
        player.texture = this.playerTexture.moveBack;
      } else {
        player.texture = this.playerTexture.moveFront;
      }
    });
    tween.onComplete((player) => {
      player.texture = this.playerTexture.normal;
    });
    tween.start();

    this[axis] = nextPosition;

    if (axis === "x") {
      this.xPosition += positionIncrease;
    } else {
      this.yPosition += positionIncrease;
    }
  }

  moveLeft() {
    this.move({
      axis: "x",
      nextPosition: this.normalSprite.x - this.xMovingDistance,
      condition: this.xPosition - 1 >= 0,
      isBackMoving: true,
      positionIncrease: -1,
    });
  }

  moveRight() {
    this.move({
      axis: "x",
      nextPosition: this.normalSprite.x + this.xMovingDistance,
      condition: this.xPosition + 1 < this.xPositionRange,
      positionIncrease: 1,
    });
  }

  moveUp() {
    this.move({
      axis: "y",
      nextPosition: this.normalSprite.y - this.yMovingDistance,
      condition: this.yPosition - 1 >= 0,
      positionIncrease: -1,
    });
  }

  moveDown() {
    this.move({
      axis: "y",
      nextPosition: this.normalSprite.y + this.yMovingDistance,
      condition: this.yPosition + 1 < this.yPositionRange,
      positionIncrease: 1,
    });
  }

  attack() {
    this.attackMotionSprite.x = this.x;
    this.attackMotionSprite.y = this.y;

    this.container.removeChild(this.normalSprite);
    this.container.addChild(this.attackMotionSprite);

    this.attackMotionSprite.gotoAndPlay(0);
    this.attackMotionSprite.onComplete = () => {
      this.container.removeChild(this.attackMotionSprite);
      this.container.addChild(this.normalSprite);
    };
  }
}

Object.assign(Player.prototype, loadPlayerTextureMixin);
