import * as PIXI from "pixi.js";
import { getState } from "../../redux";

export default class Battle {
  constructor() {
    this.container = new PIXI.Container();
    this.backgroundTexture = getState()
      .resources
      .battleBackground
      .texture;

    this.createBackground();
  }

  createBackground() {
    const background = new PIXI.Sprite(this.backgroundTexture);
    this.container.addChild(background);
  }
}
