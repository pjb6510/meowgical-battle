import { canvasSize } from "../../config";

const mixinSetBattleElementsOptions = {
  setStatusBarOptions() {
    this.statusBarDistance = 500;

    this.playerStatusBarOption = {
      x: canvasSize.width / 2 - this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isHost: this.isHost,
    };
    this.opponentStatusBarOption = {
      x: canvasSize.width / 2 + this.statusBarDistance,
      y: canvasSize.height / 2 - 400,
      isHost: !this.isHost,
    };
  },

  setTileOptions() {
    this.tileGroupGap = 440;
    this.tileGroupYOffset = 300;
    this.tileGroupSize = {
      row: 4,
      column: 4,
    };

    this.tileGap = 20;
    this.tileSize = {
      width: 200,
      height: 80,
    };
    this.tileBorderWidth = 10;

    this.hostPlayerTileColor = 0xa8e8ca;
    this.guestPlayerTileColor = 0x9abeff;

    this.playerTileGroupPosition = {
      x: canvasSize.width / 2 - this.tileGroupGap,
      y: canvasSize.height / 2 + this.tileGroupYOffset,
    };
    this.opponentTileGroupPosition = {
      x: canvasSize.width / 2 + this.tileGroupGap,
      y: canvasSize.height / 2 + this.tileGroupYOffset,
    };

    this.playerFirstTilePosition = {
      x: this.playerTileGroupPosition.x -
        (this.tileSize.width / 2) -
        this.tileGap -
        this.tileSize.width,
      y: this.playerTileGroupPosition.y -
        (this.tileSize.height / 2) -
        this.tileGap -
        this.tileSize.height,
    };
    this.opponentFirstTilePosition = {
      x: this.opponentTileGroupPosition.x +
        (this.tileSize.width / 2) +
        this.tileGap +
        this.tileSize.width,
      y: this.opponentTileGroupPosition.y -
        (this.tileSize.height / 2) -
        this.tileGap -
        this.tileSize.height,
    };

    this.playerTileGroupOption = {
      x: this.playerTileGroupPosition.x,
      y: this.playerTileGroupPosition.y,
      row: this.tileGroupSize.row,
      column: this.tileGroupSize.column,
      tileWidth: this.tileSize.width,
      tileHeight: this.tileSize.height,
      tileBorderWidth: this.tileBorderWidth,
      tileBorderColor: this.isHost
        ? this.hostPlayerTileColor
        : this.guestPlayerTileColor,
      tileXGap: this.tileGap,
      tileYGap: this.tileGap,
    };
    this.opponentTileGroupOption = {
      x: this.opponentTileGroupPosition.x,
      y: this.opponentTileGroupPosition.y,
      row: this.tileGroupSize.row,
      column: this.tileGroupSize.column,
      tileWidth: this.tileSize.width,
      tileHeight: this.tileSize.height,
      tileBorderWidth: this.tileBorderWidth,
      tileBorderColor: this.isHost
        ? this.guestPlayerTileColor
        : this.hostPlayerTileColor,
      tileXGap: this.tileGap,
      tileYGap: this.tileGap,
    };
  },

  setPlayersOptions() {
    this.playerOption = {
      isHost: this.isHost,
      isHeadingToRight: true,
      x: this.playerFirstTilePosition.x,
      y: this.playerFirstTilePosition.y,
      columnIndex: 0,
      rowIndex: 0,
      columnRange: this.tileGroupSize.column,
      rowRange: this.tileGroupSize.row,
      xMovingDistance: this.tileSize.width + this.tileGap,
      yMovingDistance: this.tileSize.height + this.tileGap,
    };
    this.opponentOption = {
      isHost: !this.isHost,
      isHeadingToRight: false,
      x: this.opponentFirstTilePosition.x,
      y: this.opponentFirstTilePosition.y,
      columnIndex: this.tileGroupSize.column - 1,
      rowIndex: 0,
      columnRange: this.tileGroupSize.column,
      rowRange: this.tileGroupSize.row,
      xMovingDistance: this.tileSize.width + this.tileGap,
      yMovingDistance: this.tileSize.height + this.tileGap,
    };
  },
};

export default mixinSetBattleElementsOptions;
