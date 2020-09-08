import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { IBid, IBestBids, IBidToRequest, TBidType, IProfit } from "../../interfaces/bids";
import { IFilterForBids, IFilterForBid } from "../../interfaces/filters";
import {
  getAllBids,
  getMyBids,
  getBestBids,
  getBidById,
  createBid,
  editBid,
  deleteBid,
} from "../../crud/bids.crud";
import persistReducer, { PersistPartial } from "redux-persist/es/persistReducer";

const FETCH_REQUEST = "bids/FETCH_REQUEST";
const FETCH_SUCCESS = "bids/FETCH_SUCCESS";
const FETCH_FAIL = "bids/FETCH_FAIL";

const FETCH_MY_REQUEST = "bids/FETCH_MY_REQUEST";
const FETCH_MY_SUCCESS = "bids/FETCH_MY_SUCCESS";
const FETCH_MY_FAIL = "bids/FETCH_MY_FAIL";

const CLEAR_BEST_REQUEST = "bids/CLEAR_BEST_REQUEST";
const FETCH_BEST_REQUEST = "bids/FETCH_BEST_REQUEST";
const FETCH_BEST_SUCCESS = "bids/FETCH_BEST_SUCCESS";
const FETCH_BEST_FAIL = "bids/FETCH_BEST_FAIL";

const CLEAR_FETCH_BY_ID = "bids/CLEAR_FETCH_BY_ID";
const FETCH_BY_ID_REQUEST = "bids/FETCH_BY_ID_REQUEST";
const FETCH_BY_ID_SUCCESS = "bids/FETCH_BY_ID_SUCCESS";
const FETCH_BY_ID_FAIL = "bids/FETCH_BY_ID_FAIL";

const CLEAR_CREATE = "bids/CLEAR_CREATE";
const CREATE_REQUEST = "bids/CREATE_REQUEST";
const CREATE_SUCCESS = "bids/CREATE_SUCCESS";
const CREATE_FAIL = "bids/CREATE_FAIL";

const CLEAR_EDIT = "bids/CLEAR_EDIT";
const EDIT_REQUEST = "bids/EDIT_REQUEST";
const EDIT_SUCCESS = "bids/EDIT_SUCCESS";
const EDIT_FAIL = "bids/EDIT_FAIL";

const CLEAR_DEL = "bids/CLEAR_DEL";
const DEL_REQUEST = "bids/DEL_REQUEST";
const DEL_SUCCESS = "bids/DEL_SUCCESS";
const DEL_FAIL = "bids/DEL_FAIL";

const SET_PROFIT = "bids/SET_PROFIT";

