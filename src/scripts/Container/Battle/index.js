import * as PIXI from "pixi.js";
import Drawer from "./Drawer";
import StatusBar from "./StatusBar";
import TileGroup from "./TileGroup";
import Player from "./Player";
import globalStore from "../../globalStore";
import mixinSetBattleElementsOptions from "./mixinSetBattleElementsOptions";
import mixinSetActionListener from "./mixinSetActionListener";

export default class Battle extends Drawer {
  constructor(isHost, peer) {
    super();
    this.isHost = isHost;
    this.peer = peer;

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

    this.drawingCallback = this.handleDraw;

    this.playerSkills = [];
    this.opponentSkills = [];

    this.listenOpponentAction({
      container: this.container,
      opponentSkills: this.opponentSkills,
      opponent: this.opponent,
      peer: this.peer,
    });
    this.skillCommands = [];
    this.setSkillCommands();

    this.render();
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
    this.handlePlayerActionListen({
      container: this.container,
      playerSkills: this.playerSkills,
      inputtedCommand: directions,
      player: this.player,
      peer: this.peer,
    });
  }

  update() {
    this.checkIsSkillHit();
    this.checkIsSkillTerminated();
  }

  checkIsSkillTerminated() {
    for (let i = this.playerSkills.length - 1; i >= 0; i -= 1) {
      const skill = this.playerSkills[i];

      if (skill.isTerminated) {
        this.container.removeChild(skill.container);
        this.playerSkills.splice(i, 1);
      }
    }

    for (let i = this.opponentSkills.length - 1; i >= 0; i -= 1) {
      const skill = this.opponentSkills[i];

      if (skill.isTerminated) {
        this.container.removeChild(skill.container);
        this.opponentSkills.splice(i, 1);
      }
    }
  }

  checkIsSkillHit() {
    for (let i = 0; i < this.opponentSkills.length; i += 1) {
      const skill = this.opponentSkills[i];

      if (skill.checkIsHit) {
        skill.checkIsHit(this.player);
      }
    }
  }
}

Object.assign(Battle.prototype, mixinSetBattleElementsOptions);
Object.assign(Battle.prototype, mixinSetActionListener);
