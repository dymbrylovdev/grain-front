import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import { getUserById, deleteUser, createUser, editUser } from "../../crud/users.crud";
import { IUser, IUserForCreate, IUserForEdit } from "../../interfaces/users";
import { getDeals, getDealsFilters } from "../../crud/deals.crud";
import { IDeal, IDealsFilter } from "../../interfaces/deals";

const FETCH_REQUEST = "deals/FETCH_REQUEST";
const FETCH_SUCCESS = "deals/FETCH_SUCCESS";
const FETCH_FAIL = "deals/FETCH_FAIL";

const SET_DEAL = "deals/SET_DEAL";

const CLEAR_FETCH_BY_ID = "deals/CLEAR_FETCH_BY_ID";
const FETCH_BY_ID_REQUEST = "deals/FETCH_BY_ID_REQUEST";
const FETCH_BY_ID_SUCCESS = "deals/FETCH_BY_ID_SUCCESS";
const FETCH_BY_ID_FAIL = "deals/FETCH_BY_ID_FAIL";

const CLEAR_FETCH_FILTERS = "deals/CLEAR_FETCH_FILTERS";
const FETCH_FILTERS_REQUEST = "deals/FETCH_FILTERS_REQUEST";
const FETCH_FILTERS_SUCCESS = "deals/FETCH_FILTERS_SUCCESS";
const FETCH_FILTERS_FAIL = "deals/FETCH_FILTERS_FAIL";

const CLEAR_CREATE = "deals/CLEAR_CREATE";
const CREATE_REQUEST = "deals/CREATE_REQUEST";
const CREATE_SUCCESS = "deals/CREATE_SUCCESS";
const CREATE_FAIL = "deals/CREATE_FAIL";

const CLEAR_EDIT = "deals/CLEAR_EDIT";
const EDIT_REQUEST = "deals/EDIT_REQUEST";
const EDIT_SUCCESS = "deals/EDIT_SUCCESS";
const EDIT_FAIL = "deals/EDIT_FAIL";

const CLEAR_DEL = "deals/CLEAR_DEL";
const DEL_REQUEST = "deals/DEL_REQUEST";
const DEL_SUCCESS = "deals/DEL_SUCCESS";
const DEL_FAIL = "deals/DEL_FAIL";

export interface IInitialState {
  page: number;
  per_page: number;
  total: number;
  deals: IDeal[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  deal: IDeal | undefined;
  byIdLoading: boolean;
  byIdSuccess: boolean;
  byIdError: string | null;

  filters: IDealsFilter[] | undefined;
  filtersLoading: boolean;
  filtersSuccess: boolean;
  filtersError: string | null;

  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;
}

const initialState: IInitialState = {
  page: 1,
  per_page: 20,
  total: 0,
  deals: undefined,
  loading: false,
  success: false,
  error: null,

  deal: undefined,
  byIdLoading: false,
  byIdSuccess: false,
  byIdError: null,

  filters: undefined,
  filtersLoading: false,
  filtersSuccess: false,
  filtersError: null,

  createLoading: false,
  createSuccess: false,
  createError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  delLoading: false,
  delSuccess: false,
  delError: null,
};

export const reducer: Reducer<IInitialState, TAppActions> = (state = initialState, action) => {
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

    case FETCH_SUCCESS: {
      console.log("Fetch deals: ", action.payload);
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

    case SET_DEAL: {
      return { ...state, deal: action.payload.deal };
    }

    case CLEAR_FETCH_BY_ID: {
      //console.log("CLEAR_FETCH_BY_ID");
      return {
        ...state,
        byIdLoading: false,
        byIdSuccess: false,
        byIdError: null,
      };
    }

    case FETCH_BY_ID_REQUEST: {
      //console.log("FETCH_BY_ID_REQUEST");
      return {
        ...state,
        byIdLoading: true,
        byIdSuccess: false,
        byIdError: null,
      };
    }

    case FETCH_BY_ID_SUCCESS: {
      //console.log("Fetch deal: ", action.payload);
      return {
        ...state,
        deal: action.payload.data,
        byIdLoading: false,
        byIdSuccess: true,
      };
    }

    case FETCH_BY_ID_FAIL: {
      return { ...state, deal: undefined, byIdLoading: false, byIdError: action.payload };
    }

    case CLEAR_FETCH_FILTERS: {
      //console.log("CLEAR_FETCH_FILTERS");
      return {
        ...state,
        filtersLoading: false,
        filtersSuccess: false,
        filtersError: null,
      };
    }

    case FETCH_FILTERS_REQUEST: {
      //console.log("FETCH_FILTERS_REQUEST");
      return {
        ...state,
        filtersLoading: true,
        filtersSuccess: false,
        filtersError: null,
      };
    }

    case FETCH_FILTERS_SUCCESS: {
      console.log("Fetch FILTERS: ", action.payload);
      return {
        ...state,
        filters: action.payload.data,
        filtersLoading: false,
        filtersSuccess: true,
      };
    }

    case FETCH_FILTERS_FAIL: {
      return { ...state, filters: undefined, filtersLoading: false, filtersError: action.payload };
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
        deals: undefined,
        createLoading: false,
        createSuccess: true,
      };
    }

    case CREATE_FAIL: {
      return { ...state, createLoading: false, createError: action.payload };
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
        deals: undefined,
        loading: true,
        editLoading: false,
        editSuccess: true,
      };
    }

