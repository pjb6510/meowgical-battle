import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";
import createBox from "../../pixiUtils/createBox";

export default class HostWindow {
  constructor(playerId, isConnected) {
    this.playerId = playerId;
    this.isConnected = isConnected;

    this.container = new PIXI.Container();
    this.createHostWindow();
  }

  createHostWindow() {
    const playerBox = createBox({
      width: 500,
      height: 600,
      x: canvasSize.width / 2 - 300,
      y: canvasSize.height / 2 + 100,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0x82c9f5,
    });

    const invitationCodeBox = createBox({
      width: 500,
      height: 600,
      x: canvasSize.width / 2 + 300,
      y: canvasSize.height / 2 + 100,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0xcb90e8,
    });

    const backButton = createBox({
      width: 200,
      height: 100,
      x: 200,
      y: canvasSize.height - 300,
      color: 0x35a8f0,
    });
    backButton.interactive = true;
    backButton.buttonMode = true;

    this.container.addChild(
      playerBox,
      invitationCodeBox,
      backButton
    );
  }
}
