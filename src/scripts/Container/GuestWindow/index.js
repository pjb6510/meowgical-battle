import * as PIXI from "pixi.js";
import PlayerBox from "../shared/PlayerBox";
import Battle from "../Battle";
import createButton from "../../pixiUtils/createButton";
import { canvasSize } from "../../config";
import { getState, dispatch } from "../../redux";
import { setScene } from "../../redux/actions";
import socket from "../../socket";
import { broadcastedActions } from "../constants";
import Peer from "simple-peer";

export default class GuestWindow {
  constructor(unmount, invitationCode) {
    this.unmount = unmount;
    this.invitationCode = invitationCode;
    this.container = new PIXI.Container();
    this.playerId = getState().playerId;

    socket.subscribeRoomState(
      this.handleRoomStateListen.bind(this)
    );

    this.peer = null;

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
    this.unmount(this);
  }

  handleRoomStateListen(data) {
    const { action, payload } = data;

    switch (action) {
      case broadcastedActions.ENTER:
        if (!payload) {
          this.handleBackButtonClick();
        }
        break;
      case broadcastedActions.START_GAME:
        dispatch(setScene(new Battle()));
        break;
      case broadcastedActions.SEND_PEER:
        this.receiveAndSendPeer(payload);
        break;
      default:
        break;
    }
  }

  receiveAndSendPeer(receivedSignal) {
    this.peer = new Peer({
      initiator: false,
      trickle: false,
      objectMode: true,
    });

    this.peer.signal(receivedSignal);

    this.peer.on("error", (err) => {
      console.error(err);
    });

    this.peer.on("connect", () => {
      console.log("connect complete");
    });

    this.peer.on("signal", (guestSignal) => {
      socket.broadcastAction({
        action: broadcastedActions.SEND_PEER,
        payload: guestSignal,
        from: this.playerId,
      });
    });

    this.peer.on("data", (data) => {
      console.log(data);
    });
  }
}
