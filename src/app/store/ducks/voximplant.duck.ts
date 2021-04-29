import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { call, put, takeLatest } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { getTrial } from "../../crud/trial.crud";

const CLEAR_INIT = "trial/CLEAR_INIT";
const INIT_REQUEST = "trial/INIT_REQUEST";
const INIT_SUCCESS = "trial/INIT_SUCCESS";
const INIT_FAIL = "trial/INIT_FAIL";

export interface IInitialState {
  initLoading: boolean;
  initSuccess: boolean;
  initError: string | null;
}

const initialState: IInitialState = {
  initLoading: false,
  initSuccess: false,
  initError: null,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_INIT: {
      return {
        ...state,
        loading: false,
        success: false,
        error: null,
      };
    }

    case INIT_REQUEST: {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }

    case INIT_SUCCESS: {
      // console.log("Fetch trial: ", action.payload.response.data);
      return {
        ...state,
        loading: false,
        success: true,
      };
    }

    case INIT_FAIL: {
      return { ...state, loading: false, error: action.payload.error };
    }

    default:
      return state;
  }
};

export const actions = {
  clearInit: () => createAction(CLEAR_INIT),
  initRequest: () => createAction(INIT_REQUEST),
  initSuccess: () => createAction(INIT_SUCCESS),
  initFail: (error: string) => createAction(INIT_FAIL, { error }),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    yield call(() => getTrial());
    yield put(actions.initSuccess());
    yield put(actions.clearInit());
  } catch (e) {
    yield put(actions.initFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.initRequest>>(INIT_REQUEST, fetchSaga);
}
