import {
  SET_PLAYER_ID,
  SET_RESOURCES,
  SET_ROOM_CODE,
  SET_SCENE,
} from "../constants/index";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SCENE:
      return {
        ...state,
        scene: action.scene,
      };
    case SET_RESOURCES:
      return {
        ...state,
        resources: action.resources,
      };
    case SET_PLAYER_ID:
      return {
        ...state,
        playerId: action.playerId,
      };
    case SET_ROOM_CODE:
      return {
        ...state,
        roomCode: action.roomCode,
      };
    default:
      return state;
  }
};

export default reducer;
