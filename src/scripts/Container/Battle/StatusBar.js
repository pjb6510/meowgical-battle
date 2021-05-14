import * as PIXI from "pixi.js";
import HpBar from "./HpBar";
import Portrait from "./Portrait";

export default class StatusBar {
  constructor({ x, y, isLeftCharacter }) {
    this.x = x;
    this.y = y;
    this.isLeftCharacter = isLeftCharacter;

    this.portraitHpBarDistance = 150;

    this.portraitXOffset = -(this.portraitHpBarDistance) - 50;
    this.portraitYOffset = 0;
    this.portraitOption = {
      x: this.x + this.portraitXOffset,
      y: this.y + this.portraitYOffset,
      isLeftCharacter: this.isLeftCharacter,
    };

    this.hpBarXOffset = this.portraitHpBarDistance - 50;
    this.hpBarYOffset = 0;
    this.hpBarOption = {
      x: this.x + this.hpBarXOffset,
      y: this.y + this.hpBarYOffset,
    };

    this.container = new PIXI.Container();

    this.hpBar = null;
    this.portrait = null;
    this.createHpBar();
    this.createPortrait();

    this.render();
  }

  createHpBar() {
    this.hpBar = new HpBar(this.hpBarOption);
  }

  createPortrait() {
    this.portrait = new Portrait(
      this.portraitOption
    );
  }

  render() {
    this.container.addChild(
      this.portrait.container,
      this.hpBar.container
    );
  }
}
