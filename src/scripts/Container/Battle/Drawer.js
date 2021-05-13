import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";
import { getState } from "../../redux";

export default class Drawer {
  constructor() {
    this.container = new PIXI.Container();
    this.container.sortableChildren = true;

    this.lineStyle = {
      width: 12,
      color: 0xd2ff1e,
      cap: "round",
    };

    this.leftArrowTexture = getState()
      .resources.leftArrow.texture;
    this.rightArrowTexture = getState()
      .resources.rightArrow.texture;
    this.upArrowTexture = getState()
      .resources.upArrow.texture;
    this.downArrowTexture = getState()
      .resources.downArrow.texture;

    this.arrows = [];
    this.arrowPosition = { x: 0, y: 0 };

    this.pointerStartPos = { x: 0, y: 0 };
    this.strokeRecognitionDistance = 16;
    this.strokeDirections = [];

    this.canvas = null;
    this.createCanvas();
  }

  createCanvas() {
    this.canvas = new PIXI.Graphics();
    this.canvas.zIndex = 1;
    this.canvas.hitArea = new PIXI.Rectangle(
      0,
      0,
      canvasSize.width,
      canvasSize.height
    );

    this.isPointerDown = false;

    this.canvas.interactive = true;
    this.canvas.on(
      "pointerdown",
      this.handlePointerDown.bind(this)
    );
    this.canvas.on(
      "pointermove",
      this.handlePointerMove.bind(this)
    );
    this.canvas.on(
      "pointerup",
      this.handlePointerUp.bind(this)
    );

    this.container.addChild(this.canvas);
  }

  handlePointerDown(e) {
    this.isPointerDown = true;
    this.canvas.lineStyle(this.lineStyle);

    const { x, y } = e.data.global;
    this.updatePointerStartPos(x, y);
  }

  handlePointerMove(e) {
    if (!this.isPointerDown) {
      return;
    }

    const { x, y } = e.data.global;

    const { x: startX, y: startY } = this.pointerStartPos;

    const leftX = startX - this.strokeRecognitionDistance;
    const rightX = startX + this.strokeRecognitionDistance;
    const topY = startY - this.strokeRecognitionDistance;
    const bottomY = startY + this.strokeRecognitionDistance;

    let isOverRecognitionDistance = true;
    let strokeDirection = "";

    if (x < leftX) {
      strokeDirection = "left";
    } else if (x > rightX) {
      strokeDirection = "right";
    } else if (y < topY) {
      strokeDirection = "up";
    } else if (y > bottomY) {
      strokeDirection = "down";
    } else {
      isOverRecognitionDistance = false;
    }

    if (isOverRecognitionDistance) {
      this.updatePointerStartPos(x, y);
      this.createArrow(strokeDirection);
      this.addStrokeDirection(strokeDirection);
      this.drawLine(startX, startY, x, y);
    }
  }

  updatePointerStartPos(x, y) {
    this.pointerStartPos = { x, y };
  }

  addStrokeDirection(direction) {
    const lastStrokeDirection =
      this.strokeDirections[this.strokeDirections.length - 1];

    if (lastStrokeDirection !== direction) {
      this.strokeDirections.push(direction);
    }
  }

  drawLine(startX, startY, endX, endY) {
    this.canvas.moveTo(startX, startY);
    this.canvas.lineTo(endX, endY);
  }

  handlePointerUp() {
    this.isPointerDown = false;
    this.canvas.clear();
    this.clearArrows();
    console.log(this.strokeDirections);
    this.strokeDirections = [];
  }

  createArrow(direction) {
    const lastStrokeDirection =
      this.strokeDirections[this.strokeDirections.length - 1];

    if (lastStrokeDirection === direction) {
      return;
    }

    let arrow = null;
    const {
      x: arrowXPos,
      y: arrowYPos,
    } = this.arrowPosition;

    switch (direction) {
      case "left":
        arrow = new PIXI.Sprite(this.leftArrowTexture);
        break;
      case "right":
        arrow = new PIXI.Sprite(this.rightArrowTexture);
        break;
      case "up":
        arrow = new PIXI.Sprite(this.upArrowTexture);
        break;
      case "down":
        arrow = new PIXI.Sprite(this.downArrowTexture);
        break;
      default:
        break;
    }

    arrow.x = arrowXPos;
    arrow.y = arrowYPos;
    arrow.width = 100;
    arrow.height = 100;
    this.arrowPosition.x += arrow.width;

    this.arrows.push(arrow);
    this.container.addChild(arrow);
  }

  clearArrows() {
    for (let i = 0; i < this.arrows.length; i += 1) {
      this.container.removeChild(this.arrows[i]);
    }

    this.arrowPosition = { x: 0, y: 0 };
  }
}
