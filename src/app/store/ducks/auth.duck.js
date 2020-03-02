import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import * as routerHelpers from "../../router/RouterHelpers";
import { getUser } from "../../crud/auth.crud";
import { actions as cropActions } from "./crops.duck";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",

  GetUser: "[GetUser] Action",
  UserSuccess: "[GetUser] Success",
  UserFail: "[GetUser] Fail",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
};

export const reducer = persistReducer(
  { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;

        return { ...state, user };
      }

      case actionTypes.GetUser: {
        return { ...state, user: { ...state.user, loading: true } };
      }

      case actionTypes.UserSuccess: {
        const { data } = action.payload;
        return { ...state, user: data};
      }

      case actionTypes.UserFail: {
        return { ...state, user: {...state.user, loading: false}}
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } }),

  getUser: () => ({type: actionTypes.GetUser}),
  userSuccess: data => ({type: actionTypes.UserSuccess, payload: {data}}),
  userFail : () => ({type: actionTypes.UserFail})
};


function* getUserSaga(){
  try{
    const {data} = yield getUser();
    if(data && data.data){
      yield put(actions.userSuccess(data.data));
    }
  }catch{
    yield put(actions.userFail());
  }
}

export function* saga() {
  yield takeLatest(actionTypes.Logout, function* logoutSaga() {
    yield put(cropActions.logout());
  });
  yield takeLatest(actionTypes.GetUser, getUserSaga);
}
