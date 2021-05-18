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
      this.beHitSpriteTexture = hostPlayerBeHitPortrait.texture;
    } else {
      const {
        guestPlayerPortrait,
        guestPlayerBeHitPortrait,
      } = globalStore.getItem("resources");

      this.portraitTexture = guestPlayerPortrait.texture;
      this.beHitSpriteTexture = guestPlayerBeHitPortrait.texture;
    }

    this.portraitSize = 250;

    this.normalSprite = null;
    this.beHitSprite = null;
    this.createNormalPortrait();
    this.createBeHitPortrait();

    this.beHitDuration = 400;

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
    this.normalSprite = new PIXI.Sprite(this.portraitTexture);

    this.setSpriteProperties(this.normalSprite);
  }

  createBeHitPortrait() {
    this.beHitSprite = new PIXI.Sprite(this.beHitSpriteTexture);

    this.setSpriteProperties(this.beHitSprite);
  }

  render() {
    this.container.addChild(this.normalSprite);
  }

  beHit() {
    this.container.removeChildren();
    this.container.addChild(this.beHitSprite);

    clearTimeout(this.beHitTimerId);

    this.beHitTimerId = setTimeout(() => {
      this.container.removeChildren();
      this.container.addChild(this.normalSprite);
    }, this.beHitDuration);
  }
}
