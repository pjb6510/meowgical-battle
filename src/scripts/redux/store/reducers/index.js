import { SET_SCENE } from "../constants/index";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SCENE:
      return { ...state, scene: action.scene };
    default:
      return state;
  }
};

export default reducer;
