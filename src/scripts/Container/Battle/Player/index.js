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
    this.movingDuration = 100;
    this.attackMotionSpeed = 0.2;

    this.sprite = null;

    this.normalSprite = null;
    this.attackSprite = null;
    this.createSprite();
    this.createAttackSprite();

    this.render();
  }

  setSpriteProperty(sprite) {
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.scale.set(0.7);
    sprite.anchor.set(
      this.anchor.x,
      this.anchor.y
    );

    if (this.shouldTurnAround) {
      sprite.scale.x *= -1;
    }
  }

  createSprite() {
    this.sprite = new PIXI.Sprite(this.playerTexture.normal);
    this.setSpriteProperty(this.sprite);
  }

  createAttackSprite() {
    this.attackSprite = new PIXI.AnimatedSprite([
      this.playerTexture.attack1,
      this.playerTexture.attack2,
      this.playerTexture.attack3,
    ]);
    this.setSpriteProperty(this.attackSprite);

    this.attackSprite.animationSpeed = this.attackMotionSpeed;
    this.attackSprite.loop = false;
  }

  render() {
    this.container.addChild(this.sprite);
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

    const tween = new Tween.Tween(this.sprite);

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
      nextPosition: this.sprite.x - this.xMovingDistance,
      condition: this.xPosition - 1 >= 0,
      isBackMoving: true,
      positionIncrease: -1,
    });
  }

  moveRight() {
    this.move({
      axis: "x",
      nextPosition: this.sprite.x + this.xMovingDistance,
      condition: this.xPosition + 1 < this.xPositionRange,
      positionIncrease: 1,
    });
  }

  moveUp() {
    this.move({
      axis: "y",
      nextPosition: this.sprite.y - this.yMovingDistance,
      condition: this.yPosition - 1 >= 0,
      positionIncrease: -1,
    });
  }

  moveDown() {
    this.move({
      axis: "y",
      nextPosition: this.sprite.y + this.yMovingDistance,
      condition: this.yPosition + 1 < this.yPositionRange,
      positionIncrease: 1,
    });
  }

  attack() {
    this.attackSprite.x = this.x;
    this.attackSprite.y = this.y;

    this.container.removeChild(this.sprite);
    this.container.addChild(this.attackSprite);

    this.attackSprite.gotoAndPlay(0);
    this.attackSprite.onComplete = () => {
      this.container.removeChild(this.attackSprite);
      this.container.addChild(this.sprite);
    };
  }
}

Object.assign(Player.prototype, loadPlayerTextureMixin);
