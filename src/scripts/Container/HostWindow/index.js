import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";
import createButton from "../../pixiUtils/createButton";
import PlayerBox from "./PlayerBox";
import OpponentBox from "./OpponentBox";
import { getState } from "../../redux";
import socket from "../../socket";

export default class HostWindow {
  constructor(handleBackButtonClick) {
    this.handleBackButtonClick = handleBackButtonClick;
    this.isConnected = false;
    this.rightPlayerTexture = getState()
      .resources
      .rightPlayer
      .texture;
    this.playerId = getState().playerId;

    socket.createGame(this.playerId);

    this.container = new PIXI.Container();
    this.playerBox = null;
    this.opponentBox = null;
    this.backButton = null;
    this.gameStartButton = null;
    this.createHostWindow();
  }

  createHostWindow() {
    this.playerBox = new PlayerBox();
    this.opponentBox = new OpponentBox(false);

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
      this.handleBackButtonClick
    );

    this.gameStartButton = createButton(
      {
        width: 200,
        height: 100,
        x: canvasSize.width / 2,
        y: canvasSize.height - 120,
        color: 0x6e6e6e,
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

    this.container.addChild(
      this.playerBox.container,
      this.opponentBox.container,
      this.backButton,
      this.gameStartButton
    );
  }
}
