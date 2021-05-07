import * as PIXI from "pixi.js";

export default class App {
  run() {
    this.app = new PIXI.Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0xeeeeee,
    });

    const $container = document.querySelector(".container");
    $container.appendChild(this.app.view);
  }
}
