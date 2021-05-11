import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";
import createButton from "../../pixiUtils/createButton";
import PlayerBox from "../shared/PlayerBox";
import InvitationCodeBox from "./InvitationCodeBox";
import { getState } from "../../redux";
import socket from "../../socket";

export default class HostWindow {
  constructor(parent) {
    this.parent = parent;
    this.isConnected = false;
    this.rightPlayerTexture = getState()
      .resources
      .rightPlayer
      .texture;
    this.playerId = getState().playerId;

    socket.createGame(this.playerId);
    socket.subscribeEntrance(
      this.handleListenEntrance.bind(this)
    );

    this.container = new PIXI.Container();
    this.playerBox = null;
    this.opponentBox = null;
    this.backButton = null;
    this.gameStartButton = null;
    this.createHostWindow();
  }

  createPlayerBox() {
    this.playerBox = new PlayerBox(true, "나");
    this.container.addChild(this.playerBox.container);
  }

  createOpponentBox() {
    if (this.isConnected) {
      this.opponentBox = new PlayerBox(false, "상대");
    } else {
      this.opponentBox = new InvitationCodeBox(this.playerId);
    }

    this.container.addChild(this.opponentBox.container);
  }

  createBackButton() {
    this.backButton = createButton(
      {
        width: 200,
        height: 100,
        x: 200,
        y: canvasSize.height - 300,
        color: 0x32b3a2,
      },
      "돌아가기",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      this.handleBackButtonClick.bind(this)
    );

    this.container.addChild(this.backButton);
  }

  createGameStartButton() {
    this.gameStartButton = createButton(
      {
        width: 200,
        height: 100,
        x: canvasSize.width / 2,
        y: canvasSize.height - 120,
        color: this.isConnected ? 0x3a8ec7 : 0x6e6e6e,
      },
      "게임시작",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      () => {}
    );

    if (!this.isConnected) {
      const buttonBox = this.gameStartButton.children[0];
      buttonBox.interactive = false;
      buttonBox.buttonMode = false;
    }

    this.container.addChild(this.gameStartButton);
  }

  createHostWindow() {
    this.createPlayerBox();
    this.createOpponentBox();
    this.createBackButton();
    this.createGameStartButton();
  }

  rerenderOpponentBox() {
    this.container.removeChild(this.opponentBox.container);
    this.createOpponentBox();
  }

  rerenderGameStartButton() {
    this.container.removeChild(this.gameStartButton);
    this.createGameStartButton();
  }

  containerWillUnmount() {
    socket.unsubscribeEntrance();
    socket.removeGame(this.playerId);
  }

  handleBackButtonClick() {
    this.containerWillUnmount();
    this.parent.removeHostWindow();
    this.parent.createMenu();
  }

  handleListenEntrance(data) {
    const { isEntrance } = data;

    this.isConnected = isEntrance;
    this.rerenderOpponentBox();
    this.rerenderGameStartButton();
  }
}
