import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import Tiles from "./Tiles";
import Player from "./Player";
import globalStore from "../../globalStore";
import { canvasSize } from "../../config";

export default class Battle extends Drawer {
  constructor(isHost) {
    super();
    this.isLeftPlayer = isHost;

    this.backgroundTexture = globalStore
      .getItem("resources")
      .battleBackground
      .texture;

    this.statusBarDistance = 500;
    this.playerStatusBarOption = {
      x: canvasSize.width / 2 - this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isLeftPlayer: this.isLeftPlayer,
    };
    this.opponentStatusBarOption = {
      x: canvasSize.width / 2 + this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isLeftPlayer: !this.isLeftPlayer,
    };

    this.tilesGap = 340;
    this.tilesYOffset = 250;
    this.tileGap = 20;
    this.tileSize = {
      width: 150,
      height: 60,
    };
    this.tileBorderWidth = 10;
    this.leftPlayerTileColor = 0xa8e8ca;
    this.rightPlayerTileColor = 0x9abeff;

    this.playerTilesPosition = {
      x: canvasSize.width / 2 - this.tilesGap,
      y: canvasSize.height / 2 + this.tilesYOffset,
    };
    this.opponentTilesPosition = {
      x: canvasSize.width / 2 + this.tilesGap,
      y: canvasSize.height / 2 + this.tilesYOffset,
    };

    this.playerFirstTilePosition = {
      x: this.playerTilesPosition.x -
        (this.tileSize.width / 2) -
        this.tileGap -
        this.tileSize.width,
      y: this.playerTilesPosition.y -
        (this.tileSize.height / 2) -
        this.tileGap -
        this.tileSize.height,
    };
    this.opponentFirstTilePosition = {
      x: this.opponentTilesPosition.x +
        (this.tileSize.width / 2) +
        this.tileGap +
        this.tileSize.width,
      y: this.opponentTilesPosition.y -
        (this.tileSize.height / 2) -
        this.tileGap -
        this.tileSize.height,
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
    this.createPlayer();
    this.createOpponent();

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
    this.playerTiles = new Tiles({
      x: this.playerTilesPosition.x,
      y: this.playerTilesPosition.y,
      tileWidth: this.tileSize.width,
      tileHeight: this.tileSize.height,
      tileBorderWidth: this.tileBorderWidth,
      tileBorderColor: this.isLeftPlayer
        ? this.leftPlayerTileColor
        : this.rightPlayerTileColor,
      tileXGap: this.tileGap,
      tileYGap: this.tileGap,
    });
  }

  createOpponentTiles() {
    this.opponentTiles = new Tiles({
      x: this.opponentTilesPosition.x,
      y: this.opponentTilesPosition.y,
      tileWidth: this.tileSize.width,
      tileHeight: this.tileSize.height,
      tileBorderWidth: this.tileBorderWidth,
      tileBorderColor: this.isLeftPlayer
        ? this.rightPlayerTileColor
        : this.leftPlayerTileColor,
      tileXGap: this.tileGap,
      tileYGap: this.tileGap,
    });
  }

  createPlayer() {
    this.player = new Player({
      isLeftPlayer: this.isLeftPlayer,
      x: this.playerFirstTilePosition.x,
      y: this.playerFirstTilePosition.y,
    });
  }

  createOpponent() {
    this.opponent = new Player({
      isLeftPlayer: !this.isLeftPlayer,
      x: this.opponentFirstTilePosition.x,
      y: this.opponentFirstTilePosition.y,
    });
  }

  render() {
    this.container.addChild(
      this.background,
      this.playerStatusBar.container,
      this.opponentStatusBar.container,
      this.playerTiles.container,
      this.opponentTiles.container,
      this.player.container,
      this.opponent.container
    );
  }
}
