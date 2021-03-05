import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import {
  getCropParams,
  getCrops,
  getAllCropParams,
  delCrop,
  delCropParam,
} from "../../crud/crops.crud";
import { ICrop, ICropParam, TAllCropRequest } from "../../interfaces/crops";
import { getUsersCrops } from "../../crud/users.crud";

const FETCH_REQUEST = "crops2/FETCH_REQUEST";
const FETCH_SUCCESS = "crops2/FETCH_SUCCESS";
const FETCH_FAIL = "crops2/FETCH_FAIL";

const CLEAR_CROP_PARAMS = "crops2/CLEAR_CROP_PARAMS";
const CROP_PARAMS_REQUEST = "crops2/CROP_PARAMS_REQUEST";
const CROP_PARAMS_SUCCESS = "crops2/CROP_PARAMS_SUCCESS";
const CROP_PARAMS_FAIL = "crops2/CROP_PARAMS_FAIL";

const CLEAR_ALL_CROP_PARAMS = "crops2/CLEAR_ALL_CROP_PARAMS";
const ALL_CROP_PARAMS_REQUEST = "crops2/ALL_CROP_PARAMS_REQUEST";
const ALL_CROP_PARAMS_SUCCESS = "crops2/ALL_CROP_PARAMS_SUCCESS";
const ALL_CROP_PARAMS_FAIL = "crops2/ALL_CROP_PARAMS_FAIL";

const CLEAR_DEL = "crops2/CLEAR_DEL";
const DEL_REQUEST = "crops2/DEL_REQUEST";
const DEL_SUCCESS = "crops2/DEL_SUCCESS";
const DEL_FAIL = "crops2/DEL_FAIL";

const CLEAR_DEL_CROP_PARAM = "crops2/CLEAR_DEL_CROP_PARAM";
const DEL_CROP_PARAM_REQUEST = "crops2/DEL_CROP_PARAM_REQUEST";
const DEL_CROP_PARAM_SUCCESS = "crops2/DEL_CROP_PARAM_SUCCESS";
const DEL_CROP_PARAM_FAIL = "crops2/DEL_CROP_PARAM_FAIL";

const CLEAR_USER_CROPS = "crops2/CLEAR_USER_CROPS";
const USER_CROPS_REQUEST = "crops2/USER_CROPS_REQUEST";
const USER_CROPS_SUCCESS = "crops2/USER_CROPS_SUCCESS";
const USER_CROPS_FAIL = "crops2/USER_CROPS_FAIL";

