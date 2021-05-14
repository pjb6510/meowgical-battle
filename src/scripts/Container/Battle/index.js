import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import Tiles from "./Tiles";
import Player from "./Player";
import globalStore from "../../globalStore";
import { canvasSize } from "../../config";
import isEqualArray from "../../utils/isEqualArray";

export default class Battle extends Drawer {
  constructor(isHost) {
    super();
    this.isHost = !isHost;
    this.drawingCallback = this.handleDraw;

    this.backgroundTexture = globalStore
      .getItem("resources")
      .battleBackground
      .texture;

    this.statusBarDistance = 500;
    this.playerStatusBarOption = {
      x: canvasSize.width / 2 - this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isHost: this.isHost,
    };
    this.opponentStatusBarOption = {
      x: canvasSize.width / 2 + this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isHost: !this.isHost,
    };

    this.tilesGap = 440;
    this.tilesYOffset = 300;
    this.tileGap = 20;
    this.tileSize = {
      width: 200,
      height: 80,
    };
    this.tilesSize = {
      row: 4,
      column: 4,
    };
    this.tileBorderWidth = 10;
    this.hostPlayerTileColor = 0xa8e8ca;
    this.guestPlayerTileColor = 0x9abeff;

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
      row: this.tilesSize.row,
      column: this.tilesSize.column,
      tileWidth: this.tileSize.width,
      tileHeight: this.tileSize.height,
      tileBorderWidth: this.tileBorderWidth,
      tileBorderColor: this.isHost
        ? this.hostPlayerTileColor
        : this.guestPlayerTileColor,
      tileXGap: this.tileGap,
      tileYGap: this.tileGap,
    });
  }

  createOpponentTiles() {
    this.opponentTiles = new Tiles({
      x: this.opponentTilesPosition.x,
      y: this.opponentTilesPosition.y,
      row: this.tilesSize.row,
      column: this.tilesSize.column,
      tileWidth: this.tileSize.width,
      tileHeight: this.tileSize.height,
      tileBorderWidth: this.tileBorderWidth,
      tileBorderColor: this.isHost
        ? this.guestPlayerTileColor
        : this.hostPlayerTileColor,
      tileXGap: this.tileGap,
      tileYGap: this.tileGap,
    });
  }

  createPlayer() {
    this.player = new Player({
      isHost: this.isHost,
      shouldTurnAround: !this.isHost,
      x: this.playerFirstTilePosition.x,
      y: this.playerFirstTilePosition.y,
      xStepMaxCount: this.tilesSize.column,
      yStepMaxCount: this.tilesSize.row,
      yStepDistance: this.tileSize.height + this.tileGap,
      xStepDistance: this.tileSize.width + this.tileGap,
    });
  }

  createOpponent() {
    this.opponent = new Player({
      isHost: !this.isHost,
      shouldTurnAround: !this.isHost,
      x: this.opponentFirstTilePosition.x,
      y: this.opponentFirstTilePosition.y,
      xStepMaxCount: this.tilesSize.column,
      yStepMaxCount: this.tilesSize.row,
      yStepDistance: this.tileSize.height + this.tileGap,
      xStepDistance: this.tileSize.width + this.tileGap,
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

  handleDraw(directions) {
    if (directions.length === 1) {
      switch (directions[0]) {
        case "left":
          this.player.moveLeft();
          break;
        case "right":
          this.player.moveRight();
          break;
        case "up":
          this.player.moveUp();
          break;
        case "down":
          this.player.moveDown();
          break;
        default:
          break;
      }
    }

    if (isEqualArray(directions, ["right", "left", "right"])) {
      this.player.attack();
    }
  }
}
