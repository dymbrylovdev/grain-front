import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { ITrial, ITrialToRequest } from "../../interfaces/trial";
import { getTrial, editTrial } from "../../crud/trial.crud";

const CLEAR_FETCH = "trial/CLEAR_FETCH";
const FETCH_REQUEST = "trial/FETCH_REQUEST";
const FETCH_SUCCESS = "trial/FETCH_SUCCESS";
const FETCH_FAIL = "trial/FETCH_FAIL";

const CLEAR_EDIT = "trial/CLEAR_EDIT";
const EDIT_REQUEST = "trial/EDIT_REQUEST";
const EDIT_SUCCESS = "trial/EDIT_SUCCESS";
const EDIT_FAIL = "trial/EDIT_FAIL";

export interface IInitialState {
  trial: ITrial | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;
}

const initialState: IInitialState = {
  trial: undefined,
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
        trial: undefined,
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
      // console.log("Fetch trial: ", action.payload.response.data);
      return {
        ...state,
        trial: action.payload.response.data,
        loading: false,
        success: true,
      };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload.error };
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
      return { ...state, editLoading: false, editError: action.payload.error };
    }

    default:
      return state;
  }
};

export const actions = {
  clearFetch: () => createAction(CLEAR_FETCH),
  fetchRequest: () => createAction(FETCH_REQUEST),
  fetchSuccess: (response: IServerResponse<ITrial>) => createAction(FETCH_SUCCESS, { response }),
  fetchFail: (error: string) => createAction(FETCH_FAIL, { error }),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (id: number, data: ITrialToRequest) => createAction(EDIT_REQUEST, { id, data }),
  editSuccess: (response: IServerResponse<ITrial>) => createAction(EDIT_SUCCESS, { response }),
  editFail: (error: string) => createAction(EDIT_FAIL, { error }),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<ITrial> } = yield call(() => getTrial());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: ITrialToRequest } }) {
  try {
    const { data }: { data: IServerResponse<ITrial> } = yield call(() =>
      editTrial(payload.id, payload.data)
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
