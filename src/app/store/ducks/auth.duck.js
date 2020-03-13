import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, call } from "redux-saga/effects";
import * as routerHelpers from "../../router/RouterHelpers";
import { getUser, setUser, requestPassword, changePassword } from "../../crud/auth.crud";
import { actions as cropActions } from "./crops.duck";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",

  PasswordRequested: "[PasswordRequested] Action",
  PasswordRequestedSuccess: "[PasswordRequested] Success",
  PasswordRequestedFail: "[PasswordRequested] Fail",
  SetRequestedEmail: "[SetRequestedEmail] Action",

  PasswordChange: "[PasswordChange] Action",
  PasswordChangeSuccess: "[PasswordChange] Success",
  PasswordChangeFail: "[PasswordChange] Fail",

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
  emailRequested: "",
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

      case actionTypes.PasswordRequestedSuccess:
      case actionTypes.SetRequestedEmail: {
        const { email } = action.payload;
        return { ...state, emailRequested: email };
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
        return { ...state, user: data };
      }

      case actionTypes.UserFail: {
        return { ...state, user: { ...state.user, loading: false }, errors: { get: true } };
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

  passwordRequested: (email, successCallback, failCallback) => ({
    type: actionTypes.PasswordRequested,
    payload: { email, successCallback, failCallback },
  }),
  passwordRequestedSuccess: email => ({
    type: actionTypes.PasswordRequestedSuccess,
    payload: { email },
  }),
  setRequestedEmail: email => ({
    type: actionTypes.SetRequestedEmail,
    payload: { email },
  }),

  changePassword: (params, failCallback) => ({
    type: actionTypes.PasswordChange,
    payload: { params, failCallback },
  }),

  getUser: () => ({ type: actionTypes.GetUser }),
  userSuccess: data => ({ type: actionTypes.UserSuccess, payload: { data } }),
  userFail: () => ({ type: actionTypes.UserFail }),

  editUser: (params, successCallback, failCallback) => ({
    type: actionTypes.EditUser,
    payload: { successCallback, failCallback, params },
  }),
  editUserSuccess: user => ({ type: actionTypes.EditUserSuccess, payload: { user } }),
};

function* getUserSaga() {
  try {
    const { data } = yield getUser();
    if (data && data.data) {
      yield put(actions.userSuccess(data.data));
    }
  } catch {
    yield put(actions.userFail());
  }
}

function* editUserSaga({ payload: { params, successCallback, failCallback } }) {
  try {
    const { data } = yield setUser(params);
    if (data && data.data) {
      yield put(actions.editUserSuccess(data.data));
      if (successCallback) {
        yield call(successCallback);
      }
    }
  } catch (e) {
    if (failCallback) {
      yield call(failCallback);
    }
  }
}

function* passwordRequestedSaga({payload: {email, successCallback, failCallback }}){
  try{
    const { data } = yield requestPassword(email);
    if(data){
      yield put(actions.passwordRequestedSuccess(email));
      yield call(successCallback);
    }else{
      yield call(failCallback);
    }
  }catch(e){
    const error = e && e.response && e.response.message;
    yield call(failCallback, error);
  }
}

function* changePasswordSaga({payload: { params, failCallback }}){
  try{
    const {data} = yield changePassword(params);
    if(data && data.data){
      const user = data.data;
      yield put(actions.login(user.api_token));
      yield put(actions.editUserSuccess(user));
    }else{
      yield call(failCallback);
    }
  }catch(e){
    const error = e && e.response && e.response.message;
    yield call(failCallback, error);
  }
}

export function* saga() {
  yield takeLatest(actionTypes.Logout, function* logoutSaga() {
    yield put(cropActions.logout());
  });
  yield takeLatest(actionTypes.GetUser, getUserSaga);
  yield takeLatest(actionTypes.EditUser, editUserSaga);
  yield takeLatest(actionTypes.PasswordRequested, passwordRequestedSaga);
  yield takeLatest(actionTypes.PasswordChange, changePasswordSaga);
}
