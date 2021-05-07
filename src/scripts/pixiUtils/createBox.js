import * as PIXI from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

const createBox = ({ width, height, x, y, color }) => {
  const box = new PIXI.Graphics();
  box.beginFill(color);
  box.drawRoundedRect(
    x,
    y,
    width,
    height,
    20
  );

  box.pivot.set(
    width / 2,
    height / 2
  );

  box.filters = [new DropShadowFilter()];

  return box;
};

export default createBox;