export interface IInitialState {
  page: number;
  per_page: number;
  total: number;
  bids: IBid[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  bid: IBid | undefined;
  byIdLoading: boolean;
  byIdSuccess: boolean;
  byIdError: string | null;

  myBids: IBid[] | undefined;
  myLoading: boolean;
  mySuccess: boolean;
  myError: string | null;

  bestBids: IBestBids | undefined;
  bestLoading: boolean;
  bestSuccess: boolean;
  bestError: string | null;

  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;

  profit: IProfit;
}

const initialState: IInitialState = {
  page: 1,
  per_page: 20,
  total: 0,
  bids: undefined,
  loading: false,
  success: false,
  error: null,

  bid: undefined,
  byIdLoading: false,
  byIdSuccess: false,
  byIdError: null,

  myBids: undefined,
  myLoading: false,
  mySuccess: false,
  myError: null,

  bestBids: undefined,
  bestLoading: false,
  bestSuccess: false,
  bestError: null,

  createLoading: false,
  createSuccess: false,
  createError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  delLoading: false,
  delSuccess: false,
  delError: null,

  profit: { bid_id: 0, value: 0 },
};

export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  { storage, key: "bids", whitelist: ["profit"] },
  (state = initialState, action) => {
    switch (action.type) {
      case FETCH_REQUEST: {
        return {
          ...state,
          bids: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_SUCCESS: {
        // console.log("FETCH: ", action.payload);
        return {
          ...state,
          page: action.payload.page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          bids: action.payload.data,
          loading: false,
          success: true,
        };
      }

      case FETCH_FAIL: {
        return { ...state, loading: false, error: action.payload };
      }

      case FETCH_MY_REQUEST: {
        return {
          ...state,
          myBids: undefined,
          myLoading: true,
          mySuccess: false,
          myError: null,
        };
      }

      case FETCH_MY_SUCCESS: {
        // console.log("FETCH_MY: ", action.payload);
        return {
          ...state,
          myBids: action.payload.data,
          myLoading: false,
          mySuccess: true,
        };
      }

      case FETCH_MY_FAIL: {
        return { ...state, myLoading: false, myError: action.payload };
      }

      case CLEAR_BEST_REQUEST: {
        return {
          ...state,
          bestBids: undefined,
          bestLoading: false,
          bestSuccess: false,
          bestError: null,
        };
      }

      case FETCH_BEST_REQUEST: {
        return {
          ...state,
          bestBids: undefined,
          bestLoading: true,
          bestSuccess: false,
          bestError: null,
        };
      }

      case FETCH_BEST_SUCCESS: {
        // console.log("FETCH_BEST: ", action.payload);
        return {
          ...state,
          bestBids: action.payload.data,
          bestLoading: false,
          bestSuccess: true,
        };
      }

      case FETCH_BEST_FAIL: {
        return { ...state, bestLoading: false, bestError: action.payload };
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
          bid: undefined,
          byIdLoading: true,
          byIdSuccess: false,
          byIdError: null,
        };
      }

      case FETCH_BY_ID_SUCCESS: {
        // console.log("Fetch Bid By Id: ", action.payload);
        return {
          ...state,
          bid: action.payload.data,
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
        return {
          ...state,
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
        return { ...state, delLoading: false, delSuccess: true };
      }

      case DEL_FAIL: {
        return { ...state, delLoading: false, delError: action.payload };
      }

      case SET_PROFIT: {
        return { ...state, profit: action.payload.profit };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  fetchRequest: (cropId: number, bidType: TBidType, page: number, perPage: number) =>
    createAction(FETCH_REQUEST, { bidType, cropId, page, perPage }),
  fetchSuccess: (payload: IServerResponse<IBid[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  fetchMyRequest: (bidType: TBidType) => createAction(FETCH_MY_REQUEST, { bidType }),
  fetchMySuccess: (payload: IServerResponse<IBid[]>) => createAction(FETCH_MY_SUCCESS, payload),
  fetchMyFail: (payload: string) => createAction(FETCH_MY_FAIL, payload),

  clearBestRequest: () => createAction(CLEAR_BEST_REQUEST),
  fetchBestRequest: (bidType: TBidType, filter: IFilterForBids) =>
    createAction(FETCH_BEST_REQUEST, { bidType, filter }),
  fetchBestSuccess: (payload: IServerResponse<IBestBids>) =>
    createAction(FETCH_BEST_SUCCESS, payload),
  fetchBestFail: (payload: string) => createAction(FETCH_BEST_FAIL, payload),

  clearFetchById: () => createAction(CLEAR_FETCH_BY_ID),
  fetchByIdRequest: (id: number, filter: IFilterForBid) =>
    createAction(FETCH_BY_ID_REQUEST, { id, filter }),
  fetchByIdSuccess: (payload: IServerResponse<IBid>) => createAction(FETCH_BY_ID_SUCCESS, payload),
  fetchByIdFail: (payload: string) => createAction(FETCH_BY_ID_FAIL, payload),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (type: TBidType, data: IBidToRequest) =>
    createAction(CREATE_REQUEST, { type, data }),
  createSuccess: () => createAction(CREATE_SUCCESS),
  createFail: (payload: string) => createAction(CREATE_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (id: number, data: IBidToRequest) => createAction(EDIT_REQUEST, { id, data }),
  editSuccess: () => createAction(EDIT_SUCCESS),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (id: number) => createAction(DEL_REQUEST, { id }),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),

  setProfit: (profit: IProfit) => createAction(SET_PROFIT, { profit }),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({
  payload,
}: {
  payload: { cropId: number; bidType: TBidType; page: number; perPage: number };
}) {
  try {
    const { data }: { data: IServerResponse<IBid[]> } = yield call(() =>
      getAllBids(payload.cropId, payload.bidType, payload.page, payload.perPage)
    );
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchMySaga({ payload }: { payload: { bidType: TBidType } }) {
  try {
    const { data }: { data: IServerResponse<IBid[]> } = yield call(() =>
      getMyBids(payload.bidType)
    );
    yield put(actions.fetchMySuccess(data));
  } catch (e) {
    yield put(actions.fetchMyFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchBestSaga({ payload }: { payload: { bidType: TBidType; filter: IFilterForBids } }) {
  try {
    const { data }: { data: IServerResponse<IBestBids> } = yield call(() =>
      getBestBids(payload.bidType, payload.filter)
    );
    yield put(actions.fetchBestSuccess(data));
  } catch (e) {
    yield put(actions.fetchBestFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchByIdSaga({ payload }: { payload: { id: number; filter: IFilterForBid } }) {
  try {
    const { data }: { data: IServerResponse<IBid> } = yield call(() =>
      getBidById(payload.id, payload.filter)
    );
    yield put(actions.fetchByIdSuccess(data));
  } catch (e) {
    yield put(actions.fetchByIdFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* createSaga({ payload }: { payload: { type: TBidType; data: IBidToRequest } }) {
  try {
    yield call(() => createBid(payload.type, payload.data));
    yield put(actions.createSuccess());
  } catch (e) {
    yield put(actions.createFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: IBidToRequest } }) {
  try {
    yield call(() => editBid(payload.id, payload.data));
    yield put(actions.editSuccess());
  } catch (e) {
    yield put(actions.editFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => deleteBid(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchMyRequest>>(FETCH_MY_REQUEST, fetchMySaga);
  yield takeLatest<ReturnType<typeof actions.fetchBestRequest>>(FETCH_BEST_REQUEST, fetchBestSaga);
  yield takeLatest<ReturnType<typeof actions.fetchByIdRequest>>(FETCH_BY_ID_REQUEST, fetchByIdSaga);
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
}
