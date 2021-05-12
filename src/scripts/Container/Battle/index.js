import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import { getState } from "../../redux";

export default class Battle extends Drawer {
  constructor() {
    super();

    this.backgroundTexture = getState()
      .resources
      .battleBackground
      .texture;
    this.background = null;
    this.createBackground();
  }

  createBackground() {
    this.background = new PIXI.Sprite(this.backgroundTexture);
    this.container.addChild(this.background);
  }
}
