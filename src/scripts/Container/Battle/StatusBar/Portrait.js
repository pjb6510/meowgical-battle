import * as PIXI from "pixi.js";
import globalStore from "../../../globalStore";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

export default class Portrait {
  constructor({ x, y, isHost }) {
    this.x = x;
    this.y = y;
    this.isHost = isHost;

    this.container = new PIXI.Container();

    if (this.isHost) {
      const {
        hostPlayerPortrait,
        hostPlayerHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = hostPlayerPortrait.texture;
      this.hitPortraitTexture = hostPlayerHitPortrait.texture;
    } else {
      const {
        guestPlayerPortrait,
        guestPlayerHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = guestPlayerPortrait.texture;
      this.hitPortraitTexture = guestPlayerHitPortrait.texture;
    }

    this.portraitSize = 250;
    this.isHit = false;

    this.normalPortrait = null;
    this.hitPortrait = null;
    this.createNormalPortrait();
    this.createHitPortrait();

    this.render();
  }

  setSpriteProperties(sprite) {
    sprite.x = this.x;
    sprite.y = this.y;
    sprite.width = this.portraitSize;
    sprite.height = this.portraitSize;
    sprite.anchor.set(0.5, 0.5);
    sprite.filters = [new DropShadowFilter()];
  }

  createNormalPortrait() {
    this.normalPortrait = new PIXI.Sprite(this.portraitTexture);

    this.setSpriteProperties(this.normalPortrait);
  }

  createHitPortrait() {
    this.hitPortrait = new PIXI.Sprite(this.hitPortraitTexture);

    this.setSpriteProperties(this.hitPortrait);
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
