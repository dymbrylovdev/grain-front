import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  Legacy: "[Legacy] Action",
};

const initialDocState = {
  legacy: ""
};

export const reducer = persistReducer(
    { storage, key: "demo1-auth" },
    (state = initialDocState, action) => {
      switch (action.type) {
        case actionTypes.Legacy: {
          const { data } = action.payload;

          return { ...state, legacy: data };
        }

        default:
          return state;
      }
    }
);

export const actions = {
  legacy: data => ({ type: actionTypes.Legacy, payload: { data } }),
};