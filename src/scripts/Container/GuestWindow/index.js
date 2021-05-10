import * as PIXI from "pixi.js";
import PixiTextInput from "pixi-text-input";
import createBox from "../../pixiUtils/createBox";
import createButton from "../../pixiUtils/createButton";
import { canvasSize } from "../../config";
import socket from "../../socket";
import { getState } from "../../redux";

export default class GuestWindow {
  constructor(handleBackButtonClick) {
    this.handleBackButtonClick = handleBackButtonClick;

    socket.subscribeJoinGameResult(
      this.handleListenJoinGameResult.bind(this)
    );

    this.container = new PIXI.Container();
    this.playerId = getState().playerId;
    this.invitationCodeInputFormat = /\w{0,7}/;
    this.invitationCodeFormat = /\w{7}/;

    this.backButton = null;
    this.wrapper = null;
    this.title = null;
    this.textInput = null;
    this.connectButton = null;
    this.message = null;
    this.createGuestWindow();
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
      this.handleBackButtonClick
    );

    this.container.addChild(this.backButton);
  }

  createWrapper() {
    this.wrapper = createBox({
      width: 700,
      height: 600,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0x82c9f5,
    });

    this.container.addChild(this.wrapper);
  }

  createTitle() {
    this.title = new PIXI.Text(
      "초대코드 입력",
      {
        fontFamily: "sans-serif",
        fontSize: 50,
        align: "center",
      }
    );
    this.title.anchor.set(0.5, 0.5);
    this.title.x = canvasSize.width / 2;
    this.title.y = canvasSize.height / 2 - 200;

    this.container.addChild(this.title);
  }

  createTextInput() {
    this.textInput = new PixiTextInput({
      input: {
        fontSize: "36px",
        padding: "12px",
        height: "50px",
        width: "350px",
        color: "#26272E",
        textAlign: "center",
      },
      box: {
        default: {
          fill: 0xE8E9F3,
          rounded: 12,
          stroke: { color: 0xCBCEE0, width: 3 },
        },
      },
    });
    this.textInput.pivot.set(
      this.textInput.width / 2,
      this.textInput.height / 2
    );
    this.textInput.x = canvasSize.width / 2;
    this.textInput.y = canvasSize.height / 2;
    this.textInput.restrict = this.invitationCodeInputFormat;

    this.container.addChild(this.textInput);
  }

  createConnectButton() {
    this.connectButton = createButton(
      {
        width: 200,
        height: 100,
        x: canvasSize.width / 2,
        y: canvasSize.height - 120,
        color: 0x3a8ec7,
      },
      "연결",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      this.handleConnectButtonClick.bind(this)
    );

    this.container.addChild(this.connectButton);
  }

  createMessage() {
    this.message = new PIXI.Text(
      "코드를 입력해주세요.",
      {
        fontFamily: "sans-serif",
        fontSize: 30,
        fill: "red",
      }
    );
    this.message.anchor.set(0.5, 0.5);
    this.message.x = canvasSize.width / 2;
    this.message.y = canvasSize.height / 2 + 150;

    this.container.addChild(this.message);
  }

  createGuestWindow() {
    this.createBackButton();
    this.createWrapper();
    this.createTitle();
    this.createTextInput();
    this.createMessage();
    this.createConnectButton();
  }

  setMessage(message) {
    this.message.text = message;
  }

  handleConnectButtonClick() {
    const inputtedCode = this.textInput.text;

    if (!this.invitationCodeFormat.test(inputtedCode)) {
      this.setMessage("초대코드는 영어와 숫자로 이루어진 \n7글자 코드입니다.");
      return;
    }

    this.setMessage("연결 중");
    socket.joinGame(this.playerId, inputtedCode);
  }

  handleListenJoinGameResult(data) {
    const { result, message } = data;

    if (!result) {
      this.setMessage(message);
      return;
    }

    this.setMessage("연결");
  }
}
