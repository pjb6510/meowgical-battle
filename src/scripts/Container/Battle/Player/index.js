import * as PIXI from "pixi.js";
import Tween from "@tweenjs/tween.js";
import globalStore from "../../../globalStore";

export default class Player {
  constructor({
    x,
    y,
    isHost,
    isHeadingToRight,
    columnIndex,
    rowIndex,
    columnRange,
    rowRange,
    xMovingDistance,
    yMovingDistance,
  }) {
    this.x = x;
    this.y = y;
    this.isHost = isHost;
    this.isHeadingToRight = isHeadingToRight;
    this.columnIndex = columnIndex;
    this.rowIndex = rowIndex;
    this.columnRange = columnRange;
    this.rowRange = rowRange;
    this.xMovingDistance = xMovingDistance;
    this.yMovingDistance = yMovingDistance;

    this.playerTextures = null;
    this.loadPlayerTexture();

    this.container = new PIXI.Container();

    this.anchor = {
      x: 0.5,
      y: 0.85,
    };
    this.scale = 0.7;
    this.movingDuration = 100;
    this.attackMotionSpeed = 0.2;

    this.xHitAreaBackWidth = 50;
    this.xHitAreaFrontWidth = 60;
    this.xHitAreaRange = null;
    this.updateHitAreaRange();

    this.normalSprite = null;
    this.attackMotionSprite = null;
    this.beHitMotionSprite = null;
    this.createNormalSprite();
    this.createAttackMotionSprite();
    this.createBeHitMotionSprite();

    this.render();
  }

  loadPlayerTexture() {
    if (this.isHost) {
      const {
        hostPlayer,
        hostPlayerMoveFront,
        hostPlayerMoveBack,
        hostPlayerAttackMotion,
        hostPlayerBeHitMotion,
      } = globalStore.getItem("resources");

      this.playerTextures = {
        normal: hostPlayer.texture,
        moveFront: hostPlayerMoveFront.texture,
        moveBack: hostPlayerMoveBack.texture,
        attackMotion: Object.values(hostPlayerAttackMotion.textures),
        beHitMotion: Object.values(hostPlayerBeHitMotion.textures),
      };
    } else {
      const {
        guestPlayer,
        guestPlayerMoveFront,
        guestPlayerMoveBack,
        guestPlayerAttackMotion,
        guestPlayerBeHitMotion,
      } = globalStore.getItem("resources");

      this.playerTextures = {
        normal: guestPlayer.texture,
        moveFront: guestPlayerMoveFront.texture,
        moveBack: guestPlayerMoveBack.texture,
        attackMotion: Object.values(guestPlayerAttackMotion.textures),
        beHitMotion: Object.values(guestPlayerBeHitMotion.textures),
      };
    }
  }

  setSpriteProperties(sprite) {
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.scale.set(this.scale);
    sprite.anchor.set(
      this.anchor.x,
      this.anchor.y
    );

    if (!this.isHeadingToRight) {
      sprite.scale.x *= -1;
    }
  }

  createNormalSprite() {
    this.normalSprite = new PIXI.Sprite(this.playerTextures.normal);
    this.setSpriteProperties(this.normalSprite);
  }

  createAttackMotionSprite() {
    this.attackMotionSprite = new PIXI.AnimatedSprite(
      this.playerTextures.attackMotion
    );
    this.setSpriteProperties(this.attackMotionSprite);

    this.attackMotionSprite.animationSpeed = this.attackMotionSpeed;
    this.attackMotionSprite.loop = false;
  }

  createBeHitMotionSprite() {
    this.beHitMotionSprite = new PIXI.AnimatedSprite(
      this.playerTextures.beHitMotion
    );
    this.setSpriteProperties(this.beHitMotionSprite);

    this.beHitMotionSprite.animationSpeed = this.attackMotionSpeed;
    this.beHitMotionSprite.loop = false;
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

    tween
      .to(
        { [axis]: nextPosition },
        this.movingDuration
      )
      .onStart((player) => {
        if (isBackMoving) {
          player.texture = this.playerTextures.moveBack;
        } else {
          player.texture = this.playerTextures.moveFront;
        }
      })
      .onUpdate((player) => {
        this.x = player.x;
        this.y = player.y;
        this.updateHitAreaRange();
      })
      .onComplete((player) => {
        player.texture = this.playerTextures.normal;
      })
      .start();

    this[axis] = nextPosition;

    if (axis === "x") {
      this.columnIndex += positionIncrease;
    } else {
      this.rowIndex += positionIncrease;
    }

    this.container.zIndex = this.rowIndex;
  }

  moveLeft() {
    this.move({
      axis: "x",
      nextPosition: this.normalSprite.x - this.xMovingDistance,
      condition: this.columnIndex - 1 >= 0,
      isBackMoving: this.isHeadingToRight,
      positionIncrease: -1,
    });
  }

  moveRight() {
    this.move({
      axis: "x",
      nextPosition: this.normalSprite.x + this.xMovingDistance,
      condition: this.columnIndex + 1 < this.columnRange,
      isBackMoving: !this.isHeadingToRight,
      positionIncrease: 1,
    });
  }

  moveUp() {
    this.move({
      axis: "y",
      nextPosition: this.normalSprite.y - this.yMovingDistance,
      condition: this.rowIndex - 1 >= 0,
      positionIncrease: -1,
    });
  }

  moveDown() {
    this.move({
      axis: "y",
      nextPosition: this.normalSprite.y + this.yMovingDistance,
      condition: this.rowIndex + 1 < this.rowRange,
      positionIncrease: 1,
    });
  }

  updateHitAreaRange() {
    if (this.isHeadingToRight) {
      this.xHitAreaRange = {
        min: this.x - this.xHitAreaBackWidth,
        max: this.x + this.xHitAreaFrontWidth,
      };
    } else {
      this.xHitAreaRange = {
        min: this.x - this.xHitAreaFrontWidth,
        max: this.x + this.xHitAreaBackWidth,
      };
    }
  }

  playMotion(motionSprite) {
    motionSprite.x = this.x;
    motionSprite.y = this.y;

    this.container.removeChild(this.normalSprite);
    this.container.addChild(motionSprite);

    motionSprite.gotoAndPlay(0);
    motionSprite.onComplete = () => {
      this.container.removeChild(motionSprite);
      this.container.addChild(this.normalSprite);
    };
  }

  playAttackMotion() {
    this.playMotion(this.attackMotionSprite);
  }

  playBeHitMotion() {
    this.playMotion(this.beHitMotionSprite);
  }
}
