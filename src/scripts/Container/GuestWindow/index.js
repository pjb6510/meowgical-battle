import * as PIXI from "pixi.js";
import PlayerBox from "../shared/PlayerBox";
import createButton from "../../pixiUtils/createButton";
import { canvasSize } from "../../config";
import { getState } from "../../redux";
import socket from "../../socket";

export default class GuestWindow {
  constructor(parent, invitationCode) {
    this.parent = parent;
    this.invitationCode = invitationCode;
    this.container = new PIXI.Container();
    this.playerId = getState().playerId;

    socket.subscribeRoomState(
      this.handleRoomStateListen.bind(this)
    );

    this.createGuestWindow();
  }

  createPlayerBox() {
    this.playerBox = new PlayerBox(false, "나");
    this.container.addChild(this.playerBox.container);
  }

  createOpponetBox() {
    this.opponentBox = new PlayerBox(true, "상대");
    this.container.addChild(this.opponentBox.container);
  }

  createBackButton() {
    this.backButton = createButton(
      {
        width: 200,
        height: 100,
        x: 200,
        y: canvasSize.height - 300,
        color: 0x32b3a2,
      },
      "돌아가기",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      this.handleBackButtonClick.bind(this)
    );

    this.container.addChild(this.backButton);
  }

  createGuestWindow() {
    this.createPlayerBox();
    this.createOpponetBox();
    this.createBackButton();
  }

  containerWillUnmount() {
    socket.leaveGame(this.playerId, this.invitationCode);
    socket.unsubscribeRoomState();
  }

  handleBackButtonClick() {
    this.containerWillUnmount();
    this.parent.removeGuestWindow();
    this.parent.createMenu();
  }

  handleRoomStateListen(data) {
    const { action, payload } = data;

    if (action === "entrance" && !payload) {
      this.handleBackButtonClick();
    }
  }
}
