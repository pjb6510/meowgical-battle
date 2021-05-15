import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import TileGroup from "./TileGroup";
import Player from "./Player";
import globalStore from "../../globalStore";
import isEqualArray from "../../utils/isEqualArray";
import mixinSetBattleElementsOptions from "./mixinSetBattleElementsOptions";

export default class Battle extends Drawer {
  constructor(isHost, peer) {
    super();
    this.isHost = isHost;
    this.peer = peer;
    this.drawingCallback = this.handleDraw;

    this.backgroundTexture = globalStore
      .getItem("resources")
      .battleBackground
      .texture;

    this.playerStatusBarOption = null;
    this.opponentStatusBarOption = null;
    this.setStatusBarOptions();

    this.playerTileGroupOption = null;
    this.opponentTileGroupOption = null;
    this.setTileOptions();

    this.playerOption = null;
    this.opponentOption = null;
    this.setPlayersOptions();

    this.background = null;
    this.playerStatusBar = null;
    this.opponentStatusBar = null;
    this.playerTileGroup = null;
    this.opponentTileGroup = null;
    this.player = null;
    this.opponent = null;
    this.createBackground();
    this.createPlayerStatusBar();
    this.createOpponentStatusBar();
    this.createPlayerTileGroup();
    this.createOpponentTileGroup();
    this.createPlayer();
    this.createOpponent();

    this.setPeerListener();

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
    this.playerTileGroup = new TileGroup(this.playerTileGroupOption);
  }

  createOpponentTileGroup() {
    this.opponentTileGroup = new TileGroup(this.opponentTileGroupOption);
  }

  createPlayer() {
    this.player = new Player(this.playerOption);
  }

  createOpponent() {
    this.opponent = new Player(this.opponentOption);
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
          this.peer.send("moveBack");
          this.player.moveLeft();
          break;
        case "right":
          this.peer.send("moveFront");
          this.player.moveRight();
          break;
        case "up":
          this.peer.send("moveUp");
          this.player.moveUp();
          break;
        case "down":
          this.peer.send("moveDown");
          this.player.moveDown();
          break;
        default:
          break;
      }
    }

    if (isEqualArray(directions, ["right", "left", "right"])) {
      this.peer.send("attack");
      this.player.attack();
    }
  }

  setPeerListener() {
    this.peer.on("data", (action) => {
      switch (action) {
        case "moveFront":
          this.opponent.moveLeft();
          break;
        case "moveBack":
          this.opponent.moveRight();
          break;
        case "moveUp":
          this.opponent.moveUp();
          break;
        case "moveDown":
          this.opponent.moveDown();
          break;
        case "attack":
          this.opponent.attack();
          break;
        default:
          break;
      }
    });
  }
}

Object.assign(Battle.prototype, mixinSetBattleElementsOptions);
