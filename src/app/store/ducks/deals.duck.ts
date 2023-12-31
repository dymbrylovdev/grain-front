import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";
import { persistReducer } from "redux-persist";
import { PersistPartial } from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { getDeals, getDealsFilters, editDealsFilter } from "../../crud/deals.crud";
import { IDeal, IDealsFilter, IDealsFilterForEdit } from "../../interfaces/deals";

const FETCH_REQUEST = "deals/FETCH_REQUEST";
const FETCH_SUCCESS = "deals/FETCH_SUCCESS";
const FETCH_FAIL = "deals/FETCH_FAIL";

const SET_WEEKS = "deals/SET_WEEKS";
const SET_TERM = "deals/SET_TERM";
const SET_PREPAYMENT_AMOUNT = "deals/SET_PREPAYMENT_AMOUNT";
const SET_DEAL = "deals/SET_DEAL";

const CLEAR_FETCH_FILTERS = "deals/CLEAR_FETCH_FILTERS";
const FETCH_FILTERS_REQUEST = "deals/FETCH_FILTERS_REQUEST";
const FETCH_FILTERS_SUCCESS = "deals/FETCH_FILTERS_SUCCESS";
const FETCH_FILTERS_FAIL = "deals/FETCH_FILTERS_FAIL";

const FETCH_BY_BID_ID = "deals/FETCH_BY_BID_ID";

const CLEAR_EDIT_FILTER = "deals/CLEAR_EDIT_FILTER";
const EDIT_FILTER_REQUEST = "deals/EDIT_FILTER_REQUEST";
const EDIT_FILTER_SUCCESS = "deals/EDIT_FILTER_SUCCESS";
const EDIT_FILTER_FAIL = "deals/EDIT_FILTER_FAIL";

