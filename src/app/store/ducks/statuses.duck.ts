import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { getStatuses } from "../../crud/users.crud";

const FETCH_REQUEST = "statuses/FETCH_REQUEST";
const FETCH_SUCCESS = "statuses/FETCH_SUCCESS";
const FETCH_FAIL = "statuses/FETCH_FAIL";

export interface IInitialState {
  statuses: string[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  statuses: undefined,
  loading: false,
  success: false,
  error: null,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUEST: {
      return {
        ...state,
        statuses: undefined,
        loading: true,
        success: false,
        error: null,
      };
    }

    case FETCH_SUCCESS: {
      //console.log(action.payload.data);
      return { ...state, statuses: action.payload.data, loading: false, success: true };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }

    default:
      return state;
  }
};

export const actions = {
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (payload: IServerResponse<string[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<string[]> } = yield call(() => getStatuses());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
}
