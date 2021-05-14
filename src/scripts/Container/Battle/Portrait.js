import * as PIXI from "pixi.js";
import globalStore from "../../globalStore";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export default class Portrait {
  constructor({ x, y, isLeftCharacter }) {
    this.x = x;
    this.y = y;
    this.isLeftCharacter = isLeftCharacter;

    this.container = new PIXI.Container();

    const {
      leftPlayerPortrait,
      leftPlayerHitPortrait,
      rightPlayerPortrait,
      rightPlayerHitPortrait,
    } = globalStore.getItem("resources");

    this.leftPlayerPortraitTexture = leftPlayerPortrait.texture;
    this.leftPlayerHitPortraitTexture = leftPlayerHitPortrait.texture;
    this.rightPlayerPortraitTexture = rightPlayerPortrait.texture;
    this.rightPlayerHitPortraitTexture = rightPlayerHitPortrait.texture;

    this.portraitTexture = this.isLeftCharacter
      ? this.leftPlayerPortraitTexture
      : this.rightPlayerPortraitTexture;
    this.hitPortraitTexture = this.isLeftCharacter
      ? this.leftPlayerHitPortraitTexture
      : this.rightPlayerHitPortraitTexture;

    this.portraitSize = 250;
    this.isHit = false;

    this.normalPortrait = null;
    this.hitPortrait = null;
    this.createNormalPortrait();
    this.createHitPortrait();

    this.render();
  }

  createNormalPortrait() {
    this.normalPortrait = new PIXI.Sprite(this.portraitTexture);
    this.normalPortrait.x = this.x;
    this.normalPortrait.y = this.y;
    this.normalPortrait.width = this.portraitSize;
    this.normalPortrait.height = this.portraitSize;
    this.normalPortrait.anchor.set(0.5, 0.5);
    this.normalPortrait.filters = [new DropShadowFilter()];
  }

  createHitPortrait() {
    this.hitPortrait = new PIXI.Sprite(this.hitPortraitTexture);
    this.hitPortrait.x = this.x;
    this.hitPortrait.y = this.y;
    this.hitPortrait.width = this.portraitSize;
    this.hitPortrait.height = this.portraitSize;
    this.hitPortrait.anchor.set(0.5, 0.5);
    this.hitPortrait.filters = [new DropShadowFilter()];
  }

  render() {
    if (this.isHit) {
      this.container.addChild(this.hitPortrait);
    } else {
      this.container.addChild(this.normalPortrait);
    }
  }

  renewIsHit(isHit) {
    this.isHit = isHit;
    this.container.removeChildren();
    this.render();
  }
}
