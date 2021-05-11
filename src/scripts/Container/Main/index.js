import * as PIXI from "pixi.js";
import Menu from "./Menu";
import HostWindow from "../HostWindow";
import GuestWindow from "../GuestWindow";
import InputInvitationCode from "../InputInvitationCode";
import { getState } from "../../redux";

export default class Main {
  constructor() {
    this.container = new PIXI.Container();
    this.menu = null;
    this.hostWindow = null;
    this.guestWindow = null;
    this.inputInvitationCode = null;
    this.backgroundTexture = getState()
      .resources
      .mainBackground
      .texture;
    this.playerId = getState().playerId;

    this.createBackground();
    this.createMenu();
  }

  createBackground() {
    const background = new PIXI.Sprite(this.backgroundTexture);
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
    this.hostWindow = new HostWindow(this);
    this.container.addChild(this.hostWindow.container);
  }

  removeHostWindow() {
    this.container.removeChild(this.hostWindow.container);
    this.hostWindow = null;
  }

  createInputInvitationCode() {
    this.inputInvitationCode = new InputInvitationCode(this);
    this.container.addChild(this.inputInvitationCode.container);
  }

  removeInputInvitationCode() {
    this.container.removeChild(this.inputInvitationCode.container);
    this.inputInvitationCode = null;
  }

  createGuestWindow(invitationCode) {
    this.guestWindow = new GuestWindow(this, invitationCode);
    this.container.addChild(this.guestWindow.container);
  }

  removeGuestWindow() {
    this.container.removeChild(this.guestWindow.container);
    this.guestWindow = null;
  }

  handleGuestWindowBackButtonClick() {
    this.removeGuestWindow();
    this.createMenu();
  }

  showInvitationCode() {
    this.removeGuestWindow();
    this.createInputInvitationCode();
  }

  removeMenu() {
    this.container.removeChild(this.menu.container);
  }

  handleCreateGameClick(e) {
    this.removeMenu();
    this.createHostWindow();
  }

  handleJoinGameClick(e) {
    this.removeMenu();
    this.createInputInvitationCode();
  }
}
