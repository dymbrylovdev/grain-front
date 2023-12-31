import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { getUserById } from "../../crud/users.crud";
import { ILocation, ILocationToRequest } from "../../interfaces/locations";
import { getLocations, createLocation, delLocation, editLocation } from "../../crud/locations.crud";

const FETCH_REQUEST = "locations/FETCH_REQUEST";
const FETCH_SUCCESS = "locations/FETCH_SUCCESS";
const FETCH_FAIL = "locations/FETCH_FAIL";

const CLEAR_FETCH_BY_ID = "locations/CLEAR_FETCH_BY_ID";
const FETCH_BY_ID_REQUEST = "locations/FETCH_BY_ID_REQUEST";
const FETCH_BY_ID_SUCCESS = "locations/FETCH_BY_ID_SUCCESS";
const FETCH_BY_ID_FAIL = "locations/FETCH_BY_ID_FAIL";

const CLEAR_CREATE = "locations/CLEAR_CREATE";
const CREATE_REQUEST = "locations/CREATE_REQUEST";
const CREATE_SUCCESS = "locations/CREATE_SUCCESS";
const CREATE_FAIL = "locations/CREATE_FAIL";

const CLEAR_EDIT = "locations/CLEAR_EDIT";
const EDIT_REQUEST = "locations/EDIT_REQUEST";
const EDIT_SUCCESS = "locations/EDIT_SUCCESS";
const EDIT_FAIL = "locations/EDIT_FAIL";

const CLEAR_DEL = "locations/CLEAR_DEL";
const DEL_REQUEST = "locations/DEL_REQUEST";
const DEL_SUCCESS = "locations/DEL_SUCCESS";
const DEL_FAIL = "locations/DEL_FAIL";
const CHANGE_GUEST_LOCATION = "locations/CHANGE_GUEST_LOCATION";

export interface IInitialState {
  locations: ILocation[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  location: ILocation | undefined;
  byIdLoading: boolean;
  byIdSuccess: boolean;
  byIdError: string | null;

  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;
  guestLocationChange: boolean;
}

const initialState: IInitialState = {
  locations: undefined,
  loading: false,
  success: false,
  error: null,

  location: undefined,
  byIdLoading: false,
  byIdSuccess: false,
  byIdError: null,

  createLoading: false,
  createSuccess: false,
  createError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  delLoading: false,
  delSuccess: false,
  delError: null,
  guestLocationChange: false,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUEST: {
      return {
        ...state,
        locations: undefined,
        loading: true,
        success: false,
        error: null,
      };
    }

    case FETCH_SUCCESS: {
      return {
        ...state,
        page: action.payload.page,
        per_page: action.payload.per_page,
        total: action.payload.total,
        locations: action.payload.data,
        loading: false,
        success: true,
      };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }

    case CLEAR_FETCH_BY_ID: {
      return {
        ...state,
        location: undefined,
        byIdLoading: false,
        byIdSuccess: false,
        byIdError: null,
      };
    }

    case FETCH_BY_ID_REQUEST: {
      return {
        ...state,
        location: undefined,
        byIdLoading: true,
        byIdSuccess: false,
        byIdError: null,
      };
    }

    case FETCH_BY_ID_SUCCESS: {
      return {
        ...state,
        location: action.payload.data,
        byIdLoading: false,
        byIdSuccess: true,
      };
    }

    case FETCH_BY_ID_FAIL: {
      return { ...state, byIdLoading: false, byIdError: action.payload };
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
      return { ...state, editLoading: false, editSuccess: true };
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
      return { ...state, delLoading: false, delSuccess: true };
    }

    case DEL_FAIL: {
      return { ...state, delLoading: false, delError: action.payload };
    }

    case CHANGE_GUEST_LOCATION: {
      return { ...state, guestLocationChange: !state.guestLocationChange };
    }

    default:
      return state;
  }
};

export const actions = {
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (payload: IServerResponse<ILocation[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  clearFetchById: () => createAction(CLEAR_FETCH_BY_ID),
  fetchByIdRequest: (payload: { id: number }) => createAction(FETCH_BY_ID_REQUEST, payload),
  fetchByIdSuccess: (payload: IServerResponse<ILocation>) => createAction(FETCH_BY_ID_SUCCESS, payload),
  fetchByIdFail: (payload: string) => createAction(FETCH_BY_ID_FAIL, payload),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (payload: ILocationToRequest) => createAction(CREATE_REQUEST, payload),
  createSuccess: () => createAction(CREATE_SUCCESS),
  createFail: (payload: string) => createAction(CREATE_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (payload: { id: number; data: ILocationToRequest }) => createAction(EDIT_REQUEST, payload),
  editSuccess: () => createAction(EDIT_SUCCESS),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (payload: { id: number }) => createAction(DEL_REQUEST, payload),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),
  editGuestLocation: () => createAction(CHANGE_GUEST_LOCATION),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<ILocation[]> } = yield call(() => getLocations());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchByIdSaga({ payload }: { payload: { id: number } }) {
  try {
    const { data }: { data: IServerResponse<ILocation> } = yield call(() => getUserById(payload.id));
    yield put(actions.fetchByIdSuccess(data));
  } catch (e) {
    yield put(actions.fetchByIdFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* createSaga({ payload }: { payload: ILocationToRequest }) {
  try {
    yield call(() => createLocation(payload));
    yield put(actions.createSuccess());
  } catch (e) {
    yield put(actions.createFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: ILocationToRequest } }) {
  try {
    yield call(() => editLocation(payload.id, payload.data));
    yield put(actions.editSuccess());
  } catch (e) {
    yield put(actions.editFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => delLocation(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchByIdRequest>>(FETCH_BY_ID_REQUEST, fetchByIdSaga);
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
}
