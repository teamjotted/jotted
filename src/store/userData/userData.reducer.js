//created by talbert herndon

import Types from "./userData.type";

const initialState = {
  user: null,
};

const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.getUserData:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export default userDataReducer;
