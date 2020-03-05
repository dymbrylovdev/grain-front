import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, call } from "redux-saga/effects";
import * as routerHelpers from "../../router/RouterHelpers";
import { getUser, setUser } from "../../crud/auth.crud";
import { actions as cropActions } from "./crops.duck";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",

  EditUser: "[EditMyUser] Action",
  EditUserSuccess: "[EditMyUserSuccess] Action",

  GetUser: "[GetUser] Action",
  UserSuccess: "[GetUser] Success",
  UserFail: "[GetUser] Fail",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  errors: {},
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

      case actionTypes.EditUserSuccess: {
        const { user } = action.payload;

        return { ...state, user };
      }

      case actionTypes.GetUser: {
        return { ...state, user: { ...state.user, loading: true }, errors: {} };
      }

      case actionTypes.UserSuccess: {
        const { data } = action.payload;
        return { ...state, user: data};
      }

      case actionTypes.UserFail: {
        return { ...state, user: {...state.user, loading: false}, errors: { get: true}}
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

  getUser: () => ({type: actionTypes.GetUser }),
  userSuccess: data => ({type: actionTypes.UserSuccess, payload: {data}}),
  userFail : () => ({type: actionTypes.UserFail}),

  editUser: (params, successCallback, failCallback) => ({type: actionTypes.EditUser, payload: {successCallback, failCallback, params}}),
  editUserSuccess: user => ({type: actionTypes.EditUserSuccess, payload: {user}}),
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

function* editUserSaga({payload: {params, successCallback, failCallback}}){
  try {
    const { data } = yield setUser(params);
     console.log("---userSuccess", data);
    
    if (data && data.data) {
      yield put(actions.editUserSuccess(data.data));
      if(successCallback){
      yield call(successCallback);
      }
    }
  } catch(e) {
    console.log("---userFail", e); 
    if(failCallback){
    yield call(failCallback);
    }
  }
}

export function* saga() {
  yield takeLatest(actionTypes.Logout, function* logoutSaga() {
    yield put(cropActions.logout());
  });
  yield takeLatest(actionTypes.GetUser, getUserSaga);
  yield takeLatest(actionTypes.EditUser, editUserSaga);
}
