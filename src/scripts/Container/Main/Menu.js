import * as PIXI from "pixi.js";
import createBox from "../../pixiUtils/createBox";
import { canvasSize } from "../../config";

export default class Menu {
  constructor({ offsetX, offsetY }, ...buttonInfos) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.buttonInfos = buttonInfos;

    this.container = new PIXI.Container();
    this.createMenu();
  }

  createMenu() {
    for (let i = 0; i < this.buttonInfos.length; i += 1) {
      const buttonInfo = this.buttonInfos[i];
      const currentButtonY = this.offsetY + (150 * i);

      const button = createBox({
        width: 350,
        height: 100,
        x: canvasSize.width / 2 + this.offsetX,
        y: canvasSize.height + currentButtonY,
        color: 0xffffff,
        borderWidth: 10,
        borderColor: 0x82c9f5,
      });

      button.interactive = true;
      button.buttonMode = true;
      button.on("pointerdown", buttonInfo.event);

      const buttonText = new PIXI.Text(
        buttonInfo.text,
        {
          fontFamily: "sans-serif",
          fontSize: 60,
          align: "center",
        }
      );
      buttonText.anchor.set(0.5, 0.5);
      buttonText.x = canvasSize.width / 2 + this.offsetX;
      buttonText.y = canvasSize.height + currentButtonY;

      this.container.addChild(
        button,
        buttonText
      );
    }
  }
}
