import * as PIXI from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";

const createBox = (boxOption) => {
  const {
    width,
    height,
    x,
    y,
    color,
    radius = 20,
    borderWidth = 0,
    borderColor = 0x000000,
    borderAlpha = 1,
    borderAlignment = 1,
  } = boxOption;

  const box = new PIXI.Graphics();

  box
    .lineStyle(borderWidth, borderColor, borderAlpha, borderAlignment)
    .beginFill(color)
    .drawRoundedRect(
      x,
      y,
      width,
      height,
      radius
    )
    .endFill();

  box.pivot.set(
    width / 2,
    height / 2
  );

  box.filters = [new DropShadowFilter()];

  return box;
};

export default createBox;
