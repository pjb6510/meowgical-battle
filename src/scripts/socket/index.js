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

const leaveGame = (playerId, invitationCode) => {
  socket.emit("leaveGame", { playerId, invitationCode });
};

const subscribeJoinResult = (handleListenJoinResult) => {
  socket.on("notifyJoinResult", handleListenJoinResult);
};

const unsubscribeJoinResult = () => {
  socket.off("notifyJoinResult");
};

const subscribeRoomState = (handleListenGameEntrance) => {
  socket.on("notifyRoomState", handleListenGameEntrance);
};

const unsubscribeRoomState = () => {
  socket.off("notifyRoomState");
};

export default {
  createGame,
  removeGame,
  joinGame,
  leaveGame,
  subscribeJoinResult,
  unsubscribeJoinResult,
  subscribeRoomState,
  unsubscribeRoomState,
};