    case EDIT_FAIL: {
      return { ...state, editLoading: false, editError: action.payload };
    }

    case CLEAR_DEL: {
      return { ...state, delLoading: false, delSuccess: false, delError: null };
    }

    case DEL_REQUEST: {
      return { ...state, delLoading: true, delSuccess: false, delError: null };
    }

    case DEL_SUCCESS: {
      return { ...state, deals: undefined, delLoading: false, delSuccess: true };
    }

    case DEL_FAIL: {
      return { ...state, delLoading: false, delError: action.payload };
    }

    default:
      return state;
  }
};

export const actions = {
  fetchRequest: (payload: { page: number; perPage: number }) =>
    createAction(FETCH_REQUEST, payload),
  fetchSuccess: (payload: IServerResponse<IDeal[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  setDeal: (deal: IDeal | undefined) => createAction(SET_DEAL, { deal }),

  clearFetchById: () => createAction(CLEAR_FETCH_BY_ID),
  fetchByIdRequest: (payload: { id: number }) => createAction(FETCH_BY_ID_REQUEST, payload),
  fetchByIdSuccess: (payload: IServerResponse<IDeal>) => createAction(FETCH_BY_ID_SUCCESS, payload),
  fetchByIdFail: (payload: string) => createAction(FETCH_BY_ID_FAIL, payload),

  clearFetchFilters: () => createAction(CLEAR_FETCH_FILTERS),
  fetchFiltersRequest: () => createAction(FETCH_FILTERS_REQUEST),
  fetchFiltersSuccess: (payload: IServerResponse<IDealsFilter[]>) =>
    createAction(FETCH_FILTERS_SUCCESS, payload),
  fetchFiltersFail: (payload: string) => createAction(FETCH_FILTERS_FAIL, payload),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (payload: IUserForCreate) => createAction(CREATE_REQUEST, payload),
  createSuccess: (payload: IServerResponse<IUser>) => createAction(CREATE_SUCCESS, payload),
  createFail: (payload: string) => createAction(CREATE_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (payload: { id: number; data: IUserForEdit }) => createAction(EDIT_REQUEST, payload),
  editSuccess: () => createAction(EDIT_SUCCESS),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (payload: { id: number }) => createAction(DEL_REQUEST, payload),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({ payload }: { payload: { page: number; perPage: number } }) {
  try {
    const { data }: { data: IServerResponse<IDeal[]> } = yield call(() =>
      getDeals(payload.page, payload.perPage)
    );
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e.response.data.message));
  }
}

function* fetchFiltersSaga() {
  try {
    const { data }: { data: IServerResponse<IDealsFilter[]> } = yield call(() => getDealsFilters());
    yield put(actions.fetchFiltersSuccess(data));
  } catch (e) {
    yield put(actions.fetchFiltersFail(e.response.data.message));
  }
}

function* fetchByIdSaga({ payload }: { payload: { id: number } }) {
  try {
    const { data }: { data: IServerResponse<IDeal> } = yield call(() => getUserById(payload.id));
    yield put(actions.fetchByIdSuccess(data));
  } catch (e) {
    yield put(actions.fetchByIdFail(e.response.data.message));
  }
}

function* createSaga({ payload }: { payload: IUserForCreate }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => createUser(payload));
    yield put(actions.createSuccess(data));
  } catch (e) {
    yield put(actions.createFail(e.response.data.message));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: IUserForEdit } }) {
  try {
    yield call(() => editUser(payload.id, payload.data));
    yield put(actions.editSuccess());
  } catch (e) {
    yield put(actions.editFail(e.response.data.message));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => deleteUser(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e.response.data.message));
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchFiltersRequest>>(
    FETCH_FILTERS_REQUEST,
    fetchFiltersSaga
  );
  yield takeLatest<ReturnType<typeof actions.fetchByIdRequest>>(FETCH_BY_ID_REQUEST, fetchByIdSaga);
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
}
