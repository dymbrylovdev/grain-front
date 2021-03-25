import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { ITariff, ITariffToRequest } from "../../interfaces/tariffs";
import {
  getTariffs,
  editTariff,
  editTariffPeriod,
  editTariffLimits,
  getTariffsProlongations,
  getFondyCredentials,
} from "../../crud/tariffs.crud";

const CLEAR_FETCH = "tariffs/CLEAR_FETCH";
const FETCH_REQUEST = "tariffs/FETCH_REQUEST";
const FETCH_SUCCESS = "tariffs/FETCH_SUCCESS";
const FETCH_FAIL = "tariffs/FETCH_FAIL";

const SET_TARIFF = "tariffs/SET_TARIFF";
const CLEAR_SELECTED_TARIFF = "tariffs/CLEAR_SELECTED_TARIFF";
const SET_SELECTED_DATA = "tariffs/SET_SELECTED_DATA";

const CLEAR_EDIT = "tariffs/CLEAR_EDIT";
const EDIT_REQUEST = "tariffs/EDIT_REQUEST";
const EDIT_SUCCESS = "tariffs/EDIT_SUCCESS";
const EDIT_FAIL = "tariffs/EDIT_FAIL";

const CLEAR_EDIT_PERIOD = "tariffs/CLEAR_EDIT_PERIOD";
const EDIT_PERIOD_REQUEST = "tariffs/EDIT_PERIOD_REQUEST";
const EDIT_PERIOD_SUCCESS = "tariffs/EDIT_PERIOD_SUCCESS";
const EDIT_PERIOD_FAIL = "tariffs/EDIT_PERIOD_FAIL";

const CLEAR_EDIT_LIMITS = "tariffs/CLEAR_EDIT_LIMITS";
const EDIT_LIMITS_REQUEST = "tariffs/EDIT_LIMITS_REQUEST";
const EDIT_LIMITS_SUCCESS = "tariffs/EDIT_LIMITS_SUCCESS";
const EDIT_LIMITS_FAIL = "tariff/EDIT_LIMITS_FAIL";

const CLEAR_FONDY_CREDENTIALS = "tariffs/CLEAR_FONDY_CREDENTIALS";
const FONDY_CREDENTIALS_REQUEST = "tariffs/FONDY_CREDENTIALS_REQUEST";
const FONDY_CREDENTIALS_SUCCESS = "tariffs/FONDY_CREDENTIALS_SUCCESS";
const FONDY_CREDENTIALS_FAIL = "tariffs/FONDY_CREDENTIALS_FAIL";

