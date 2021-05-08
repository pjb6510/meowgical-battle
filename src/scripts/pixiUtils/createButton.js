import * as PIXI from "pixi.js";
import createBox from "./createBox";

const createButton = (boxOption, text, textOption, onClick) => {
  const { x, y } = boxOption;

  const container = new PIXI.Container();

  const buttonBox = createBox(boxOption);
  buttonBox.interactive = true;
  buttonBox.buttonMode = true;
  buttonBox.on("pointerdown", onClick);

  const buttonText = new PIXI.Text(text, textOption);
  buttonText.anchor.set(0.5, 0.5);
  buttonText.x = x;
  buttonText.y = y;

  container.addChild(buttonBox, buttonText);

  return container;
};

export default createButton;
