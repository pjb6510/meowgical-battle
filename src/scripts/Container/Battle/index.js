import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import globalStore from "../../globalStore";
import { canvasSize } from "../../config";

export default class Battle extends Drawer {
  constructor(isHost) {
    super();

    this.backgroundTexture = globalStore
      .getItem("resources")
      .battleBackground
      .texture;

    this.statusBarDistance = 500;
    this.playerStatusBarOption = {
      x: canvasSize.width / 2 - this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isLeftCharacter: isHost,
    };
    this.opponentStatusBarOption = {
      x: canvasSize.width / 2 + this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isLeftCharacter: !isHost,
    };

    this.background = null;
    this.playerStatusBar = null;
    this.createBackground();
    this.createPlayerStatusBar();
    this.createOpponentStatusBar();

    this.render();
  }

  createBackground() {
    this.background = new PIXI.Sprite(this.backgroundTexture);
  }

  createPlayerStatusBar() {
    this.playerStatusBar = new StatusBar(this.playerStatusBarOption);
  }

  createOpponentStatusBar() {
    this.opponentStatusBar = new StatusBar(this.opponentStatusBarOption);
  }

  render() {
    this.container.addChild(
      this.background,
      this.playerStatusBar.container,
      this.opponentStatusBar.container
    );
  }
}
