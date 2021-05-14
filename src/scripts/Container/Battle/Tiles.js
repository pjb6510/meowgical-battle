import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class Tiles {
  constructor({
    x,
    y,
    tileWidth,
    tileHeight,
    tileBorderWidth,
    tileBorderColor,
    tilesXDistance,
    tilesYDistance,
  }) {
    this.x = x;
    this.y = y;
    this.tileBorderColor = tileBorderColor;
    this.tileBorderWidth = tileBorderWidth;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    console.log(this.x);
    console.log(this.y);

    this.container = new PIXI.Container();

    this.row = 4;
    this.column = 4;
    this.tilesXDistance = tilesXDistance;
    this.tilesYDistance = tilesYDistance;
    this.width =
      (this.tileWidth + this.tilesXDistance) *
        (this.row - 1) +
        this.tileWidth;
    this.height =
      (this.tileHeight + this.tilesYDistance) *
        (this.column - 1) +
        this.tileHeight;

    console.log(this.width, this.height);

    this.container.pivot.set(this.width / 2, this.height / 2);

    this.tileOption = {
      x: this.x,
      y: this.y,
      width: this.tileWidth,
      height: this.tileHeight,
      borderWidth: this.tileBorderWidth,
      borderColor: this.tileBorderColor,
    };

    this.tiles = [];

    this.createTiles();
    this.render();
  }

  createTiles() {
    for (let i = 0; i < this.row; i += 1) {
      const row = [];

      this.tileOption.y =
        this.y +
          (this.tileHeight + this.tilesYDistance) *
          i;

      for (let j = 0; j < this.column; j += 1) {
        this.tileOption.x =
          this.x +
            (this.tileWidth + this.tilesXDistance) *
            j;

        const tile = new Tile(this.tileOption);
        row.push(tile);
      }

      this.tileOption.x = this.x;

      this.tiles.push(row);
    }
  }

  render() {
    for (let i = 0; i < this.tiles.length; i += 1) {
      const row = this.tiles[i];

      for (let j = 0; j < row.length; j += 1) {
        const tile = row[j];
        this.container.addChild(tile.rect);
      }
    }
  }
}
