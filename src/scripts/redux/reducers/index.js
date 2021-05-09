import {
  SET_PLAYER_ID,
  SET_RESOURCES,
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
    default:
      return state;
  }
};

export default reducer;
