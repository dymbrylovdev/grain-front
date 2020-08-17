import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { ITariff, ITariffToRequest } from "../../interfaces/tariffs";
import { getTariffs, editTariff } from "../../crud/tariffs.crud";

const CLEAR_FETCH = "tariffs/CLEAR_FETCH";
const FETCH_REQUEST = "tariffs/FETCH_REQUEST";
const FETCH_SUCCESS = "tariffs/FETCH_SUCCESS";
const FETCH_FAIL = "tariffs/FETCH_FAIL";

const CLEAR_EDIT = "tariffs/CLEAR_EDIT";
const EDIT_REQUEST = "tariffs/EDIT_REQUEST";
const EDIT_SUCCESS = "tariffs/EDIT_SUCCESS";
const EDIT_FAIL = "tariffs/EDIT_FAIL";

export interface IInitialState {
  tariffs: ITariff[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;
}

const initialState: IInitialState = {
  tariffs: undefined,
  loading: false,
  success: false,
  error: null,

  editLoading: false,
  editSuccess: false,
  editError: null,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_FETCH: {
      return {
        ...state,
        tariffs: undefined,
        loading: false,
        success: false,
        error: null,
      };
    }

    case FETCH_REQUEST: {
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    }

    case FETCH_SUCCESS: {
      // console.log("Fetch tariffs: ", action.payload.response.data);
      return {
        ...state,
        tariffs: action.payload.response.data,
        loading: false,
        success: true,
      };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload.error };
    }

    case CLEAR_EDIT: {
      return {
        ...state,
        tariff: undefined,
        editLoading: false,
        editSuccess: false,
        editError: null,
      };
    }

    case EDIT_REQUEST: {
      return { ...state, editLoading: true, editSuccess: false, editError: null };
    }

    case EDIT_SUCCESS: {
      let newTariffs: ITariff[] = [];
      state.tariffs?.forEach(item => {
        if (item.id === action.payload.response.data.id) {
          newTariffs.push(action.payload.response.data);
        } else {
          newTariffs.push(item);
        }
      });
      return {
        ...state,
        tariffs: newTariffs,
        editLoading: false,
        editSuccess: true,
      };
    }

    case EDIT_FAIL: {
      return { ...state, editLoading: false, editError: action.payload.error };
    }

    default:
      return state;
  }
};

export const actions = {
  clearFetch: () => createAction(CLEAR_FETCH),
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (response: IServerResponse<ITariff[]>) => createAction(FETCH_SUCCESS, { response }),
  fetchFail: (error: string) => createAction(FETCH_FAIL, { error }),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (id: number, data: ITariffToRequest) => createAction(EDIT_REQUEST, { id, data }),
  editSuccess: (response: IServerResponse<ITariff>) => createAction(EDIT_SUCCESS, { response }),
  editFail: (error: string) => createAction(EDIT_FAIL, { error }),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<ITariff[]> } = yield call(() => getTariffs());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: ITariffToRequest } }) {
  try {
    const { data }: { data: IServerResponse<ITariff> } = yield call(() =>
      editTariff(payload.id, payload.data)
    );
    yield put(actions.editSuccess(data));
  } catch (e) {
    yield put(actions.editFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
}
