import {
  SET_SCENE,
  SET_RESOURCES,
  SET_PLAYER_ID,
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
