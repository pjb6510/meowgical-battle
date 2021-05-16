import * as PIXI from "pixi.js";
import Tween from "@tweenjs/tween.js";
import Skill from "../";
import globalStore from "../../../../globalStore";
import { canvasSize } from "../../../../config";

export default class Fireball extends Skill {
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
    this.hasCollided = false;

    this.sprite = null;
    this.createSprite();

    this.render();
  }

  createSprite() {
    this.sprite = new PIXI.AnimatedSprite(
      this.fireballTextures
    );

    if (!this.isHeadingToRight) {
      this.sprite.scale *= 1;
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.anchor.set(
      this.anchor.x,
      this.anchor.y
    );

    this.sprite.animationSpeed = 0.4;
    this.sprite.play();
    this.move();
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
        { x: this.x - this.sprite.width },
        this.movingDuration
      );
    }

    tween.onComplete(() => {
      this.terminate();
    });

    tween.start();
  }

  render() {
    this.container.addChild(this.sprite);
  }
}
