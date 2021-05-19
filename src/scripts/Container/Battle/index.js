import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import SkillCommandListener from "./SkillCommandListener";
import MainMenu from "../MainMenu";
import StatusBar from "./StatusBar";
import TileGroup from "./TileGroup";
import Player from "./Player";
import ResultModal from "./ResultModal";
import { canvasSize } from "../../config";
import globalStore from "../../globalStore";
import generateRandomString from "../../utils/generateRandomString";

export default class Battle {
  constructor(isHost, peer) {
    this.isHost = isHost;
    this.peer = peer;

    this.container = new PIXI.Container();
    this.container.sortableChildren = true;

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

    this.winModalOption = null;
    this.defeatModalOption = null;
    this.setResultModalOptions();

    this.backgroundZIndex = -10;
    this.drawerZIndex = 10;

    this.skillCommandListener = null;
    this.createSkillCommandListener();
    this.drawer = null;
    this.createDrawer();

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

    this.playerMagics = {};
    this.nextPlayerMagicIndex = 0;
    this.opponentMagics = {};
    this.nextOpponentMagicIndex = 0;

    this.listenOpponentAction();
    this.setSkillCommands();

    this.isPlaying = true;

    this.render();
  }

  setStatusBarOptions() {
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
  }

  setTileOptions() {
    this.tileGroupGap = 440;
    this.tileGroupYOffset = 300;
    this.tileGroupSize = {
      row: 4,
      column: 4,
    };

    this.tileGap = 20;
    this.tileSize = {
      width: 200,
      height: 80,
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

    this.playerTileGroupOption = {
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
    };
    this.opponentTileGroupOption = {
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
    };
  }

  setPlayersOptions() {
    this.playerOption = {
      isHost: this.isHost,
      isHeadingToRight: true,
      x: this.playerFirstTilePosition.x,
      y: this.playerFirstTilePosition.y,
      columnIndex: 0,
      rowIndex: 0,
      columnRange: this.tileGroupSize.column,
      rowRange: this.tileGroupSize.row,
      xMovingDistance: this.tileSize.width + this.tileGap,
      yMovingDistance: this.tileSize.height + this.tileGap,
      actionCallback: this.sendPlayerAction.bind(this),
      beHitCallback: this.collideMagicWithPlayer.bind(this),
      magicStartCallback: this.addPlayerMagic.bind(this),
      magicTerminationCallback: this.removePlayerMagic.bind(this),
    };
    this.opponentOption = {
      isHost: !this.isHost,
      isHeadingToRight: false,
      x: this.opponentFirstTilePosition.x,
      y: this.opponentFirstTilePosition.y,
      columnIndex: this.tileGroupSize.column - 1,
      rowIndex: 0,
      columnRange: this.tileGroupSize.column,
      rowRange: this.tileGroupSize.row,
      xMovingDistance: this.tileSize.width + this.tileGap,
      yMovingDistance: this.tileSize.height + this.tileGap,
      beHitCallback: this.collideMagicWithOpponent.bind(this),
      magicStartCallback: this.addOpponentMagic.bind(this),
      magicTerminationCallback: this.removeOpponentMagic.bind(this),
    };
  }

  setResultModalOptions() {
    this.winModalOption = {
      width: 600,
      height: 400,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0x1e90ff,
    };

    this.defeatModalOption = {
      ...this.winModalOption,
      borderColor: 0xd11137,
    };

    this.resultModalZIndex = 100;
  }

  createSkillCommandListener() {
    this.skillCommandListener = new SkillCommandListener();
  }

  createDrawer() {
    this.drawer = new Drawer(
      this.skillCommandListener.handleCommandListen.bind(
        this.skillCommandListener
      )
    );
    this.drawer.container.zIndex = this.drawerZIndex;
  }

  createBackground() {
    this.background = new PIXI.Sprite(this.backgroundTexture);
    this.background.zIndex = this.backgroundZIndex;
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

  createResultModal(isWin) {
    if (isWin) {
      this.resultModal = new ResultModal(
        this.winModalOption,
        true,
        this.returnToMainMenu.bind(this)
      );
    } else {
      this.resultModal = new ResultModal(
        this.defeatModalOption,
        false,
        this.returnToMainMenu.bind(this)
      );
    }

    this.resultModal.container.zIndex = this.resultModalZIndex;
  }

  render() {
    this.container.addChild(
      this.drawer.container,
      this.background,
      this.playerStatusBar.container,
      this.opponentStatusBar.container,
      this.playerTileGroup.container,
      this.opponentTileGroup.container,
      this.player.container,
      this.opponent.container
    );
  }

  addPlayerMagic(magic) {
    this.container.addChild(magic.container);
    magic.magicIndex = this.nextPlayerMagicIndex;
    this.playerMagics[this.nextPlayerMagicIndex] = magic;
    this.nextPlayerMagicIndex += 1;
  }

  addOpponentMagic(magic) {
    this.container.addChild(magic.container);
    magic.magicIndex = this.nextOpponentMagicIndex;
    this.opponentMagics[this.nextOpponentMagicIndex] = magic;
    this.nextOpponentMagicIndex += 1;
  }

  removePlayerMagic(magic) {
    this.container.removeChild(magic.container);
    delete this.playerMagics[magic.magicIndex];
  }

  removeOpponentMagic(magic) {
    this.container.removeChild(magic.container);
    delete this.opponentMagics[magic.magicIndex];
  }

  collideMagicWithPlayer(hittingMagic) {
    if (hittingMagic.handleHit) {
      hittingMagic.handleHit();
    }

    this.playerStatusBar.beHit(hittingMagic.damage);
  }

  collideMagicWithOpponent(hittingMagic) {
    if (hittingMagic.handleHit) {
      hittingMagic.handleHit();
    }

    this.opponentStatusBar.beHit(hittingMagic.damage);
  }

  setSkillCommands() {
    this.skillCommandListener
      .addSkillCommand({
        command: ["left"],
        skill: this.player.moveLeft.bind(this.player),
      })
      .addSkillCommand({
        command: ["right"],
        skill: this.player.moveRight.bind(this.player),
      })
      .addSkillCommand({
        command: ["up"],
        skill: this.player.moveUp.bind(this.player),
      })
      .addSkillCommand({
        command: ["down"],
        skill: this.player.moveDown.bind(this.player),
      })
      .addSkillCommand({
        command: ["right", "left", "right"],
        skill: this.player.castFireball.bind(this.player),
      });
  }

  listenOpponentAction() {
    this.peer.on("data", (data) => {
      const opponentAction = JSON.parse(data);

      switch (opponentAction.action) {
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
        case "beHit":
          this.opponent.beHit(
            this.playerMagics[opponentAction.magicIndex]
          );
          break;
        case "fireball":
          this.opponent.castFireball();
          break;
        default:
          break;
      }
    });
  }

  sendPlayerAction(data) {
    this.peer.send(
      JSON.stringify(data)
    );
  }

  update() {
    this.checkIsGameOver();
    this.checkIsPlayerHit();
  }

  checkIsPlayerHit() {
    for (const magicIndex in this.opponentMagics) {
      const magic = this.opponentMagics[magicIndex];

      if (magic.checkIsHit && magic.isAbleToHit) {
        const isHit = magic.checkIsHit(this.player);

        if (isHit) {
          this.player.beHit(magic);
        }
      }
    }
  }

  checkIsGameOver() {
    const playerHp = this.player.hp;
    const opponentHp = this.opponent.hp;

    if (playerHp <= 0 || opponentHp <= 0) {
      this.terminateGame(playerHp > 0);
    }
  }

  terminateGame(isWin) {
    this.isPlaying = false;
    this.drawer.terminateDrawing();

    this.peer.destroy();

    this.createResultModal(isWin);
    this.container.addChild(this.resultModal.container);

    if (isWin) {
      this.opponentStatusBar.portrait.defeat();
      this.player.win();
      this.opponent.beDefeated();
    } else {
      this.playerStatusBar.portrait.defeat();
      this.opponent.win();
      this.player.beDefeated();
    }
  }

  returnToMainMenu() {
    globalStore.setStore(
      "scene",
      new MainMenu(generateRandomString())
    );
  }
}
