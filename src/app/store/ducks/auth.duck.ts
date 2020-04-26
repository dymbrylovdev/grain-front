import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import * as routerHelpers from "../../router/RouterHelpers";

import {
  IUser,
  ILoginSuccessData,
  IUserForEdit,
  IUserForRegister,
  IRegSuccessData,
} from "../../interfaces/users";
import { Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { TAppActions } from "../rootDuck";
import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { put, call, takeLatest } from "redux-saga/effects";
import {
  register,
  login,
  getMe,
  editMe,
  requestPassword,
  changePassword,
} from "../../crud/auth.crud";

const CLEAR_REG = "auth/CLEAR_REG";
const REG_REQUEST = "auth/REG_REQUEST";
const REG_SUCCESS = "auth/REG_SUCCESS";
const REG_FAIL = "auth/REG_FAIL";

const CLEAR_LOGIN = "auth/CLEAR_LOGIN";
const LOGIN_REQUEST = "auth/LOGIN_REQUEST";
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGIN_FAIL = "auth/LOGIN_FAIL";

const LOGOUT = "auth/LOGOUT";
const MERGE_USER = "auth/MERGE_USER";

const FETCH_REQUEST = "auth/FETCH_REQUEST";
const FETCH_SUCCESS = "auth/FETCH_SUCCESS";
const FETCH_FAIL = "auth/FETCH_FAIL";

const CLEAR_EDIT = "auth/CLEAR_EDIT";
const EDIT_REQUEST = "auth/EDIT_REQUEST";
const EDIT_SUCCESS = "auth/EDIT_SUCCESS";
const EDIT_FAIL = "auth/EDIT_FAIL";

const CLEAR_RECOVERY_PASSWORD = "auth/CLEAR_RECOVERY_PASSWORD";
const RECOVERY_PASSWORD_REQUEST = "auth/RECOVERY_PASSWORD_REQUEST";
const RECOVERY_PASSWORD_SUCCESS = "auth/RECOVERY_PASSWORD_SUCCESS";
const RECOVERY_PASSWORD_FAIL = "auth/RECOVERY_PASSWORD_FAIL";

const CLEAR_NEW_PASSWORD = "auth/CLEAR_NEW_PASSWORD";
const NEW_PASSWORD_REQUEST = "auth/NEW_PASSWORD_REQUEST";
const NEW_PASSWORD_SUCCESS = "auth/NEW_PASSWORD_SUCCESS";
const NEW_PASSWORD_FAIL = "auth/NEW_PASSWORD_FAIL";

export interface IInitialState {
  user: IUser | undefined;
  authToken: string | undefined;
  email: string | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  regLoading: boolean;
  regSuccess: boolean;
  regError: string | null;

  loginLoading: boolean;
  loginSuccess: boolean;
  loginError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  recoveryPasswordLoading: boolean;
  recoveryPasswordSuccess: boolean;
  recoveryPasswordError: string | null;

  newPasswordLoading: boolean;
  newPasswordSuccess: boolean;
  newPasswordError: string | null;

  emailRequested: string;
}

const initialState: IInitialState = {
  user: undefined,
  authToken: undefined,
  email: undefined,
  loading: false,
  success: false,
  error: null,

  regLoading: false,
  regSuccess: false,
  regError: null,

  loginLoading: false,
  loginSuccess: false,
  loginError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  recoveryPasswordLoading: false,
  recoveryPasswordSuccess: false,
  recoveryPasswordError: null,

  newPasswordLoading: false,
  newPasswordSuccess: false,
  newPasswordError: null,

  emailRequested: "",
};

export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  { storage, key: "auth", whitelist: ["user", "authToken"] },
  (state = initialState, action) => {
    switch (action.type) {
      case FETCH_REQUEST: {
        return {
          ...state,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_SUCCESS: {
        //console.log("Fetch Me: ", action.payload);
        return {
          ...state,
          user: action.payload.data,
          loading: false,
          success: true,
        };
      }

      case FETCH_FAIL: {
        return { ...state, loading: false, error: action.payload };
      }

      case CLEAR_EDIT: {
        return { ...state, editLoading: false, editSuccess: false, editError: null };
      }

      case EDIT_REQUEST: {
        return { ...state, editLoading: true, editSuccess: false, editError: null };
      }

      case EDIT_SUCCESS: {
        return { ...state, editLoading: false, editSuccess: true };
      }

      case EDIT_FAIL: {
        return { ...state, editLoading: false, editError: action.payload };
      }

      case CLEAR_REG: {
        return { ...state, regLoading: false, regSuccess: false, regError: null };
      }

      case REG_REQUEST: {
        return {
          ...state,
          regLoading: true,
          regSuccess: false,
          regError: null,
        };
      }

      case REG_SUCCESS: {
        return {
          ...state,
          emailRequested: action.payload.data.email,
          regLoading: false,
          regSuccess: true,
        };
      }

      case REG_FAIL: {
        return {
          ...state,
          regLoading: false,
          regError: action.payload,
        };
      }

      case CLEAR_LOGIN: {
        return { ...state, loginLoading: false, loginSuccess: false, loginError: null };
      }

      case LOGIN_REQUEST: {
        return {
          ...state,
          user: undefined,
          authToken: undefined,
          loginLoading: true,
          loginSuccess: false,
          loginError: null,
        };
      }

      case LOGIN_SUCCESS: {
        return {
          ...state,
          authToken: action.payload.data.api_token,
          loginLoading: false,
          loginSuccess: true,
        };
      }

      case LOGIN_FAIL: {
        return {
          ...state,
          loginLoading: false,
          loginError: action.payload,
        };
      }

      case LOGOUT: {
        routerHelpers.forgotLastLocation();
        return initialState;
      }

      case MERGE_USER: {
        return { ...state, user: { ...state.user, ...action.payload } };
      }

      case CLEAR_RECOVERY_PASSWORD: {
        return {
          ...state,
          recoveryPasswordLoading: false,
          recoveryPasswordSuccess: false,
          recoveryPasswordError: null,
        };
      }

      case RECOVERY_PASSWORD_REQUEST: {
        return {
          ...state,
          recoveryPasswordLoading: true,
          recoveryPasswordSuccess: false,
          recoveryPasswordError: null,
        };
      }

      case RECOVERY_PASSWORD_SUCCESS: {
        return {
          ...state,
          recoveryPasswordLoading: false,
          recoveryPasswordSuccess: true,
          email: action.payload.data.email,
        };
      }

      case RECOVERY_PASSWORD_FAIL: {
        return {
          ...state,
          recoveryPasswordLoading: false,
          recoveryPasswordError: action.payload,
        };
      }

      case CLEAR_NEW_PASSWORD: {
        return {
          ...state,
          newPasswordLoading: false,
          newPasswordSuccess: false,
          newPasswordError: null,
        };
      }

      case NEW_PASSWORD_REQUEST: {
        return {
          ...state,
          newPasswordLoading: true,
          newPasswordSuccess: false,
          newPasswordError: null,
        };
      }

      case NEW_PASSWORD_SUCCESS: {
        return {
          ...state,
          newPasswordLoading: false,
          newPasswordSuccess: true,
        };
      }

      case NEW_PASSWORD_FAIL: {
        return {
          ...state,
          newPasswordLoading: false,
          newPasswordError: action.payload,
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (payload: IServerResponse<IUser>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (payload: { data: IUserForEdit }) => createAction(EDIT_REQUEST, payload),
  editSuccess: () => createAction(EDIT_SUCCESS),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearReg: () => createAction(CLEAR_REG),
  regRequest: (payload: IUserForRegister) => createAction(REG_REQUEST, payload),
  regSuccess: (payload: IServerResponse<IRegSuccessData>) => createAction(REG_SUCCESS, payload),
  regFail: (payload: string) => createAction(REG_FAIL, payload),

  clearLogin: () => createAction(CLEAR_LOGIN),
  loginRequest: (payload: { login: string; password: string }) =>
    createAction(LOGIN_REQUEST, payload),
  loginSuccess: (payload: IServerResponse<ILoginSuccessData>) =>
    createAction(LOGIN_SUCCESS, payload),
  loginFail: (payload: string) => createAction(LOGIN_FAIL, payload),

  logout: () => createAction(LOGOUT),

  mergeUser: (payload: any) => createAction(MERGE_USER, payload),

  clearRecoveryPassword: () => createAction(CLEAR_RECOVERY_PASSWORD),
  recoveryPasswordRequest: (payload: { email: string }) =>
    createAction(RECOVERY_PASSWORD_REQUEST, payload),
  recoveryPasswordSuccess: (payload: IServerResponse<IUser>) =>
    createAction(RECOVERY_PASSWORD_SUCCESS, payload),
  recoveryPasswordFail: (payload: string) => createAction(RECOVERY_PASSWORD_FAIL, payload),

  clearNewPassword: () => createAction(CLEAR_NEW_PASSWORD),
  newPasswordRequest: (payload: { password: string; password2: string; code: string }) =>
    createAction(NEW_PASSWORD_REQUEST, payload),
  newPasswordSuccess: (payload: IServerResponse<IUser>) =>
    createAction(NEW_PASSWORD_SUCCESS, payload),
  newPasswordFail: (payload: string) => createAction(NEW_PASSWORD_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => getMe());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { data: IUserForEdit } }) {
  try {
    yield call(() => editMe(payload.data));
    yield put(actions.editSuccess());
  } catch (e) {
    yield put(actions.editFail(e.response.data.message));
  }
}

function* regSaga({ payload }: { payload: IUserForRegister }) {
  try {
    const { data }: { data: IServerResponse<IRegSuccessData> } = yield call(() =>
      register(payload)
    );
    yield put(actions.regSuccess(data));
  } catch (e) {
    yield put(actions.regFail(e.response.data.message));
  }
}

function* loginSaga({ payload }: { payload: { login: string; password: string } }) {
  try {
    const { data }: { data: IServerResponse<ILoginSuccessData> } = yield call(() =>
      login(payload.login, payload.password)
    );
    yield put(actions.loginSuccess(data));
  } catch (e) {
    yield put(actions.loginFail(e.response.data.message));
  }
}

function* recoveryPasswordSaga({ payload }: { payload: { email: string } }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() =>
      requestPassword(payload.email)
    );
    yield put(actions.recoveryPasswordSuccess(data));
  } catch (e) {
    yield put(actions.recoveryPasswordFail(e.response.data.message));
  }
}

function* newPasswordSaga({
  payload,
}: {
  payload: { password: string; password2: string; code: string };
}) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => changePassword(payload));
    yield put(actions.newPasswordSuccess(data));
  } catch (e) {
    yield put(actions.newPasswordFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.regRequest>>(REG_REQUEST, regSaga);
  yield takeLatest<ReturnType<typeof actions.loginRequest>>(LOGIN_REQUEST, loginSaga);
  yield takeLatest<ReturnType<typeof actions.recoveryPasswordRequest>>(
    RECOVERY_PASSWORD_REQUEST,
    recoveryPasswordSaga
  );
  yield takeLatest<ReturnType<typeof actions.newPasswordRequest>>(
    NEW_PASSWORD_REQUEST,
    newPasswordSaga
  );
}