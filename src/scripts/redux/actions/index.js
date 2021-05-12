import {
  SET_SCENE,
  SET_RESOURCES,
  SET_PLAYER_ID,
  SET_ROOM_CODE,
} from "../constants";

export const setScene = (scene) => ({
  type: SET_SCENE,
  scene,
});

export const setResources = (resources) => ({
  type: SET_RESOURCES,
  resources,
});

export const setPlayerId = (playerId) => ({
  type: SET_PLAYER_ID,
  playerId,
});

export const setRoomCode = (roomCode) => ({
  type: SET_ROOM_CODE,
  roomCode,
});
