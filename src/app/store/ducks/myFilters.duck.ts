import { persistReducer } from "redux-persist";
import { Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import {
  createMyFilter,
  getMyFilters,
  deleteMyFilter,
  editMyFilter,
} from "../../crud/myFilters.crud";
import { IMyFilterItem, IFilterForCreate } from "../../interfaces/filters";
import { TBidType } from "../../interfaces/bids";
import { fromApiToFilter } from "../../pages/home/myFilters/utils";

const FETCH_REQUEST = "myFilters/FETCH_REQUEST";
const FETCH_SUCCESS = "myFilters/FETCH_SUCCESS";
const FETCH_FAIL = "myFilters/FETCH_FAIL";

const SET_SELECTED_FILTER_ID = "myFilters/SET_SELECTED_FILTER_ID";
const SET_OPEN_INFO_ALERT = "myFilters/SET_OPEN_INFO_ALERT";

const SET_CURRENT_SALE_FILTER = "myFilters/SET_CURRENT_SALE_FILTER";
const CLEAR_CURRENT_SALE_FILTER = "myFilters/CLEAR_CURRENT_SALE_FILTER";
const SET_CURRENT_PURCHASE_FILTER = "myFilters/SET_CURRENT_PURCHASE_FILTER";
const CLEAR_CURRENT_PURCHASE_FILTER = "myFilters/CLEAR_CURRENT_PURCHASE_FILTER";

const CLEAR_CREATE = "myFilters/CLEAR_CREATE";
const CREATE_REQUEST = "myFilters/CREATE_REQUEST";
const CREATE_SUCCESS = "myFilters/CREATE_SUCCESS";
const CREATE_FAIL = "myFilters/CREATE_FAIL";

const CLEAR_EDIT = "myFilters/CLEAR_EDIT";
const EDIT_REQUEST = "myFilters/EDIT_REQUEST";
const EDIT_SUCCESS = "myFilters/EDIT_SUCCESS";
const EDIT_FAIL = "myFilters/EDIT_FAIL";

const CLEAR_DEL = "myFilters/CLEAR_DEL";
const DEL_REQUEST = "myFilters/DEL_REQUEST";
const DEL_SUCCESS = "myFilters/DEL_SUCCESS";
const DEL_FAIL = "myFilters/DEL_FAIL";

export interface IInitialState {
  selectedFilterId: number | undefined;
  openInfoAlert: boolean;

  myFilters: IMyFilterItem[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  currentSaleFilters: { [crop: string]: { [x: string]: any } };
  currentPurchaseFilters: { [crop: string]: { [x: string]: any } };

  createdFilterId: number | undefined;
  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  delFilterId: number | undefined;
  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;
}

const initialState: IInitialState = {
  selectedFilterId: 0,
  openInfoAlert: true,

  myFilters: undefined,
  loading: false,
  success: false,
  error: null,

  currentSaleFilters: {},
  currentPurchaseFilters: {},

  createdFilterId: undefined,
  createLoading: false,
  createSuccess: false,
  createError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  delFilterId: undefined,
  delLoading: false,
  delSuccess: false,
  delError: null,
};
export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  { storage, key: "filters", whitelist: ["currentSaleFilters", "currentPurchaseFilters"] },
  (state = initialState, action) => {
    switch (action.type) {
      case SET_SELECTED_FILTER_ID: {
        return {
          ...state,
          selectedFilterId: action.payload.id,
        };
      }

      case SET_OPEN_INFO_ALERT: {
        return {
          ...state,
          openInfoAlert: action.payload.openInfoAlert,
        };
      }

      case SET_CURRENT_SALE_FILTER: {
        // console.log("SET_CURRENT_SALE_FILTER:", action.payload.filter);
        return {
          ...state,
          currentSaleFilters: {
            ...state.currentSaleFilters,
            [action.payload.cropId]: action.payload.filter,
          },
        };
      }
      case CLEAR_CURRENT_SALE_FILTER: {
        return {
          ...state,
          currentSaleFilters: {},
        };
      }

      case SET_CURRENT_PURCHASE_FILTER: {
        // console.log("SET_CURRENT_PURCHASE_FILTER");
        return {
          ...state,
          currentPurchaseFilters: {
            ...state.currentPurchaseFilters,
            [action.payload.cropId]: action.payload.filter,
          },
        };
      }

      case CLEAR_CURRENT_PURCHASE_FILTER: {
        return {
          ...state,
          currentPurchaseFilters: {},
        };
      }

      case FETCH_REQUEST: {
        return {
          ...state,
          myFilters: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_SUCCESS: {
        // console.log("Filters fetch: ", action.payload.data);
        return {
          ...state,
          myFilters: action.payload.data,
          selectedFilterId: 0,
          loading: false,
          success: true,
        };
      }

      case FETCH_FAIL: {
        return { ...state, loading: false, error: action.payload };
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
          createdFilterId: action.payload.id,
          myFilters: undefined,
          createLoading: false,
          createSuccess: true,
        };
      }

      case CREATE_FAIL: {
        return { ...state, createLoading: false, createError: action.payload };
      }

      case CLEAR_EDIT: {
        // console.log("CLEAR_EDIT");
        return { ...state, editLoading: false, editSuccess: false, editError: null };
      }

      case EDIT_REQUEST: {
        // console.log("EDIT_REQUEST");
        return { ...state, editLoading: true, editSuccess: false, editError: null };
      }

      case EDIT_SUCCESS: {
        // console.log("EDIT_SUCCESS: ", action.payload.data);
        if (action.payload.data.data.bid_type === "sale") {
          for (let key in state.currentSaleFilters) {
            if (
              !!state.currentSaleFilters[key] &&
              !!state.currentSaleFilters[key].id &&
              state.currentSaleFilters[key].id === action.payload.data.data.id
            ) {
              return {
                ...state,
                currentSaleFilters: {
                  ...state.currentSaleFilters,
                  [action.payload.data.data.crop.id]: fromApiToFilter(action.payload.data.data),
                },
                myFilters: undefined,
                editLoading: false,
                editSuccess: true,
              };
            }
          }
        }

        if (action.payload.data.data.bid_type === "purchase") {
          for (let key in state.currentPurchaseFilters) {
            if (
              !!state.currentPurchaseFilters[key] &&
              !!state.currentPurchaseFilters[key].id &&
              state.currentPurchaseFilters[key].id === action.payload.data.data.id
            ) {
              return {
                ...state,
                currentPurchaseFilters: {
                  ...state.currentPurchaseFilters,
                  [action.payload.data.data.crop.id]: fromApiToFilter(action.payload.data.data),
                },
                myFilters: undefined,
                editLoading: false,
                editSuccess: true,
              };
            }
          }
        }

        return { ...state, myFilters: undefined, editLoading: false, editSuccess: true };
      }

      case EDIT_FAIL: {
        // console.log("EDIT_FAIL");
        return { ...state, editLoading: false, editError: action.payload };
      }

      case CLEAR_DEL: {
        return {
          ...state,
          delFilterId: undefined,
          delLoading: false,
          delSuccess: false,
          delError: null,
        };
      }

      case DEL_REQUEST: {
        return { ...state, delLoading: true, delSuccess: false, delError: null };
      }

      case DEL_SUCCESS: {
        // console.log("DEL_SUCCESS: ", action.payload);
        return {
          ...state,
          delFilterId: action.payload.id,
          myFilters: undefined,
          delLoading: false,
          delSuccess: true,
        };
      }

      case DEL_FAIL: {
        return { ...state, delLoading: false, delError: action.payload };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  fetchRequest: (type: TBidType) => createAction(FETCH_REQUEST, { type }),
  fetchSuccess: (payload: IServerResponse<IMyFilterItem[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  setSelectedFilterId: (id: number) => createAction(SET_SELECTED_FILTER_ID, { id }),
  setOpenInfoAlert: (openInfoAlert: boolean) =>
    createAction(SET_OPEN_INFO_ALERT, { openInfoAlert }),

  setCurrentSaleFilter: (cropId: number, filter: { [x: string]: any } | undefined) =>
    createAction(SET_CURRENT_SALE_FILTER, { cropId, filter }),
  setCurrentPurchaseFilter: (cropId: number, filter: { [x: string]: any } | undefined) =>
    createAction(SET_CURRENT_PURCHASE_FILTER, { cropId, filter }),

  clearCurrentSaleFilter: () => createAction(CLEAR_CURRENT_SALE_FILTER),
  clearCurrentPurchaseFilter: () => createAction(CLEAR_CURRENT_PURCHASE_FILTER),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (payload: IFilterForCreate) => createAction(CREATE_REQUEST, payload),
  createSuccess: (payload: IMyFilterItem) => createAction(CREATE_SUCCESS, payload),
  createFail: (payload: string) => createAction(CREATE_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (payload: { id: number; data: IFilterForCreate }) =>
    createAction(EDIT_REQUEST, payload),
  editSuccess: (data: IServerResponse<IMyFilterItem>) => createAction(EDIT_SUCCESS, { data }),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (payload: number) => createAction(DEL_REQUEST, payload),
  delSuccess: (payload: IMyFilterItem) => createAction(DEL_SUCCESS, payload),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({ payload }: { payload: { type: TBidType } }) {
  try {
    const { data }: { data: IServerResponse<IMyFilterItem[]> } = yield call(() =>
      getMyFilters(payload.type)
    );
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* createSaga({ payload }: { payload: IFilterForCreate }) {
  try {
    const { data }: { data: IServerResponse<IMyFilterItem> } = yield call(() =>
      createMyFilter(payload)
    );
    yield put(actions.createSuccess(data.data));
  } catch (e) {
    yield put(actions.createFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: IFilterForCreate } }) {
  try {
    const { data }: { data: IServerResponse<IMyFilterItem> } = yield call(() =>
      editMyFilter(payload.id, payload.data)
    );
    yield put(actions.editSuccess(data));
  } catch (e) {
    yield put(actions.editFail(e.response.data.message));
  }
}

function* delSaga({ payload }: { payload: number }) {
  try {
    const { data }: { data: IServerResponse<IMyFilterItem> } = yield call(() =>
      deleteMyFilter(payload)
    );
    yield put(actions.delSuccess(data.data));
  } catch (e) {
    yield put(actions.delFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
}
