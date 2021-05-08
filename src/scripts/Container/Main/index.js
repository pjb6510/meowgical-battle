import * as PIXI from "pixi.js";
import globals from "../../globals";
import Menu from "./Menu";
import HostWindow from "./HostWindow";

export default class Main {
  constructor(playerId, isConnected) {
    this.playerId = playerId;
    this.container = new PIXI.Container();
    this.menu = null;
    this.hostWindow = null;
    this.guestWindow = null;

    this.createBackground();
    this.createMenu();
  }

  createBackground() {
    const background = new PIXI.Sprite(globals.resource.mainBackground.texture);
    this.container.addChild(background);
  }

  createMenu() {
    if (!this.menu) {
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
    }

    this.container.addChild(this.menu.container);
  }

  createHostWindow() {
    const handleBackButtonClick = () => {
      this.removeHostWindow();
      this.createMenu();
    };

    if (!this.hostWindow) {
      this.hostWindow = new HostWindow(
        this.playerId,
        false,
        handleBackButtonClick
      );
    }

    this.container.addChild(this.hostWindow.container);
  }

  removeMenu() {
    this.container.removeChild(this.menu.container);
  }

  removeHostWindow() {
    this.container.removeChild(this.hostWindow.container);
  }

  handleCreateGameClick(e) {
    this.removeMenu();
    this.createHostWindow();
  }

  handleJoinGameClick(e) {
    this.removeMenu();
  }
}
