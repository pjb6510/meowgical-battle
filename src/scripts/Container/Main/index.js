import * as PIXI from "pixi.js";
import globals from "../../globals";
import Menu from "./Menu";

export default class Main {
  constructor(playerId) {
    this.playerId = playerId;

    this.container = new PIXI.Container();

    this.createBackground();

    this.menu = null;
    this.createMenu();
  }

  createBackground() {
    const background = new PIXI.Sprite(globals.resource.mainBackground.texture);
    this.container.addChild(background);
  }

  createMenu() {
    this.menu = new Menu(
      {
        offsetX: 0,
        offsetY: -280,
      },
      {
        text: "게임 개설",
        event: this.handleCreateGameClick.bind(this),
      },
      {
        text: "게임 참가",
        event: this.handleJoinGameClick.bind(this),
      }
    );

    this.container.addChild(this.menu.container);
  }

  removeMenu() {
    this.container.removeChild(this.menu.container);
  }

  handleCreateGameClick(e) {
    this.removeMenu();
  }

  handleJoinGameClick(e) {
    this.removeMenu();
  }
}
