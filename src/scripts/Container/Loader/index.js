import * as PIXI from "pixi.js";
import loaderConfig from "../../../assets/loaderConfig";
import { canvasSize } from "../../config";
import globals from "../../globals";
import createBox from "../../pixiUtils/createBox";

export default class Loader {
  constructor(loader) {
    this.container = new PIXI.Container();
    this.loadingPercentageText = null;
    this.showLoadingProgress();

    this.loader = loader;
    this.resources = loaderConfig;
  }

  preload() {
    return new Promise((resolve, reject) => {
      for (const key in this.resources) {
        this.loader.add(key, this.resources[key]);
      }

      this.loader.onProgress.add((e) => {
        if (this.loadingPercentageText) {
          this.loadingPercentageText.text = `${e.progress}%`;
        }
      });

      this.loader.onError.add((err) => {
        reject(err);
      });

      this.loader.load((loader, resources) => {
        globals.resource = resources;
        resolve();
      });
    });
  }

  showLoadingProgress() {
    const loadingProgress = new PIXI.Container();

    const loadingBox = createBox({
      width: 500,
      height: 350,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      color: 0xffffff,
    });

    const loadingText = new PIXI.Text(
      "Loading",
      {
        fontFamily: "sans-serif",
        fontSize: 80,
        align: "center",
      }
    );
    loadingText.anchor.set(0.5, 0.5);
    loadingText.x = canvasSize.width / 2;
    loadingText.y = canvasSize.height / 2 - 50;

    const loadingPercentage = new PIXI.Text(
      "0%",
      {
        fontFamily: "sans-serif",
        fontSize: 80,
        align: "center",
      }
    );
    loadingPercentage.anchor.set(0.5, 0.5);
    loadingPercentage.x = canvasSize.width / 2;
    loadingPercentage.y = canvasSize.height / 2 + 70;

    this.loadingPercentageText = loadingPercentage;

    loadingProgress.addChild(
      loadingBox,
      loadingText,
      loadingPercentage
    );

    this.container.addChild(loadingProgress);
  }
}
