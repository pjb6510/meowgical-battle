import * as PIXI from "pixi.js";
import Loader from "../Container/Loader";
import { canvasSize } from "../constants";

export default class App {
  async run() {
    try {
      this.app = new PIXI.Application({
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: 0xeeeeee,
      });

      const $container = document.querySelector(".container");
      $container.appendChild(this.app.view);

      this.loader = new Loader(this.app.loader);
      this.app.stage.addChild(this.loader.container);
      await this.loader.preload();
      this.app.stage.removeChild(this.loader.container);

      this.start();
    } catch (err) {
      console.error(err);
    }
  }

  start() {}
}
