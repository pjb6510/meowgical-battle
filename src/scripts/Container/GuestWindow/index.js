import * as PIXI from "pixi.js";
import PixiTextInput from "pixi-text-input";
import createBox from "../../pixiUtils/createBox";
import createButton from "../../pixiUtils/createButton";
import { canvasSize } from "../../config";

export default class GuestWindow {
  constructor(onBackButtonClick) {
    this.onBackButtonClick = onBackButtonClick;
    this.container = new PIXI.Container();

    this.backButton = null;
    this.wrapper = null;
    this.title = null;
    this.textInput = null;
    this.submitButton = null;
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
      this.onBackButtonClick
    );

    this.container.addChild(this.backButton);
  }

  createWrapper() {
    this.wrapper = createBox({
      width: 700,
      height: 500,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0xcb90e8,
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
    this.title.y = canvasSize.height / 2 - 80;

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
    this.textInput.y = canvasSize.height / 2 + 80;
    this.textInput.restrict = /\w{0,7}/;

    this.container.addChild(this.textInput);
  }

  createSubmitButton() {
    this.submitButton = createButton(
      {
        width: 200,
        height: 100,
        x: canvasSize.width / 2,
        y: canvasSize.height - 120,
        color: 0xcb90e8,
      },
      "연결",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      () => {}
    );

    this.container.addChild(this.submitButton);
  }

  createGuestWindow() {
    this.createBackButton();
    this.createWrapper();
    this.createTitle();
    this.createTextInput();
    this.createSubmitButton();
  }
}
