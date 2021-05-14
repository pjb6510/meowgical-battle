import * as PIXI from "pixi.js";
import globalStore from "../../../globalStore";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export default class Portrait {
  constructor({ x, y, isLeftPlayer }) {
    this.x = x;
    this.y = y;
    this.isLeftPlayer = isLeftPlayer;

    this.container = new PIXI.Container();

    if (this.isLeftPlayer) {
      const {
        leftPlayerPortrait,
        leftPlayerHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = leftPlayerPortrait.texture;
      this.hitPortraitTexture = leftPlayerHitPortrait.texture;
    } else {
      const {
        rightPlayerPortrait,
        rightPlayerHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = rightPlayerPortrait.texture;
      this.hitPortraitTexture = rightPlayerHitPortrait.texture;
    }

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
