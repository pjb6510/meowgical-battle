import * as PIXI from "pixi.js";
import { canvasSize } from "../config";
import Loader from "../container/Loader";
import Main from "../container/Main";
import generateRandomString from "../utils/generateRandomString";
import { dispatch } from "../redux/store";
import { setPlayerId } from "../redux/actions";

export default class App {
  constructor() {
    dispatch(
      setPlayerId(generateRandomString())
    );

    this.app = null;
    this.mainScene = null;
  }

  async run() {
    try {
      this.app = new PIXI.Application({
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: 0xeeeeee,
      });

      const $container = document.querySelector(".container");
      $container.appendChild(this.app.view);

      await this.loading();

      this.createMain();
    } catch (err) {
      console.error(err);
    }
  }

  async loading() {
    this.loader = new Loader(this.app.loader);
    this.app.stage.addChild(this.loader.container);
    await this.loader.preload();
    this.app.stage.removeChild(this.loader.container);
  }

  createMain() {
    this.mainScene = new Main();
    this.app.stage.addChild(this.mainScene.container);
  }
}
