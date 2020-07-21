import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { ILocation } from "../../interfaces/locations";
import { getLocation } from "../../crud/location.crud";
import { dataToEntities } from "../../utils";

const CLEAR = "yaLocations/CLEAR";
const FETCH_REQUEST = "yaLocations/FETCH_REQUEST";
const FETCH_SUCCESS = "yaLocations/FETCH_SUCCESS";
const FETCH_FAIL = "yaLocations/FETCH_FAIL";

export interface IInitialState {
  yaLocations: ILocation[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  yaLocations: undefined,
  loading: false,
  success: false,
  error: null,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR: {
      return {
        ...state,
        yaLocations: undefined,
        loading: false,
        success: false,
        error: null,
      };
    }

    case FETCH_REQUEST: {
      return {
        ...state,
        yaLocations: undefined,
        loading: true,
        success: false,
        error: null,
      };
    }

    case FETCH_SUCCESS: {
      //console.log(dataToEntities(action.payload.response));
      return {
        ...state,
        yaLocations: dataToEntities(action.payload.response),
        loading: false,
        success: true,
      };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }

    default:
      return state;
  }
};

export const actions = {
  clear: () => createAction(CLEAR),
  fetchRequest: (payload: any) => createAction(FETCH_REQUEST, payload),
  fetchSuccess: (payload: any) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({ payload }: { payload: any }) {
  if (!payload) return yield put(actions.clear());
  try {
    const { data }: { data: any } = yield call(() => getLocation(payload));
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
}
