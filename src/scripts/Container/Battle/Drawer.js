import * as PIXI from "pixi.js";
import { canvasSize } from "../../config";

export default class Drawer {
  constructor() {
    this.canvas = null;
    this.lineStyle = {
      width: 12,
      color: 0x345b99,
      cap: "round",
    };

    this.pointerStartPos = { x: 0, y: 0 };
    this.strokeRecognitionDistance = 16;
    this.strokeDirections = [];

    this.createCanvas();
  }

  createCanvas() {
    this.canvas = new PIXI.Graphics();
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
    this.strokeDirections = [];
  }
}
