import * as PIXI from "pixi.js";
import Menu from "./Menu";
import HostWindow from "../HostWindow";
import GuestWindow from "../GuestWindow";
import { getState } from "../../redux";
import socket from "../../socket";

export default class Main {
  constructor() {
    this.container = new PIXI.Container();
    this.menu = null;
    this.hostWindow = null;
    this.guestWindow = null;
    this.mainBackgroundTexture = getState()
      .resources
      .mainBackground
      .texture;
    this.playerId = getState().playerId;

    this.createBackground();
    this.createMenu();
  }

  createBackground() {
    const background = new PIXI.Sprite(this.mainBackgroundTexture);
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
          borderColor: 0x82c9f5,
          event: this.handleCreateGameClick.bind(this),
        },
        {
          text: "게임 참가",
          borderColor: 0x82c9f5,
          event: this.handleJoinGameClick.bind(this),
        }
      );
    }

    this.container.addChild(this.menu.container);
  }

  createHostWindow() {
    const handleBackButtonClick = () => {
      socket.removeGame(this.playerId);
      this.removeHostWindow();
      this.createMenu();
    };

    this.hostWindow = new HostWindow(
      handleBackButtonClick
    );

    this.container.addChild(this.hostWindow.container);
  }

  createGuestWindow() {
    const handleBackButtonClick = () => {
      this.removeGuestWindow();
      this.createMenu();
    };

    if (!this.guestWindow) {
      this.guestWindow = new GuestWindow(
        handleBackButtonClick
      );
    }

    this.container.addChild(this.guestWindow.container);
  }

  removeMenu() {
    this.container.removeChild(this.menu.container);
  }

  removeHostWindow() {
    this.container.removeChild(this.hostWindow.container);
    this.hostWindow = null;
  }

  removeGuestWindow() {
    this.container.removeChild(this.guestWindow.container);
  }

  handleCreateGameClick(e) {
    this.removeMenu();
    this.createHostWindow();
  }

  handleJoinGameClick(e) {
    this.removeMenu();
    this.createGuestWindow();
  }
}
