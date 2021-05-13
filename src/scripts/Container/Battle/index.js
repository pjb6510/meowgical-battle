import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import globalStore from "../../globalStore";

export default class Battle extends Drawer {
  constructor() {
    super();

    this.backgroundTexture = globalStore
      .getItem("resources")
      .battleBackground
      .texture;
    this.background = null;
    this.createBackground();

    this.render();
  }

  createBackground() {
    this.background = new PIXI.Sprite(this.backgroundTexture);
  }

  render() {
    this.container.addChild(this.background);
  }
}
