import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import {
  getFunnelStates,
  addFunnelState,
  editFunnelState,
  delFunnelState,
  getFunnelStatesReport,
} from "../../crud/funnelStates.crud";
import {
  IFunnelState,
  IFunnelStateToRequest,
  IFunnelStatesReport,
} from "../../interfaces/funnelStates";

const SET_TAB = "funnelStates/SET_TAB";
const FETCH_REQUEST = "funnelStates/FETCH_REQUEST";
const FETCH_SUCCESS = "funnelStates/FETCH_SUCCESS";
const FETCH_FAIL = "funnelStates/FETCH_FAIL";

const SET_REPORT_TAB = "funnelStates/SET_REPORT_TAB";
const FETCH_REPORT_REQUEST = "funnelStates/FETCH_REPORT_REQUEST";
const FETCH_REPORT_SUCCESS = "funnelStates/FETCH_REPORT_SUCCESS";
const FETCH_REPORT_FAIL = "funnelStates/FETCH_REPORT_FAIL";

const CLEAR_CREATE = "funnelStates/CLEAR_CREATE";
const CREATE_REQUEST = "funnelStates/CREATE_REQUEST";
const CREATE_SUCCESS = "funnelStates/CREATE_SUCCESS";
const CREATE_FAIL = "funnelStates/CREATE_FAIL";

const CLEAR_EDIT = "funnelStates/CLEAR_EDIT";
const EDIT_REQUEST = "funnelStates/EDIT_REQUEST";
const EDIT_SUCCESS = "funnelStates/EDIT_SUCCESS";
const EDIT_FAIL = "funnelStates/EDIT_FAIL";

const CLEAR_DEL = "funnelStates/CLEAR_DEL";
const DEL_REQUEST = "funnelStates/DEL_REQUEST";
const DEL_SUCCESS = "funnelStates/DEL_SUCCESS";
const DEL_FAIL = "funnelStates/DEL_FAIL";

export interface IInitialState {
  tab: number;
  funnelStates: IFunnelState[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  reportTab: number;
  reports: IFunnelStatesReport[] | undefined;
  reportLoading: boolean;
  reportSuccess: boolean;
  reportError: string | null;

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
  tab: 0,
  funnelStates: undefined,
  loading: false,
  success: false,
  error: null,

  reportTab: 0,
  reports: undefined,
  reportLoading: false,
  reportSuccess: false,
  reportError: null,

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
    case SET_TAB: {
      return { ...state, tab: action.payload.id };
    }

    case FETCH_REQUEST: {
      return {
        ...state,
        funnelStates: undefined,
        loading: true,
        success: false,
        error: null,
      };
    }

    case FETCH_SUCCESS: {
      // console.log("Fetch funnel states: ", action.payload);
      return {
        ...state,
        funnelStates: action.payload.data,
        loading: false,
        success: true,
      };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload.error };
    }

    case SET_REPORT_TAB: {
      return { ...state, reportTab: action.payload.id };
    }

    case FETCH_REPORT_REQUEST: {
      return {
        ...state,
        reports: undefined,
        reportLoading: true,
        reportSuccess: false,
        reportError: null,
      };
    }

    case FETCH_REPORT_SUCCESS: {
      console.log(action.payload);
      return {
        ...state,
        reports: action.payload.data,
        reportLoading: false,
        reportSuccess: true,
      };
    }

    case FETCH_REPORT_FAIL: {
      return { ...state, reportLoading: false, reportError: action.payload.error };
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
        funnelStates: undefined,
        createLoading: false,
        createSuccess: true,
      };
    }

    case CREATE_FAIL: {
      return { ...state, createLoading: false, createError: action.payload.error };
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
        funnelStates: undefined,
        byIdLoading: true,
        editLoading: false,
        editSuccess: true,
      };
    }

    case EDIT_FAIL: {
      return { ...state, editLoading: false, editError: action.payload.error };
    }

    case CLEAR_DEL: {
      return { ...state, delLoading: false, delSuccess: false, delError: null };
    }

    case DEL_REQUEST: {
      return { ...state, delLoading: true, delSuccess: false, delError: null };
    }

    case DEL_SUCCESS: {
      return { ...state, funnelStates: undefined, delLoading: false, delSuccess: true };
    }

    case DEL_FAIL: {
      return { ...state, delLoading: false, delError: action.payload.error };
    }

    default:
      return state;
  }
};

export const actions = {
  setTab: (id: number) => createAction(SET_TAB, { id }),
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (payload: IServerResponse<IFunnelState[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (error: string) => createAction(FETCH_FAIL, { error }),

  setReportTab: (id: number) => createAction(SET_REPORT_TAB, { id }),
  fetchReportRequest: () => createAction(FETCH_REPORT_REQUEST),
  fetchReportSuccess: (payload: IServerResponse<IFunnelStatesReport[]>) =>
    createAction(FETCH_REPORT_SUCCESS, payload),
  fetchReportFail: (error: string) => createAction(FETCH_REPORT_FAIL, { error }),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (data: IFunnelStateToRequest) => createAction(CREATE_REQUEST, { data }),
  createSuccess: () => createAction(CREATE_SUCCESS),
  createFail: (error: string) => createAction(CREATE_FAIL, { error }),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (id: number, data: IFunnelStateToRequest) =>
    createAction(EDIT_REQUEST, { id, data }),
  editSuccess: () => createAction(EDIT_SUCCESS),
  editFail: (error: string) => createAction(EDIT_FAIL, { error }),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (id: number) => createAction(DEL_REQUEST, { id }),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (error: string) => createAction(DEL_FAIL, { error }),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<IFunnelState[]> } = yield call(() => getFunnelStates());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* fetchReportSaga() {
  try {
    const { data }: { data: IServerResponse<IFunnelStatesReport[]> } = yield call(() =>
      getFunnelStatesReport()
    );
    yield put(actions.fetchReportSuccess(data));
  } catch (e) {
    yield put(actions.fetchReportFail(e.response.data.message));
  }
}

function* createSaga({ payload }: { payload: { data: IFunnelStateToRequest } }) {
  try {
    yield call(() => addFunnelState(payload.data));
    yield put(actions.createSuccess());
  } catch (e) {
    yield put(actions.createFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: IFunnelStateToRequest } }) {
  try {
    yield call(() => editFunnelState(payload.id, payload.data));
    yield put(actions.editSuccess());
  } catch (e) {
    yield put(actions.editFail(e.response.data.message));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => delFunnelState(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchReportRequest>>(
    FETCH_REPORT_REQUEST,
    fetchReportSaga
  );
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
}
