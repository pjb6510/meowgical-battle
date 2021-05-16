import * as PIXI from "pixi.js";
import Tween from "@tweenjs/tween.js";
import { canvasSize } from "../config";
import Loader from "../container/Loader";
import MainMenu from "../container/MainMenu";
import Battle from "../container/Battle";
import generateRandomString from "../utils/generateRandomString";
import globalStore from "../globalStore";

export default class App {
  constructor() {
    this.app = null;
    this.loader = null;

    this.currentScene = null;
    this.battleScene = null;
    this.playerId = generateRandomString();

    globalStore.subscribe((newStore) => {
      const { scene: newScene } = newStore;

      if (newScene && this.currentScene !== newScene) {
        this.changeScene(newScene);
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

      globalStore.setStore("scene", new MainMenu(this.playerId));

      this.app.ticker.add((delta) => {
        Tween.update();

        if (this.battleScene) {
          this.battleScene.update();
        }
      });
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

  changeScene(newScene) {
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene.container);
    }

    this.currentScene = newScene;

    if (this.currentScene instanceof Battle) {
      this.battleScene = this.currentScene;
    }

    this.app.stage.addChild(this.currentScene.container);
  }
}
