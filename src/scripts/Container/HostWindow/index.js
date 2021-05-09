import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";
import createButton from "../../pixiUtils/createButton";
import PlayerBox from "./PlayerBox";
import OpponentBox from "./OpponentBox";

export default class HostWindow {
  constructor(playerId, isConnected, onBackButtonClick) {
    this.playerId = playerId;
    this.isConnected = isConnected;
    this.onBackButtonClick = onBackButtonClick;

    this.container = new PIXI.Container();
    this.playerBox = null;
    this.opponentBox = null;
    this.createHostWindow();
  }

  createHostWindow() {
    this.playerBox = new PlayerBox();
    this.opponentBox = new OpponentBox(false, this.playerId);

    const backButton = createButton(
      {
        width: 200,
        height: 100,
        x: 200,
        y: canvasSize.height - 300,
        color: 0x35a8f0,
      },
      "돌아가기",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      this.onBackButtonClick
    );

    const gameStartButton = createButton(
      {
        width: 200,
        height: 100,
        x: canvasSize.width / 2,
        y: canvasSize.height - 100,
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

    this.gameStartButton = gameStartButton.children[0];
    this.gameStartButton.interactive = false;
    this.gameStartButton.buttonMode = false;

    this.container.addChild(
      this.playerBox.container,
      this.opponentBox.container,
      backButton,
      gameStartButton
    );
  }
}
