import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { getCropParams, getCrops } from "../../crud/crops.crud";
import { ICrop, ICropParam } from "../../interfaces/crops";

const FETCH_REQUEST = "cropParams/FETCH_REQUEST";
const FETCH_SUCCESS = "cropParams/FETCH_SUCCESS";
const FETCH_FAIL = "cropParams/FETCH_FAIL";

const CLEAR_CROP_PARAMS = "cropParams/CLEAR_CROP_PARAMS";
const CROP_PARAMS_REQUEST = "cropParams/CROP_PARAMS_REQUEST";
const CROP_PARAMS_SUCCESS = "cropParams/CROP_PARAMS_SUCCESS";
const CROP_PARAMS_FAIL = "cropParams/CROP_PARAMS_FAIL";

export interface IInitialState {
  crops: ICrop[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  cropParams: ICropParam[] | undefined;
  cropParamsLoading: boolean;
  cropParamsSuccess: boolean;
  cropParamsError: string | null;
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
        //console.log(action.payload.data);
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
        //console.log(action.payload.data);
        return {
          ...state,
          cropParams: action.payload.data,
          cropParamsLoading: false,
          cropParamsSuccess: true,
        };
      }

      case CROP_PARAMS_FAIL: {
        return { ...state, cropParamsLoading: false, cropParamsError: action.payload };
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
  cropParamsRequest: (payload: { cropId: number }) => createAction(CROP_PARAMS_REQUEST, payload),
  cropParamsSuccess: (payload: IServerResponse<ICropParam[]>) =>
    createAction(CROP_PARAMS_SUCCESS, payload),
  cropParamsFail: (payload: string) => createAction(CROP_PARAMS_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<ICrop[]> } = yield call(() => getCrops());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}
function* fetchCropParamsSaga({ payload: { cropId } }: { payload: { cropId: number } }) {
  try {
    const { data }: { data: IServerResponse<ICropParam[]> } = yield call(() =>
      getCropParams(cropId)
    );
    yield put(actions.cropParamsSuccess(data));
  } catch (e) {
    yield put(actions.cropParamsFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.cropParamsRequest>>(
    CROP_PARAMS_REQUEST,
    fetchCropParamsSaga
  );
}
