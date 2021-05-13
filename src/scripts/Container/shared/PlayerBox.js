import * as PIXI from "pixi.js";
import createBox from "../../pixiUtils/createBox";
import { canvasSize } from "../../config";
import globalStore from "../../globalStore";

export default class PlayerBox {
  constructor(isLeft, titleText) {
    this.isLeft = isLeft;
    this.titleText = titleText;
    this.container = new PIXI.Container();

    const leftCharacterTexture = globalStore
      .getItem("resources")
      .leftPlayer
      .texture;
    const rightCharacterTexture = globalStore
      .getItem("resources")
      .rightPlayer
      .texture;
    this.characterTextrue = this.isLeft ? leftCharacterTexture : rightCharacterTexture;
    this.xOffset = this.isLeft ? -300 : 300;

    this.wrapper = null;
    this.title = null;
    this.character = null;

    this.createWrapper();
    this.createTitle();
    this.createCharacter();

    this.render();
  }

  createWrapper() {
    this.wrapper = createBox({
      width: 500,
      height: 600,
      x: canvasSize.width / 2 + this.xOffset,
      y: canvasSize.height / 2,
      color: 0xffffff,
      borderWidth: 10,
      borderColor: 0x82c9f5,
    });
  }

  createTitle() {
    this.title = new PIXI.Text(
      this.titleText,
      {
        fontFamily: "sans-serif",
        fontSize: 50,
        align: "center",
      }
    );
    this.title.anchor.set(0.5, 0.5);
    this.title.x = canvasSize.width / 2 + this.xOffset;
    this.title.y = canvasSize.height / 2 - 200;
  }

  createCharacter() {
    this.character = new PIXI.Sprite(this.characterTextrue);
    this.character.anchor.set(0.5, 0.5);
    this.character.x = canvasSize.width / 2 + this.xOffset;
    this.character.y = canvasSize.height / 2 + 50;
    this.character.scale.set(0.5);
  }

  render() {
    this.container.addChild(
      this.wrapper,
      this.title,
      this.character
    );
  }
}
