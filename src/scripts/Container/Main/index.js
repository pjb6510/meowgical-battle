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
    this.hostWindow = new HostWindow(
      this.handleHostBackButtonClick.bind(this)
    );

    this.container.addChild(this.hostWindow.container);
  }

  handleHostBackButtonClick() {
    socket.removeGame(this.playerId);
    this.container.removeChild(this.hostWindow.container);
    this.hostWindow = null;
    this.createMenu();
  }

  createGuestWindow() {
    this.guestWindow = new GuestWindow(
      this.handleGuestBackButtonClick.bind(this)
    );

    this.container.addChild(this.guestWindow.container);
  }

  handleGuestBackButtonClick() {
    socket.unsubscribeJoinGameResult();
    this.container.removeChild(this.guestWindow.container);
    this.guestWindow = null;
    this.createMenu();
  };

  handleCreateGameClick(e) {
    this.container.removeChild(this.menu.container);
    this.createHostWindow();
  }

  handleJoinGameClick(e) {
    this.container.removeChild(this.menu.container);
    this.createGuestWindow();
  }
}
