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

    this.playerSkills = {};
    this.nextPlayerSkillIndex = 0;
    this.opponentSkills = {};
    this.nextOpponentSkillIndex = 0;

    this.drawingCallback = this.handleDraw;

    this.listenOpponentAction({
      opponent: this.opponent,
      opponentStatusBar: this.opponentStatusBar,
      playerSkills: this.playerSkills,
      peer: this.peer,
      skillStartCallback: this.addOpponentSkill.bind(this),
      skillTerminationCallback: this.removeOpponentSkill.bind(this),
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
      player: this.player,
      inputtedCommand: directions,
      peer: this.peer,
      skillStartCallback: this.addPlayerSkill.bind(this),
      skillTerminationCallback: this.removePlayerSkill.bind(this),
    });
  }

  update() {
    this.checkIsSkillHit();
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

  checkIsSkillHit() {
    for (const skillIndex in this.opponentSkills) {
      const skill = this.opponentSkills[skillIndex];

      if (skill.checkIsHit && skill.isAbleHit) {
        const isHit = skill.checkIsHit(this.player);

        if (isHit) {
          this.hitPlayer({
            player: this.player,
            playerStatusBar: this.playerStatusBar,
            opponentSkills: this.opponentSkills,
            skillIndex,
            peer: this.peer,
          });
        }
      }
    }
  }
}

Object.assign(Battle.prototype, mixinSetBattleElementsOptions);
Object.assign(Battle.prototype, mixinSetActionListener);
