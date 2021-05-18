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
        hostPlayerBeHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = hostPlayerPortrait.texture;
      this.beHitPortraitTexture = hostPlayerBeHitPortrait.texture;
    } else {
      const {
        guestPlayerPortrait,
        guestPlayerBeHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = guestPlayerPortrait.texture;
      this.beHitPortraitTexture = guestPlayerBeHitPortrait.texture;
    }

    this.portraitSize = 250;

    this.normalPortrait = null;
    this.beHitPortrait = null;
    this.createNormalPortrait();
    this.createBeHitPortrait();

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

  createBeHitPortrait() {
    this.beHitPortrait = new PIXI.Sprite(this.beHitPortraitTexture);

    this.setSpriteProperties(this.beHitPortrait);
  }

  render() {
    if (this.isHit) {
      this.container.addChild(this.beHitPortrait);
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
