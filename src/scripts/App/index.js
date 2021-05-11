import * as PIXI from "pixi.js";
import { canvasSize } from "../config";
import Loader from "../container/Loader";
import Main from "../container/MainMenu";
import generateRandomString from "../utils/generateRandomString";
import { dispatch, getState, subscribe } from "../redux";
import { setPlayerId, setScene } from "../redux/actions";

export default class App {
  constructor() {
    this.currentScene = null;

    this.app = null;
    this.loader = null;

    dispatch(
      setPlayerId(generateRandomString())
    );

    subscribe(() => {
      const newScene = getState().scene;

      if (newScene && this.currentScene !== newScene) {
        this.updateScene(newScene);
      }
    });
  }

  async run() {
    try {
      this.app = new PIXI.Application({
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: 0xeeeeee,
      });

      const $container = document.querySelector(".container");

      this.app.view.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      $container.appendChild(this.app.view);

      await this.loading();

      dispatch(
        setScene(new Main())
      );
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

  updateScene(newScene) {
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene.container);
    }

    this.currentScene = newScene;
    this.app.stage.addChild(this.currentScene.container);
  }
}
