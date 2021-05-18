import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import TileGroup from "./TileGroup";
import Player from "./Player";
import Fireball from "./Skills/Fireball";
import globalStore from "../../globalStore";
import { canvasSize } from "../../config";
import isEqualArray from "../../utils/isEqualArray";

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

    this.backgroundZIndex = -10;
    this.drawerZIndex = 10;

    this.drawer = null;
    this.background = null;
    this.playerStatusBar = null;
    this.opponentStatusBar = null;
    this.playerTileGroup = null;
    this.opponentTileGroup = null;
    this.player = null;
    this.opponent = null;
    this.createDrawer();
    this.createBackground();
    this.createPlayerStatusBar();
    this.createOpponentStatusBar();
    this.createPlayerTileGroup();
    this.createOpponentTileGroup();
    this.createPlayer();
    this.createOpponent();

    this.playerSkills = {};
    this.nextPlayerSkillIndex = 0;
    this.opponentSkills = {};
    this.nextOpponentSkillIndex = 0;

    this.listenOpponentAction();

    this.skillCommands = [];
    this.setSkillCommands();

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
    };
  }

  createDrawer() {
    this.drawer = new Drawer(this.handleDraw.bind(this));
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

  addPlayerSkill(skill) {
    this.container.addChild(skill.container);
    skill.skillIndex = this.nextPlayerSkillIndex;
    this.playerSkills[this.nextPlayerSkillIndex] = skill;
    this.nextPlayerSkillIndex += 1;
  }

  addOpponentSkill(skill) {
    this.container.addChild(skill.container);
    skill.skillIndex = this.nextOpponentSkillIndex;
    this.opponentSkills[this.nextOpponentSkillIndex] = skill;
    this.nextOpponentSkillIndex += 1;
  }

  removePlayerSkill(skill) {
    this.container.removeChild(skill.container);
    delete this.playerSkills[skill.skillIndex];
  }

  removeOpponentSkill(skill) {
    this.container.removeChild(skill.container);
    delete this.opponentSkills[skill.skillIndex];
  }

  setSkillCommands() {
    this
      .addSkillCommand({
        command: ["right", "left", "right"],
        useSkill: this.createFireball.bind(this),
      });
  }

  addSkillCommand(skillInfo) {
    this.skillCommands.push(skillInfo);

    return this;
  }

  handleDraw(inputtedCommand) {
    if (inputtedCommand.length === 1) {
      switch (inputtedCommand[0]) {
        case "left":
          this.peer.send(
            JSON.stringify({ action: "moveBack" })
          );
          this.player.moveLeft();
          break;
        case "right":
          this.peer.send(
            JSON.stringify({ action: "moveFront" })
          );
          this.player.moveRight();
          break;
        case "up":
          this.peer.send(
            JSON.stringify({ action: "moveUp" })
          );
          this.player.moveUp();
          break;
        case "down":
          this.peer.send(
            JSON.stringify({ action: "moveDown" })
          );
          this.player.moveDown();
          break;
        default:
          break;
      }
    } else {
      for (let i = 0; i < this.skillCommands.length; i += 1) {
        const skillCommand = this.skillCommands[i];
        const { command, useSkill } = skillCommand;

        if (isEqualArray(inputtedCommand, command)) {
          useSkill({
            player: this.player,
            shouldSendAction: true,
            startCallback: this.addPlayerSkill.bind(this),
            terminationCallback: this.removePlayerSkill.bind(this),
          });
        }
      }
    }
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
          this.hitPlayer({
            toBeHitPlayer: this.opponent,
            toBeHitPlayerStatusBar: this.opponentStatusBar,
            hittingPlayerSkills: this.playerSkills,
            skillIndex: opponentAction.skillIndex,
            shouldSendAction: false,
          });
          break;
        case "fireball":
          this.createFireball({
            player: this.opponent,
            isHeadingToRight: false,
            shouldSendAction: false,
            startCallback: this.addOpponentSkill.bind(this),
            terminationCallback: this.removeOpponentSkill.bind(this),
          });
          break;
        default:
          break;
      }
    });
  }

  hitPlayer({
    toBeHitPlayer,
    toBeHitPlayerStatusBar,
    hittingPlayerSkills,
    skillIndex,
    shouldSendAction,
  }) {
    const skill = hittingPlayerSkills[skillIndex];

    if (skill.handleHit) {
      skill.handleHit();
    }

    toBeHitPlayer.playBeHitMotion();
    toBeHitPlayerStatusBar.beHit(skill.damage);

    if (shouldSendAction) {
      this.peer.send(
        JSON.stringify({
          action: "beHit",
          skillIndex,
        })
      );
    }
  }

  createFireball({
    player,
    isHeadingToRight = true,
    shouldSendAction,
    startCallback,
    terminationCallback,
  }) {
    if (shouldSendAction) {
      this.peer.send(
        JSON.stringify({ action: "fireball" })
      );
    }

    player.playAttackMotion();

    new Fireball({
      x: player.x,
      y: player.y,
      rowIndex: player.rowIndex,
      isHeadingToRight,
      startCallback,
      terminationCallback,
    });
  }

  update() {
    this.checkIsGameOver();
    this.checkIsSkillHit();
  }

  checkIsSkillHit() {
    for (const skillIndex in this.opponentSkills) {
      const skill = this.opponentSkills[skillIndex];

      if (skill.checkIsHit && skill.isAbleHit) {
        const isHit = skill.checkIsHit(this.player);

        if (isHit) {
          this.hitPlayer({
            toBeHitPlayer: this.player,
            toBeHitPlayerStatusBar: this.playerStatusBar,
            hittingPlayerSkills: this.opponentSkills,
            skillIndex,
            shouldSendAction: true,
          });
        }
      }
    }
  }

  checkIsGameOver() {

  }
}
