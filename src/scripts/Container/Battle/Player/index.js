import * as PIXI from "pixi.js";
import globalStore from "../../../globalStore";

export default class Player {
  constructor({ x, y, isLeftPlayer }) {
    this.x = x;
    this.y = y;
    this.isLeftPlayer = isLeftPlayer;

    this.container = new PIXI.Container();

    if (this.isLeftPlayer) {
      const {
        leftPlayer,
      } = globalStore.getItem("resources");

      this.playerTexture = leftPlayer.texture;
    } else {
      const {
        rightPlayer,
      } = globalStore.getItem("resources");

      this.playerTexture = rightPlayer.texture;
    }

    this.anchor = {
      x: 0.5,
      y: 0.85,
    };

    this.player = null;
    this.createPlayer();
    this.render();
  }

  createPlayer() {
    this.player = new PIXI.Sprite(this.playerTexture);
    this.player.x = this.x;
    this.player.y = this.y;
    this.player.scale.set(0.5);
    this.player.anchor.set(
      this.anchor.x,
      this.anchor.y
    );
  }

  render() {
    this.container.addChild(this.player);
  }
}
