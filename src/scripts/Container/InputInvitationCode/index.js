import * as PIXI from "pixi.js";
import PixiTextInput from "pixi-text-input";
import createBox from "../../pixiUtils/createBox";
import createButton from "../../pixiUtils/createButton";
import { canvasSize } from "../../config";
import { getState } from "../../redux";
import socket from "../../socket";

export default class InputInvitationCode {
  constructor(parent) {
    this.parent = parent;

    socket.subscribeJoinResult(
      this.handleJoinResultListen.bind(this)
    );

    this.container = new PIXI.Container();
    this.playerId = getState().playerId;
    this.invitationCodeInputFormat = /\w{0,7}/;
    this.invitationCodeFormat = /\w{7}/;

    this.backButton = null;
    this.wrapper = null;
    this.title = null;
    this.InputText = null;
    this.connectButton = null;
    this.message = null;
    this.invitationCode = "";
    this.createInputInvitationCode();
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
    this.InputText = new PixiTextInput({
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
    this.InputText.pivot.set(
      this.InputText.width / 2,
      this.InputText.height / 2
    );
    this.InputText.x = canvasSize.width / 2;
    this.InputText.y = canvasSize.height / 2;
    this.InputText.restrict = this.invitationCodeInputFormat;

    this.container.addChild(this.InputText);
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

  createInputInvitationCode() {
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
    this.invitationCode = this.InputText.text;

    if (!this.invitationCodeFormat.test(this.invitationCode)) {
      this.setMessage("초대코드는 영어와 숫자로 이루어진 \n7글자 코드입니다.");
      return;
    }

    socket.joinGame(this.playerId, this.invitationCode);
  }

  containerWillUnmount() {
    socket.unsubscribeJoinResult();
    this.InputText.htmlInput.remove();
  }

  handleBackButtonClick() {
    this.containerWillUnmount();
    this.parent.removeInputInvitationCode();
    this.parent.createMenu();
  }

  showGuestWindow() {
    this.containerWillUnmount();
    this.parent.removeInputInvitationCode();
    this.parent.createGuestWindow(this.invitationCode);
  }

  handleJoinResultListen(data) {
    const { result, message } = data;

    if (!result) {
      this.setMessage(message);
      return;
    }

    this.setMessage("연결");
    this.showGuestWindow();
  }
}
