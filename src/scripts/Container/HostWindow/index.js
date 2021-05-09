import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";
import createBox from "../../pixiUtils/createBox";
import createButton from "../../pixiUtils/createButton";
import globals from "../../globals";

export default class HostWindow {
  constructor(playerId, isConnected, onBackButtonClick) {
    this.playerId = playerId;
    this.isConnected = isConnected;
    this.onBackButtonClick = onBackButtonClick;

    this.container = new PIXI.Container();
    this.createHostWindow();
  }

  createHostWindow() {
    const playerBox = createBox({
      width: 500,
      height: 600,
      x: canvasSize.width / 2 - 300,
      y: canvasSize.height / 2,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0x82c9f5,
    });

    const playerText = new PIXI.Text(
      "Player1",
      {
        fontFamily: "sans-serif",
        fontSize: 50,
        align: "center",
      }
    );
    playerText.anchor.set(0.5, 0.5);
    playerText.x = canvasSize.width / 2 - 300;
    playerText.y = canvasSize.height / 2 - 200;

    const playerCharacter = new PIXI.Sprite(globals.resource.leftPlayer.texture);
    playerCharacter.anchor.set(0.5, 0.5);
    playerCharacter.x = canvasSize.width / 2 - 300;
    playerCharacter.y = canvasSize.height / 2 + 50;
    playerCharacter.scale.set(0.5);

    const invitationCodeBox = createBox({
      width: 500,
      height: 600,
      x: canvasSize.width / 2 + 300,
      y: canvasSize.height / 2,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0xcb90e8,
    });

    const invitationCodeTitle = new PIXI.Text(
      "초대 코드",
      {
        fontFamily: "sans-serif",
        fontSize: 50,
        align: "center",
      }
    );
    invitationCodeTitle.anchor.set(0.5, 0.5);
    invitationCodeTitle.x = canvasSize.width / 2 + 300;
    invitationCodeTitle.y = canvasSize.height / 2 - 200;

    const invitationCodeText = new PIXI.Text(
      this.playerId,
      {
        fontFamily: "sans-serif",
        fontSize: 50,
        align: "center",
      }
    );
    invitationCodeText.anchor.set(0.5, 0.5);
    invitationCodeText.x = canvasSize.width / 2 + 300;
    invitationCodeText.y = canvasSize.height / 2;

    const handleCopyButtonClick = () => {
      navigator.clipboard.writeText(this.playerId);
    };

    const copyButton = createButton(
      {
        width: 150,
        height: 100,
        x: canvasSize.width / 2 + 300,
        y: canvasSize.height / 2 + 200,
        color: 0xcb90e8,
      },
      "복사",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      handleCopyButtonClick
    );

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
      playerBox,
      playerText,
      playerCharacter,
      invitationCodeBox,
      invitationCodeTitle,
      invitationCodeText,
      copyButton,
      backButton,
      gameStartButton
    );
  }
}
