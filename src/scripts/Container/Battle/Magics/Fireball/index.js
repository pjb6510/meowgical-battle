import * as PIXI from "pixi.js";
import Tween from "@tweenjs/tween.js";
import Magic from "..";
import globalStore from "../../../../globalStore";
import { canvasSize } from "../../../../config";

export default class Fireball extends Magic {
  constructor(option) {
    super(option);

    const {
      fireball,
      fireballExplosion1,
      fireballExplosion2,
      fireballExplosion3,
    } = globalStore.getItem("resources");

    this.fireballTextures = Object.values(
      fireball.textures
    );
    this.explosionFireballTextures = [
      ...Object.values(fireballExplosion1.textures),
      ...Object.values(fireballExplosion2.textures),
      ...Object.values(fireballExplosion3.textures),
    ];

    this.movingDuration = 1000;
    this.anchor = {
      x: 0.5,
      y: 0.85,
    };
    this.animationSpeed = 0.4;

    this.xHitAreaOffset = 90;
    this.xHitAreaWidth = 70;
    this.xHitAreaRange = null;
    this.updateHitAreaRange();

    this.sprite = null;
    this.createSprite();
    this.createExplosionSprite();

    this.handleHit = this.explode;

    this.damage = 15;
  }

  createSprite() {
    this.sprite = new PIXI.AnimatedSprite(
      this.fireballTextures
    );

    this.setSpriteProperties(this.sprite);
  }

  createExplosionSprite() {
    this.explosionSprite = new PIXI.AnimatedSprite(
      this.explosionFireballTextures
    );

    this.setSpriteProperties(this.explosionSprite);
    this.explosionSprite.loop = false;
  }

  move() {
    const tween = new Tween.Tween(this.sprite);

    if (this.isHeadingToRight) {
      tween.to(
        { x: this.x + canvasSize.width + this.sprite.width },
        this.movingDuration
      );
    } else {
      tween.to(
        { x: 0 - (canvasSize.width - this.x) - this.sprite.width },
        this.movingDuration
      );
    }

    tween
      .onUpdate((sprite) => {
        this.x = sprite.x;
        this.y = sprite.y;
        this.updateHitAreaRange();
      })
      .onComplete(() => {
        this.terminate();
      });

    tween.start();
  }

  updateHitAreaRange() {
    if (this.isHeadingToRight) {
      this.xHitAreaRange = {
        min: this.x + this.xHitAreaOffset,
        max: this.x + this.xHitAreaOffset + this.xHitAreaWidth,
      };
    } else {
      this.xHitAreaRange = {
        min: this.x - this.xHitAreaOffset - this.xHitAreaWidth,
        max: this.x - this.xHitAreaOffset,
      };
    }
  }

  checkIsHit({ rowIndex: objectRowIndex, xHitAreaRange: objectXHitArea }) {
    const objectWidth = objectXHitArea.max - objectXHitArea.min;

    const isSameRowIndex = objectRowIndex === this.rowIndex;
    if (!isSameRowIndex) {
      return false;
    }

    let isXOverlap = false;
    if (this.xHitAreaWidth <= objectWidth) {
      const ifObjectIsInLeft =
        (this.xHitAreaRange.min <= objectXHitArea.max) &&
          (this.xHitAreaRange.min >= objectXHitArea.min);
      const ifObjectIsInRight =
        (this.xHitAreaRange.max >= objectXHitArea.min) &&
          (this.xHitAreaRange.max <= objectXHitArea.max);
      isXOverlap = ifObjectIsInLeft || ifObjectIsInRight;
    } else {
      const ifObjectIsInLeft =
        (objectXHitArea.max >= this.xHitAreaRange.min) &&
          (objectXHitArea.max <= this.xHitAreaRange.max);
      const ifObjectIsInRight =
        (objectXHitArea.min <= this.xHitAreaRange.max) &&
          (objectXHitArea.min >= this.xHitAreaRange.min);
      isXOverlap = ifObjectIsInLeft || ifObjectIsInRight;
    }

    const isHit = isXOverlap && isSameRowIndex;

    this.isAbleToHit = !(isHit);

    return isHit;
  }

  explode() {
    this.explosionSprite.x = this.x;
    this.explosionSprite.y = this.y;

    this.container.removeChild(this.sprite);
    this.container.addChild(this.explosionSprite);

    this.explosionSprite.play();
    this.explosionSprite.onComplete = () => {
      this.terminate();
    };
  }

  start() {
    if (this.startCallback) {
      this.startCallback(this);
    }

    this.container.addChild(this.sprite);
    this.sprite.play();
    this.move();
  }
}
