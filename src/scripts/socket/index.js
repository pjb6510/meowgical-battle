import socketIOClient from "socket.io-client";

const socket = socketIOClient(
  `http://localhost:${process.env.SERVER_PORT}`
);

const createGame = (playerId) => {
  socket.emit("createGame", { playerId });
};

const removeGame = (playerId) => {
  socket.emit("removeGame", { playerId });
};

const joinGame = (playerId, invitationCode) => {
  socket.emit("joinGame", { playerId, invitationCode });
};

const subscribeJoinGameResult = (handleListenJoinGameResult) => {
  socket.on("notifyJoinResult", handleListenJoinGameResult);
};

const unsubscribeJoinGameResult = () => {
  socket.off("notifyJoinResult");
};

const subscribeGameEntrance = (handleListenGameEntrance) => {
  socket.on("notifyEntrance", handleListenGameEntrance);
};

const unsubscribeGameEntrance = () => {
  socket.off("notifyEntrance");
};

export default {
  createGame,
  removeGame,
  joinGame,
  subscribeJoinGameResult,
  unsubscribeJoinGameResult,
  subscribeGameEntrance,
  unsubscribeGameEntrance,
};
