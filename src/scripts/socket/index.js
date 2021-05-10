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

const subscribeEntrance = (handleListenGameEntrance) => {
  socket.on("notifyEntrance", handleListenGameEntrance);
};

const unsubscribeEntrance = () => {
  socket.off("notifyEntrance");
};

export default {
  createGame,
  removeGame,
  joinGame,
  leaveGame,
  subscribeJoinResult,
  unsubscribeJoinResult,
  subscribeEntrance,
  unsubscribeEntrance,
};
