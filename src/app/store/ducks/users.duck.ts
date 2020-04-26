import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { getUsers, getUserById, deleteUser, createUser, editUser } from "../../crud/users.crud";
import { IUser, IUserForCreate, IUserForEdit } from "../../interfaces/users";

const FETCH_REQUEST = "users/FETCH_REQUEST";
const FETCH_SUCCESS = "users/FETCH_SUCCESS";
const FETCH_FAIL = "users/FETCH_FAIL";

const CLEAR_FETCH_BY_ID = "users/CLEAR_FETCH_BY_ID";
const FETCH_BY_ID_REQUEST = "users/FETCH_BY_ID_REQUEST";
const FETCH_BY_ID_SUCCESS = "users/FETCH_BY_ID_SUCCESS";
const FETCH_BY_ID_FAIL = "users/FETCH_BY_ID_FAIL";

const CLEAR_CREATE = "users/CLEAR_CREATE";
const CREATE_REQUEST = "users/CREATE_REQUEST";
const CREATE_SUCCESS = "users/CREATE_SUCCESS";
const CREATE_FAIL = "users/CREATE_FAIL";

const CLEAR_EDIT = "users/CLEAR_EDIT";
const EDIT_REQUEST = "users/EDIT_REQUEST";
const EDIT_SUCCESS = "users/EDIT_SUCCESS";
const EDIT_FAIL = "users/EDIT_FAIL";

const CLEAR_DEL = "users/CLEAR_DEL";
const DEL_REQUEST = "users/DEL_REQUEST";
const DEL_SUCCESS = "users/DEL_SUCCESS";
const DEL_FAIL = "users/DEL_FAIL";

export interface IInitialState {
  page: number;
  per_page: number;
  total: number;
  prevUsersCount: number;
  users: IUser[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  user: IUser | undefined;
  byIdLoading: boolean;
  byIdSuccess: boolean;
  byIdError: string | null;

  createdUserId: number;
  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;
}

const initialState: IInitialState = {
  page: 1,
  per_page: 20,
  total: 0,
  prevUsersCount: 5,
  users: undefined,
  loading: false,
  success: false,
  error: null,

  user: undefined,
  byIdLoading: false,
  byIdSuccess: false,
  byIdError: null,

  createdUserId: 0,
  createLoading: false,
  createSuccess: false,
  createError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  delLoading: false,
  delSuccess: false,
  delError: null,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUEST: {
      return {
        ...state,
        users: undefined,
        loading: true,
        success: false,
        error: null,
      };
    }

    case FETCH_SUCCESS: {
      //console.log(action.payload);
      return {
        ...state,
        page: action.payload.page,
        per_page: action.payload.per_page,
        total: action.payload.total,
        prevUsersCount: action.payload.data.length,
        users: action.payload.data,
        loading: false,
        success: true,
      };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }

    case CLEAR_FETCH_BY_ID: {
      //console.log("CLEAR_FETCH_BY_ID");
      return {
        ...state,
        byIdLoading: false,
        byIdSuccess: false,
        byIdError: null,
      };
    }

    case FETCH_BY_ID_REQUEST: {
      //console.log("FETCH_BY_ID_REQUEST");
      return {
        ...state,
        byIdLoading: true,
        byIdSuccess: false,
        byIdError: null,
      };
    }

    case FETCH_BY_ID_SUCCESS: {
      //console.log("Fetch User: ", action.payload);
      return {
        ...state,
        user: action.payload.data,
        byIdLoading: false,
        byIdSuccess: true,
      };
    }

    case FETCH_BY_ID_FAIL: {
      return { ...state, user: undefined, byIdLoading: false, byIdError: action.payload };
    }

    case CLEAR_CREATE: {
      return { ...state, createLoading: false, createSuccess: false, createError: null };
    }

    case CREATE_REQUEST: {
      return { ...state, createLoading: true, createSuccess: false, createError: null };
    }

    case CREATE_SUCCESS: {
      return {
        ...state,
        users: undefined,
        createdUserId: action.payload.data.id,
        createLoading: false,
        createSuccess: true,
      };
    }

    case CREATE_FAIL: {
      return { ...state, createLoading: false, createError: action.payload };
    }

    case CLEAR_EDIT: {
      return { ...state, editLoading: false, editSuccess: false, editError: null };
    }

    case EDIT_REQUEST: {
      return { ...state, editLoading: true, editSuccess: false, editError: null };
    }

    case EDIT_SUCCESS: {
      return {
        ...state,
        users: undefined,
        loading: true,
        editLoading: false,
        editSuccess: true,
      };
    }

    case EDIT_FAIL: {
      return { ...state, editLoading: false, editError: action.payload };
    }

    case CLEAR_DEL: {
      return { ...state, delLoading: false, delSuccess: false, delError: null };
    }

    case DEL_REQUEST: {
      return { ...state, delLoading: true, delSuccess: false, delError: null };
    }

    case DEL_SUCCESS: {
      return { ...state, users: undefined, delLoading: false, delSuccess: true };
    }

    case DEL_FAIL: {
      return { ...state, delLoading: false, delError: action.payload };
    }

    default:
      return state;
  }
};

export const actions = {
  fetchRequest: (payload: { page: number; perPage: number }) =>
    createAction(FETCH_REQUEST, payload),
  fetchSuccess: (payload: IServerResponse<IUser[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  clearFetchById: () => createAction(CLEAR_FETCH_BY_ID),
  fetchByIdRequest: (payload: { id: number }) => createAction(FETCH_BY_ID_REQUEST, payload),
  fetchByIdSuccess: (payload: IServerResponse<IUser>) => createAction(FETCH_BY_ID_SUCCESS, payload),
  fetchByIdFail: (payload: string) => createAction(FETCH_BY_ID_FAIL, payload),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (payload: IUserForCreate) => createAction(CREATE_REQUEST, payload),
  createSuccess: (payload: IServerResponse<IUser>) => createAction(CREATE_SUCCESS, payload),
  createFail: (payload: string) => createAction(CREATE_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (payload: { id: number; data: IUserForEdit }) => createAction(EDIT_REQUEST, payload),
  editSuccess: () => createAction(EDIT_SUCCESS),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (payload: { id: number }) => createAction(DEL_REQUEST, payload),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({ payload }: { payload: { page: number; perPage: number } }) {
  try {
    const { data }: { data: IServerResponse<IUser[]> } = yield call(() =>
      getUsers(payload.page, payload.perPage)
    );
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* fetchByIdSaga({ payload }: { payload: { id: number } }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => getUserById(payload.id));
    yield put(actions.fetchByIdSuccess(data));
  } catch (e) {
    yield put(actions.fetchByIdFail(e.response.data.message));
  }
}

function* createSaga({ payload }: { payload: IUserForCreate }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => createUser(payload));
    yield put(actions.createSuccess(data));
  } catch (e) {
    yield put(actions.createFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: IUserForEdit } }) {
  try {
    yield call(() => editUser(payload.id, payload.data));
    yield put(actions.editSuccess());
  } catch (e) {
    yield put(actions.editFail(e.response.data.message));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => deleteUser(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchByIdRequest>>(FETCH_BY_ID_REQUEST, fetchByIdSaga);
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
}