export interface IInitialState {
  crops: ICrop[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  cropParams: ICropParam[] | undefined;
  cropParamsLoading: boolean;
  cropParamsSuccess: boolean;
  cropParamsError: string | null;

  allCropParams: { [key: string]: ICropParam[] } | undefined;
  allCropParamsLoading: boolean;
  allCropParamsSuccess: boolean;
  allCropParamsError: string | null;

  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;

  delCropParamLoading: boolean;
  delCropParamSuccess: boolean;
  delCropParamError: string | null;

  usersCropsLoading: boolean;
  usersCropsSuccess: boolean;
  usersCropsError: string | null;
}

const initialState: IInitialState = {
  crops: undefined,
  loading: false,
  success: false,
  error: null,

  cropParams: undefined,
  cropParamsLoading: false,
  cropParamsSuccess: false,
  cropParamsError: null,

  allCropParams: undefined,
  allCropParamsLoading: false,
  allCropParamsSuccess: false,
  allCropParamsError: null,

  delLoading: false,
  delSuccess: false,
  delError: null,

  delCropParamLoading: false,
  delCropParamSuccess: false,
  delCropParamError: null,

  usersCropsLoading: false,
  usersCropsSuccess: false,
  usersCropsError: null,
};

export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  { storage, key: "crops", whitelist: ["user", "authToken"] },
  (state = initialState, action) => {
    switch (action.type) {
      case FETCH_REQUEST: {
        return {
          ...state,
          crops: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_SUCCESS: {
        //console.log("FETCH CROPS: ", action.payload.data);
        return { ...state, crops: action.payload.data, loading: false, success: true };
      }

      case FETCH_FAIL: {
        return { ...state, loading: false, error: action.payload };
      }

      case CLEAR_CROP_PARAMS: {
        return {
          ...state,
          cropParams: undefined,
          cropParamsLoading: false,
          cropParamsSuccess: false,
          cropParamsError: null,
        };
      }

      case CROP_PARAMS_REQUEST: {
        return {
          ...state,
          cropParams: undefined,
          cropParamsLoading: true,
          cropParamsSuccess: false,
          cropParamsError: null,
        };
      }

      case CROP_PARAMS_SUCCESS: {
        let newCrops: ICropParam[] = [];
        action.payload.data.forEach(param => {
          if (!param.is_deleted) newCrops.push(param)
        });

        return {
          ...state,
          cropParams: newCrops,
          cropParamsLoading: false,
          cropParamsSuccess: true,
        };
      }

      case CROP_PARAMS_FAIL: {
        return { ...state, cropParamsLoading: false, cropParamsError: action.payload };
      }

      case CLEAR_ALL_CROP_PARAMS: {
        return {
          ...state,
          allCropParams: undefined,
          allCropParamsLoading: false,
          allCropParamsSuccess: false,
          allCropParamsError: null,
        };
      }

      case ALL_CROP_PARAMS_REQUEST: {
        return {
          ...state,
          allCropParams: undefined,
          allCropParamsLoading: true,
          allCropParamsSuccess: false,
          allCropParamsError: null,
        };
      }

      case ALL_CROP_PARAMS_SUCCESS: {
        // console.log("ALL_CROP_PARAMS: ", action.payload.data);
        return {
          ...state,
          allCropParams: action.payload.data,
          allCropParamsLoading: false,
          allCropParamsSuccess: true,
        };
      }

      case ALL_CROP_PARAMS_FAIL: {
        return { ...state, allCropParamsLoading: false, allCropParamsError: action.payload };
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

      case CLEAR_DEL_CROP_PARAM: {
        return {
          ...state,
          delCropParamLoading: false,
          delCropParamSuccess: false,
          delCropParamError: null,
        };
      }

      case DEL_CROP_PARAM_REQUEST: {
        return {
          ...state,
          delCropParamLoading: true,
          delCropParamSuccess: false,
          delCropParamError: null,
        };
      }

      case DEL_CROP_PARAM_SUCCESS: {
        return { ...state, delCropParamLoading: false, delCropParamSuccess: true };
      }

      case DEL_CROP_PARAM_FAIL: {
        return { ...state, delCropParamLoading: false, delCropParamError: action.payload };
      }

      case CLEAR_USER_CROPS: {
        return { ...state, usersCropsLoading: false, usersCropsSuccess: false, usersCropsError: null }
      }
  
      case USER_CROPS_REQUEST: {
        return { ...state, crops: undefined, usersCropsLoading: true, usersCropsSuccess: false, usersCropsError: null }
      }
  
      case USER_CROPS_SUCCESS: {
        return { ...state, crops: action.payload.data, usersCropsLoading: false, usersCropsSuccess: true }
      }
  
      case USER_CROPS_FAIL: {
        return { ...state, usersCropsLoading: false, usersCropsError: action.payload }
      }

      default:
        return state;
    }
  }
);

export const actions = {
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (payload: IServerResponse<ICrop[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  clearCropParams: () => createAction(CLEAR_CROP_PARAMS),
  cropParamsRequest: (cropId: number) => createAction(CROP_PARAMS_REQUEST, { cropId }),
  cropParamsSuccess: (payload: IServerResponse<ICropParam[]>) =>
    createAction(CROP_PARAMS_SUCCESS, payload),
  cropParamsFail: (payload: string) => createAction(CROP_PARAMS_FAIL, payload),

  clearAllCropParams: () => createAction(CLEAR_ALL_CROP_PARAMS),
  allCropParamsRequest: (type: TAllCropRequest) => createAction(ALL_CROP_PARAMS_REQUEST, { type }),
  allCropParamsSuccess: (payload: IServerResponse<{ [key: string]: ICropParam[] }>) =>
    createAction(ALL_CROP_PARAMS_SUCCESS, payload),
  allCropParamsFail: (payload: string) => createAction(ALL_CROP_PARAMS_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (id: number) => createAction(DEL_REQUEST, { id }),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),

  clearDelCropParam: () => createAction(CLEAR_DEL_CROP_PARAM),
  delCropParamRequest: (id: number) => createAction(DEL_CROP_PARAM_REQUEST, { id }),
  delCropParamSuccess: () => createAction(DEL_CROP_PARAM_SUCCESS),
  delCropParamFail: (payload: string) => createAction(DEL_CROP_PARAM_FAIL, payload),

  clearUserCrops: () => createAction(CLEAR_USER_CROPS),
  userCropsRequest: (payload: number) => createAction(USER_CROPS_REQUEST, payload),
  userCropsSuccess: (payload: IServerResponse<ICrop[]>) => createAction(USER_CROPS_SUCCESS, payload),
  userCropsFail: (payload: string) => createAction(USER_CROPS_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<ICrop[]> } = yield call(() => getCrops());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchCropParamsSaga({ payload: { cropId } }: { payload: { cropId: number } }) {
  try {
    const { data }: { data: IServerResponse<ICropParam[]> } = yield call(() =>
      getCropParams(cropId)
    );
    yield put(actions.cropParamsSuccess(data));
  } catch (e) {
    yield put(actions.cropParamsFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchAllCropParamsSaga({ payload }: { payload: { type: TAllCropRequest } }) {
  try {
    const { data }: { data: IServerResponse<{ [key: string]: ICropParam[] }> } = yield call(() =>
      getAllCropParams(payload.type)
    );
    yield put(actions.allCropParamsSuccess(data));
  } catch (e) {
    yield put(actions.allCropParamsFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => delCrop(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* delCropParamSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => delCropParam(payload.id));
    yield put(actions.delCropParamSuccess());
  } catch (e) {
    yield put(actions.delCropParamFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* userCropsSaga({ payload }: { payload: number }) {
  try {
    const { data }: { data: IServerResponse<ICrop[]> } = yield call(() => getUsersCrops(payload));
    yield put(actions.userCropsSuccess(data));
  } catch (e) {
    yield put(actions.userCropsFail(e?.response?.data?.message) || "Ошибка соединения.");
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.cropParamsRequest>>(
    CROP_PARAMS_REQUEST,
    fetchCropParamsSaga
  );
  yield takeLatest<ReturnType<typeof actions.allCropParamsRequest>>(
    ALL_CROP_PARAMS_REQUEST,
    fetchAllCropParamsSaga
  );
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
  yield takeLatest<ReturnType<typeof actions.delCropParamRequest>>(
    DEL_CROP_PARAM_REQUEST,
    delCropParamSaga
  );
  yield takeLatest<ReturnType<typeof actions.userCropsRequest>>(USER_CROPS_REQUEST, userCropsSaga);
}