const SET_TARIFF_TABLE = "tariffs/SET_TARIFF_TABLE";
export interface IInitialState {
  tariffs: ITariff[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;
  selectedTariff: ITariff | null;
  selectedDate: Date;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  editPeriodLoading: boolean;
  editPeriodSuccess: boolean;
  editPeriodError: string | null;

  editLimitsLoading: boolean;
  editLimitsSuccess: boolean;
  editLimitsError: string | null;

  merchant_id: string | undefined;
  fondyCredentialsLoading: boolean;
  fondyCredentialsSuccess: boolean;
  fondyCredentialsError: string | null;

  showTariffTable: number;
}

const initialState: IInitialState = {
  tariffs: undefined,
  loading: false,
  success: false,
  error: null,
  selectedTariff: null,
  selectedDate: new Date(),

  editLoading: false,
  editSuccess: false,
  editError: null,

  editPeriodLoading: false,
  editPeriodSuccess: false,
  editPeriodError: null,

  editLimitsLoading: false,
  editLimitsSuccess: false,
  editLimitsError: null,

  merchant_id: undefined,
  fondyCredentialsLoading: false,
  fondyCredentialsSuccess: false,
  fondyCredentialsError: null,

  showTariffTable: 0,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_SELECTED_TARIFF: {
      return {
        ...state,
        selectedTariff: null,
      };
    }

    case SET_TARIFF: {
      const selectedTariff = state.tariffs?.find(item => item.id === action.payload.id);

      if (!selectedTariff) return { ...state };
      return {
        ...state,
        selectedTariff,
      };
    }

    case SET_SELECTED_DATA: {
      return {
        ...state,
        selectedDate: action.payload.selectedDate,
      };
    }

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

    case CLEAR_EDIT_PERIOD: {
      return {
        ...state,
        tariff: undefined,
        editPeriodLoading: false,
        editPeriodSuccess: false,
        editPeriodError: null,
      };
    }

    case EDIT_PERIOD_REQUEST: {
      return {
        ...state,
        editPeriodLoading: true,
        editPeriodSuccess: false,
        editPeriodError: null,
      };
    }

    case EDIT_PERIOD_SUCCESS: {
      let newTariffs: ITariff[] = [];
      state.tariffs?.forEach(item => {
        if (
          item.tariff_period
            ? item.tariff_period.id === action.payload.response.data.id
            : item.tariff_period === null
        ) {
          let newItem = Object.assign({}, item);
          newItem.tariff_period = action.payload.response.data;
          newTariffs.push(newItem);
        } else {
          newTariffs.push(item);
        }
      });
      return {
        ...state,
        tariffs: newTariffs,
        editPeriodLoading: false,
        editPeriodSuccess: true,
      };
    }

    case EDIT_PERIOD_FAIL: {
      return {
        ...state,
        editPeriodLoading: false,
        editPeriodError: action.payload.error,
      };
    }

    case CLEAR_EDIT_LIMITS: {
      return {
        ...state,
        tariff: undefined,
        editLimitsLoading: false,
        editLimitsSuccess: false,
        editLimitsError: null,
      };
    }

    case EDIT_LIMITS_REQUEST: {
      return {
        ...state,
        editLimitsLoading: true,
        editLimitsSuccess: false,
        editLimitsError: null,
      };
    }

    case EDIT_LIMITS_SUCCESS: {
      let newTariffs: ITariff[] = [];
      state.tariffs?.forEach(item => {
        if (
          item.tariff_limits
            ? item.tariff_limits.id === action.payload.response.data.id
            : item.tariff_limits === null
        ) {
          let newItem = Object.assign({}, item);
          //@ts-ignore
          newItem.tariff_limits = action.payload.response.data;
          newTariffs.push(newItem);
        } else {
          newTariffs.push(item);
        }
      });
      return {
        ...state,
        tariffs: newTariffs,
        editLimitsLoading: false,
        editLimitsSuccess: true,
      };
    }

    case EDIT_LIMITS_FAIL: {
      return {
        ...state,
        editLimitsLoading: false,
        editLimitsError: action.payload.error,
      };
    }

    case CLEAR_FONDY_CREDENTIALS: {
      return {
        ...state,
        merchant_id: undefined,
        fondyCredentialsLoading: false,
        fondyCredentialsSuccess: false,
        fondyCredentialsError: null,
      };
    }

    case FONDY_CREDENTIALS_REQUEST: {
      return {
        ...state,
        fondyCredentialsLoading: true,
        fondyCredentialsSuccess: false,
        fondyCredentialsError: null,
      };
    }

    case FONDY_CREDENTIALS_SUCCESS: {
      return {
        ...state,
        merchant_id: action.payload.response.data,
        fondyCredentialsLoading: false,
        fondyCredentialsSuccess: true,
      };
    }

    case FONDY_CREDENTIALS_FAIL: {
      return {
        ...state,
        fondyCredentialsLoading: false,
        fondyCredentialsError: action.payload.error,
      };
    }

    case SET_TARIFF_TABLE: {
      return {
        ...state,
        showTariffTable: action.payload,
      };
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
  setSelectedTariff: (id: number) => createAction(SET_TARIFF, { id }),
  clearSelectedTariff: () => createAction(CLEAR_SELECTED_TARIFF),
  setSelectedDate: (selectedDate: Date) => createAction(SET_SELECTED_DATA, { selectedDate }),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (id: number, data: ITariffToRequest) => createAction(EDIT_REQUEST, { id, data }),
  editSuccess: (response: IServerResponse<ITariff>) => createAction(EDIT_SUCCESS, { response }),
  editFail: (error: string) => createAction(EDIT_FAIL, { error }),

  clearEditPeriod: () => createAction(CLEAR_EDIT_PERIOD),
  editPeriodRequest: (id: number, data: ITariffToRequest) =>
    createAction(EDIT_PERIOD_REQUEST, { id, data }),
  editPeriodSuccess: (response: IServerResponse<ITariff>) =>
    createAction(EDIT_PERIOD_SUCCESS, { response }),
  editPeriodFail: (error: string) => createAction(EDIT_PERIOD_FAIL, { error }),

  clearEditLimits: () => createAction(CLEAR_EDIT_LIMITS),
  editLimitsRequest: (id: number, data: ITariffToRequest) =>
    createAction(EDIT_LIMITS_REQUEST, { id, data }),
  editLimitsSuccess: (response: IServerResponse<ITariff>) =>
    createAction(EDIT_LIMITS_SUCCESS, { response }),
  editLimitsFail: (error: string) => createAction(EDIT_LIMITS_FAIL, { error }),

  clearFondyCredentials: () => createAction(CLEAR_FONDY_CREDENTIALS),
  fondyCredentialsRequest: () => createAction(FONDY_CREDENTIALS_REQUEST),
  fondyCredentialsSuccess: (response: IServerResponse<any>) =>
    createAction(FONDY_CREDENTIALS_SUCCESS, { response }),
  fondyCredentialsFail: (error: string) => createAction(FONDY_CREDENTIALS_FAIL, { error }),

  setTariffTable: (newTariffTable: number) => createAction(SET_TARIFF_TABLE, newTariffTable),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga() {
  try {
    const { data }: { data: IServerResponse<ITariff[]> } = yield call(() => getTariffs());
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: ITariffToRequest } }) {
  try {
    const { data }: { data: IServerResponse<ITariff> } = yield call(() =>
      editTariff(payload.id, payload.data)
    );
    yield put(actions.editSuccess(data));
  } catch (e) {
    yield put(actions.editFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editPeriodSaga({ payload }: { payload: { id: number; data: ITariffToRequest } }) {
  try {
    const { data }: { data: IServerResponse<ITariff> } = yield call(() =>
      editTariffPeriod(payload.id, payload.data)
    );
    yield put(actions.editPeriodSuccess(data));
  } catch (e) {
    yield put(actions.editPeriodFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editLimitsSaga({ payload }: { payload: { id: number; data: ITariffToRequest } }) {
  try {
    const { data }: { data: IServerResponse<ITariff> } = yield call(() =>
      editTariffLimits(payload.id, payload.data)
    );
    yield put(actions.editLimitsSuccess(data));
  } catch (e) {
    yield put(actions.editLimitsFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fondyCredentialsSaga() {
  try {
    const { data }: { data: IServerResponse<any> } = yield call(() => getFondyCredentials());
    yield put(actions.fondyCredentialsSuccess(data));
  } catch (e) {
    yield put(actions.fondyCredentialsFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.editPeriodRequest>>(
    EDIT_PERIOD_REQUEST,
    editPeriodSaga
  );
  yield takeLatest<ReturnType<typeof actions.editLimitsRequest>>(
    EDIT_LIMITS_REQUEST,
    editLimitsSaga
  );
  yield takeLatest<ReturnType<typeof actions.fondyCredentialsRequest>>(
    FONDY_CREDENTIALS_REQUEST,
    fondyCredentialsSaga
  );
}