export interface IInitialState {
  page: number;
  per_page: number;
  total: number;
  weeks: number;
  term: number | undefined;
  min_prepayment_amount?: number | undefined;
  deals: IDeal[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  deal: IDeal | undefined;

  filters: IDealsFilter[] | undefined;
  filtersLoading: boolean;
  filtersSuccess: boolean;
  filtersError: string | null;

  editFilterLoading: boolean;
  editFilterSuccess: boolean;
  editFilterError: string | null;
}

const initialState: IInitialState = {
  page: 1,
  per_page: 20,
  total: 0,
  weeks: 1,
  term: undefined,
  min_prepayment_amount: undefined,
  deals: undefined,
  loading: false,
  success: false,
  error: null,

  deal: undefined,

  filters: undefined,
  filtersLoading: false,
  filtersSuccess: false,
  filtersError: null,

  editFilterLoading: false,
  editFilterSuccess: false,
  editFilterError: null,
};

export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  { storage, key: "deals", whitelist: ["weeks", "term", "min_prepayment_amount"] },
  (state = initialState, action) => {
    switch (action.type) {
      case FETCH_REQUEST: {
        return {
          ...state,
          deals: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_BY_BID_ID: {
        return {
          ...state,
          deals: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_SUCCESS: {
        return {
          ...state,
          page: action.payload.page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          deals: action.payload.data,
          loading: false,
          success: true,
        };
      }

      case FETCH_FAIL: {
        return { ...state, loading: false, error: action.payload };
      }

      case SET_WEEKS: {
        return { ...state, weeks: action.payload.weeks };
      }

      case SET_TERM: {
        return { ...state, term: action.payload.term };
      }

      case SET_PREPAYMENT_AMOUNT: {
        return { ...state, min_prepayment_amount: action.payload.min_prepayment_amount };
      }

      case SET_DEAL: {
        return { ...state, deal: action.payload.deal };
      }

      case CLEAR_FETCH_FILTERS: {
        return {
          ...state,
          filtersLoading: false,
          filtersSuccess: false,
          filtersError: null,
        };
      }

      case FETCH_FILTERS_REQUEST: {
        return {
          ...state,
          filtersLoading: true,
          filtersSuccess: false,
          filtersError: null,
        };
      }

      case FETCH_FILTERS_SUCCESS: {
        return {
          ...state,
          filters: action.payload.data,
          filtersLoading: false,
          filtersSuccess: true,
        };
      }

      case FETCH_FILTERS_FAIL: {
        return {
          ...state,
          filters: undefined,
          filtersLoading: false,
          filtersError: action.payload,
        };
      }

      case CLEAR_EDIT_FILTER: {
        return {
          ...state,
          editFilterLoading: false,
          editFilterSuccess: false,
          editFilterError: null,
        };
      }

      case EDIT_FILTER_REQUEST: {
        return {
          ...state,
          editFilterLoading: true,
          editFilterSuccess: false,
          editFilterError: null,
        };
      }

      case EDIT_FILTER_SUCCESS: {
        return {
          ...state,
          editFilterLoading: false,
          editFilterSuccess: true,
        };
      }

      case EDIT_FILTER_FAIL: {
        return { ...state, editFilterLoading: false, editFilterError: action.payload };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  fetchRequest: (
    page: number,
    perPage: number,
    weeks: number,
    term: number,
    min_prepayment_amount: number | undefined,
    vendor_id?: number,
    crop_id?: number,
    bid_id?: number,
    manager_id?: number,
    user_active?: boolean,
    roles?: string
  ) =>
    createAction(FETCH_REQUEST, {
      page,
      perPage,
      weeks,
      term,
      min_prepayment_amount,
      vendor_id,
      crop_id,
      bid_id,
      manager_id,
      user_active,
      roles,
    }),
  fetchSuccess: (payload: IServerResponse<IDeal[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  setWeeks: (weeks: number) => createAction(SET_WEEKS, { weeks }),
  setTerm: (term: number | undefined) => createAction(SET_TERM, { term }),
  setPrepayment: (min_prepayment_amount: number | undefined) => createAction(SET_PREPAYMENT_AMOUNT, { min_prepayment_amount }),
  setDeal: (deal: IDeal | undefined) => createAction(SET_DEAL, { deal }),

  clearFetchFilters: () => createAction(CLEAR_FETCH_FILTERS),
  fetchFiltersRequest: () => createAction(FETCH_FILTERS_REQUEST),
  fetchFiltersSuccess: (payload: IServerResponse<IDealsFilter[]>) => createAction(FETCH_FILTERS_SUCCESS, payload),
  fetchFiltersFail: (payload: string) => createAction(FETCH_FILTERS_FAIL, payload),

  fetchByBidId: (page: number, perPage: number, weeks: number, term: number, min_prepayment_amount: number | undefined, bid_id?: number) =>
    createAction(FETCH_BY_BID_ID, { page, perPage, weeks, term, min_prepayment_amount, bid_id }),

  clearEditFilter: () => createAction(CLEAR_EDIT_FILTER),
  editFilterRequest: (id: number, data: IDealsFilterForEdit) => createAction(EDIT_FILTER_REQUEST, { id, data }),
  editFilterSuccess: () => createAction(EDIT_FILTER_SUCCESS),
  editFilterFail: (payload: string) => createAction(EDIT_FILTER_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({
  payload,
}: {
  payload: {
    page: number;
    perPage: number;
    weeks: number;
    term: number;
    min_prepayment_amount: number | undefined;
    vendor_id?: number;
    crop_id?: number;
    bid_id?: number;
    manager_id?: number;
    user_active?: boolean;
    roles?: string;
  };
}) {
  try {
    const { data }: { data: IServerResponse<IDeal[]> } = yield call(() =>
      getDeals(
        payload.page,
        payload.perPage,
        payload.weeks,
        payload.term,
        payload.min_prepayment_amount,
        payload.vendor_id,
        payload.crop_id,
        payload.bid_id,
        payload.manager_id,
        payload.user_active,
        undefined,
        payload.roles
      )
    );
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchFiltersSaga() {
  try {
    const { data }: { data: IServerResponse<IDealsFilter[]> } = yield call(() => getDealsFilters());
    yield put(actions.fetchFiltersSuccess(data));
  } catch (e) {
    yield put(actions.fetchFiltersFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editFilterSaga({ payload }: { payload: { id: number; data: IDealsFilterForEdit } }) {
  try {
    yield call(() => editDealsFilter(payload.id, payload.data));
    yield put(actions.editFilterSuccess());
  } catch (e) {
    yield put(actions.editFilterFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchByBidId>>(FETCH_BY_BID_ID, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchFiltersRequest>>(FETCH_FILTERS_REQUEST, fetchFiltersSaga);
  yield takeLatest<ReturnType<typeof actions.editFilterRequest>>(EDIT_FILTER_REQUEST, editFilterSaga);
}
