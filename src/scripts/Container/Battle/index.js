import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import Tiles from "./Tiles";
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

    this.playerTilesDistance = 340;
    this.playerTilesOption = {
      x: canvasSize.width / 2 - this.playerTilesDistance,
      y: canvasSize.height / 2 + 200,
      tileWidth: 150,
      tileHeight: 80,
      tileBorderWidth: 10,
      tileBorderColor: isHost ? 0xa8e8ca : 0x9abeff,
      tilesXDistance: 20,
      tilesYDistance: 20,
    };
    this.opponentTilesOption = {
      x: canvasSize.width / 2 + this.playerTilesDistance,
      y: canvasSize.height / 2 + 200,
      tileWidth: 150,
      tileHeight: 80,
      tileBorderWidth: 10,
      tileBorderColor: isHost ? 0x9abeff : 0xa8e8ca,
      tilesXDistance: 20,
      tilesYDistance: 20,
    };

    this.background = null;
    this.playerStatusBar = null;
    this.opponentStatusBar = null;
    this.playerTiles = null;
    this.opponentTiles = null;
    this.createBackground();
    this.createPlayerStatusBar();
    this.createOpponentStatusBar();
    this.createPlayerTiles();
    this.createOpponentTiles();

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

  createPlayerTiles() {
    this.playerTiles = new Tiles(this.playerTilesOption);
  }

  createOpponentTiles() {
    this.opponentTiles = new Tiles(this.opponentTilesOption);
  }

  render() {
    this.container.addChild(
      this.background,
      this.playerStatusBar.container,
      this.opponentStatusBar.container,
      this.playerTiles.container,
      this.opponentTiles.container
    );
  }
}
