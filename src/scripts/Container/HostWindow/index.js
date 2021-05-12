import * as PIXI from "pixi.js";
import PlayerBox from "../shared/PlayerBox";
import InvitationCodeBox from "./InvitationCodeBox";
import Battle from "../Battle";
import createButton from "../../pixiUtils/createButton";
import { canvasSize } from "../../config";
import { getState, dispatch } from "../../redux";
import { setScene } from "../../redux/actions";
import socket from "../../socket";
import { broadcastedActions } from "../constants";
import Peer from "simple-peer";

export default class HostWindow {
  constructor(unmount) {
    this.unmount = unmount;
    this.isConnected = false;
    this.rightPlayerTexture = getState()
      .resources
      .rightPlayer
      .texture;
    this.playerId = getState().playerId;

    socket.createGame(this.playerId);
    socket.subscribeRoomState(
      this.handleRoomStateListen.bind(this)
    );

    this.peer = null;

    this.container = new PIXI.Container();
    this.playerBox = null;
    this.opponentBox = null;
    this.backButton = null;
    this.gameStartButton = null;
    this.createHostWindow();
  }

  createPlayerBox() {
    this.playerBox = new PlayerBox(true, "나");
    this.container.addChild(this.playerBox.container);
  }

  createOpponentBox() {
    if (this.isConnected) {
      this.opponentBox = new PlayerBox(false, "상대");
    } else {
      this.opponentBox = new InvitationCodeBox(this.playerId);
    }

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

  createGameStartButton() {
    this.gameStartButton = createButton(
      {
        width: 200,
        height: 100,
        x: canvasSize.width / 2,
        y: canvasSize.height - 120,
        color: this.isConnected ? 0x3a8ec7 : 0x6e6e6e,
      },
      "게임시작",
      {
        fontFamily: "sans-serif",
        fontSize: 40,
        align: "center",
        fill: 0xffffff,
      },
      this.handleGameStartButtonClick.bind(this)
    );

    if (!this.isConnected) {
      const buttonBox = this.gameStartButton.children[0];
      buttonBox.interactive = false;
      buttonBox.buttonMode = false;
    }

    this.container.addChild(this.gameStartButton);
  }

  createHostWindow() {
    this.createPlayerBox();
    this.createOpponentBox();
    this.createBackButton();
    this.createGameStartButton();
  }

  rerenderOpponentBox() {
    this.container.removeChild(this.opponentBox.container);
    this.createOpponentBox();
  }

  rerenderGameStartButton() {
    this.container.removeChild(this.gameStartButton);
    this.createGameStartButton();
  }

  handleBackButtonClick() {
    this.containerWillUnmount();
    this.unmount(this);
  }

  containerWillUnmount() {
    socket.unsubscribeRoomState();
    socket.removeGame(this.playerId);
  }

  handleRoomStateListen(data) {
    const { action, payload } = data;

    switch (action) {
      case broadcastedActions.ENTER:
        this.isConnected = payload;
        this.rerenderOpponentBox();
        this.rerenderGameStartButton();
        break;
      case broadcastedActions.SEND_PEER:
        this.receivePeerSignal(payload);
        break;
      default:
        break;
    }
  }

  handleGameStartButtonClick() {
    this.sendPeerSignal();
  }

  sendPeerSignal() {
    this.peer = new Peer({
      initiator: true,
      trickle: false,
      objectMode: true,
    });

    this.peer.on("signal", (hostSignal) => {
      socket.broadcastAction({
        action: broadcastedActions.SEND_PEER,
        payload: hostSignal,
        from: this.playerId,
      });
    });

    this.peer.on("error", (err) => {
      console.error(err);
    });

    this.peer.on("connect", () => {
      console.log("connect complete");
      this.peer.send("hello!!");
    });

    this.peer.on("data", (data) => {
      console.log(data);
    });
  }

  receivePeerSignal(receivedSignal) {
    this.peer.signal(receivedSignal);
  }

  startGame() {
    socket.broadcastAction({
      action: broadcastedActions.START_GAME,
      from: this.playerId,
    });

    dispatch(setScene(new Battle()));
  }
}
