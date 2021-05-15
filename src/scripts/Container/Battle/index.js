import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import TileGroup from "./TileGroup";
import Player from "./Player";
import globalStore from "../../globalStore";
import { canvasSize } from "../../config";
import isEqualArray from "../../utils/isEqualArray";

export default class Battle extends Drawer {
  constructor(isHost) {
    super();
    this.isHost = isHost;
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

    this.tileGroupGap = 440;
    this.tileGroupYOffset = 300;
    this.tileGap = 20;
    this.tileSize = {
      width: 200,
      height: 80,
    };
    this.tileGroupSize = {
      row: 4,
      column: 4,
    };
    this.tileBorderWidth = 10;
    this.hostPlayerTileColor = 0xa8e8ca;
    this.guestPlayerTileColor = 0x9abeff;

    this.playerTileGroupPosition = {
      x: canvasSize.width / 2 - this.tileGroupGap,
      y: canvasSize.height / 2 + this.tileGroupYOffset,
    };
    this.opponentTileGroupPosition = {
      x: canvasSize.width / 2 + this.tileGroupGap,
      y: canvasSize.height / 2 + this.tileGroupYOffset,
    };

    this.playerFirstTilePosition = {
      x: this.playerTileGroupPosition.x -
        (this.tileSize.width / 2) -
        this.tileGap -
        this.tileSize.width,
      y: this.playerTileGroupPosition.y -
        (this.tileSize.height / 2) -
        this.tileGap -
        this.tileSize.height,
    };
    this.opponentFirstTilePosition = {
      x: this.opponentTileGroupPosition.x +
        (this.tileSize.width / 2) +
        this.tileGap +
        this.tileSize.width,
      y: this.opponentTileGroupPosition.y -
        (this.tileSize.height / 2) -
        this.tileGap -
        this.tileSize.height,
    };

    this.background = null;
    this.playerStatusBar = null;
    this.opponentStatusBar = null;
    this.playerTileGroup = null;
    this.opponentTileGroup = null;
    this.createBackground();
    this.createPlayerStatusBar();
    this.createOpponentStatusBar();
    this.createPlayerTileGroup();
    this.createOpponentTileGroup();
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

  createPlayerTileGroup() {
    this.playerTileGroup = new TileGroup({
      x: this.playerTileGroupPosition.x,
      y: this.playerTileGroupPosition.y,
      row: this.tileGroupSize.row,
      column: this.tileGroupSize.column,
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

  createOpponentTileGroup() {
    this.opponentTileGroup = new TileGroup({
      x: this.opponentTileGroupPosition.x,
      y: this.opponentTileGroupPosition.y,
      row: this.tileGroupSize.row,
      column: this.tileGroupSize.column,
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
      xPositionRange: this.tileGroupSize.column,
      yPositionRange: this.tileGroupSize.row,
      xMovingDistance: this.tileSize.width + this.tileGap,
      yMovingDistance: this.tileSize.height + this.tileGap,
    });
  }

  createOpponent() {
    this.opponent = new Player({
      isHost: !this.isHost,
      shouldTurnAround: !this.isHost,
      x: this.opponentFirstTilePosition.x,
      y: this.opponentFirstTilePosition.y,
      xPositionRange: this.tileGroupSize.column,
      yPositionRange: this.tileGroupSize.row,
      xMovingDistance: this.tileSize.height + this.tileGap,
      yMovingDistance: this.tileSize.width + this.tileGap,
    });
  }

  render() {
    this.container.addChild(
      this.background,
      this.playerStatusBar.container,
      this.opponentStatusBar.container,
      this.playerTileGroup.container,
      this.opponentTileGroup.container,
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
