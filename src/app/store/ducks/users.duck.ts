import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import { IServerResponse } from "../../interfaces/server";
import {
  getUsers,
  getUserById,
  getUserBids,
  deleteUser,
  createUser,
  editUser,
  editContactViewContact,
  getUserActivate,
  getUserRoles,
  getUserBidFilters,
  createUserBidFilter,
  getUserFilters,
} from "../../crud/users.crud";
import { actions as authActions } from "../../store/ducks/auth.duck";
import { IUser, IUserForCreate, IUserForEdit, IUserBidFilters } from "../../interfaces/users";
import { IBid } from "../../interfaces/bids";
import { IFilterForCreate, IMyFilters } from "../../interfaces/filters";
import { PersistPartial } from "redux-persist/es/persistReducer";

const CLEAR_FETCH = "users/CLEAR_FETCH";
const FETCH_REQUEST = "users/FETCH_REQUEST";
const FETCH_SUCCESS = "users/FETCH_SUCCESS";
const FETCH_FAIL = "users/FETCH_FAIL";

const CLEAR_FETCH_BY_ID = "users/CLEAR_FETCH_BY_ID";
const FETCH_BY_ID_REQUEST = "users/FETCH_BY_ID_REQUEST";
const FETCH_BY_ID_SUCCESS = "users/FETCH_BY_ID_SUCCESS";
const FETCH_BY_ID_FAIL = "users/FETCH_BY_ID_FAIL";

const CLEAR_CREATE = "users/CLEAR_CREATE";
const CREATE_REQUEST = "users/CREATE_REQUEST";
const CREATE_SUCCESS = "users/CREATE_SUCCESS";
const CREATE_FAIL = "users/CREATE_FAIL";

const CLEAR_EDIT = "users/CLEAR_EDIT";
const EDIT_REQUEST = "users/EDIT_REQUEST";
const EDIT_SUCCESS = "users/EDIT_SUCCESS";
const EDIT_FAIL = "users/EDIT_FAIL";

const CLEAR_DEL = "users/CLEAR_DEL";
const DEL_REQUEST = "users/DEL_REQUEST";
const DEL_SUCCESS = "users/DEL_SUCCESS";
const DEL_FAIL = "users/DEL_FAIL";

const CLEAR_CONTACT_VIEW_COUNT = "users/CLEAR_CONTACT_VIEW_COUNT";
const CONTACT_VIEW_COUNT_REQUEST = "users/CONTACT_VIEW_COUNT_REQUEST";
const CONTACT_VIEW_COUNT_SUCCESS = "users/CONTACT_VIEW_COUNT_SUCCESS";
const CONTACT_VIEW_COUNT_FAIL = "users/CONTACT_VIEW_COUNT_FAIL";

const SET_OPEN_INFO_ALERT = "users/SET_OPEN_INFO_ALERT";

const CLEAR_USER_ACTIVATE = "users/CLEAR_USER_ACTIVATE";
const USER_ACTIVATE_REQUEST = "users/USER_ACTIVATE_REQUEST";
const USER_ACTIVATE_SUCCESS = "users/USER_ACTIVATE_SUCCESS";
const USER_ACTIVATE_FAIL = "users/USER_ACTIVATE_FAIL";

const CLEAR_USER_BIDS = "users/CLEAR_USER_BIDS";
const USER_BIDS_REQUEST = "users/USER_BIDS_REQUEST";
const USER_BIDS_SUCCESS = "users/USER_BIDS_SUCCESS";
const USER_BIDS_FAIL = "users/USER_BIDS_FAIL";

const CLEAR_USER_ROLES = "users/CLEAR_USER_ROLES";
const USER_ROLES_REQUEST = "users/USER_ROLES_REQUEST";
const USER_ROLES_SUCCESS = "users/USER_ROLES_SUCCESS";
const USER_ROLES_FAIL = "users/USER_ROLES_FAIL";

const SET_CURRENT_ROLES = "users/SET_CURRENT_ROLES";

const CLEAR_USER_BID_FILTERS = "users/CLEAR_USER_BID_FILTERS";
const USER_BID_FILTERS_REQUEST = "users/USER_BID_FILTERS_REQUEST";
const USER_BID_FILTERS_SUCCESS = "users/USER_BID_FILTERS_SUCCESS";
const USER_BID_FILTERS_FAIL = "users/USER_BID_FILTERS_FAIL";

const CLEAR_CREATE_USER_FILTER = "users/CLEAR_CREATE_USER_FILTER";
const CREATE_USER_FILTER_REQUEST = "users/CREATE_USER_FILTER_REQUEST";
const CREATE_USER_FILTER_SUCCESS = "users/CREATE_USER_FILTER_SUCCESS";
const CREATE_USER_FILTER_FAIL = "users/CREATE_USER_FILTER_FAIL";

const CLEAR_USER_FILTERS = "users/CLEAR_USER_FILTERS";
const USER_FILTERS_REQUEST = "users/USER_FILTERS_REQUEST";
const USER_FILTERS_SUCCESS = "users/USER_FILTERS_SUCCESS";
const USER_FILTERS_FAIL = "users/USER_FILTERS_FAIL";

const SET_USER_FILTERS_EMAIL = "users/SET_USER_FILTERS_EMAIL";
const SET_USER_FILTERS_PHONE = "users/SET_USER_FILTERS_PHONE";

const SET_USER_BOUGHT_TARIFF = "users/SET_USER_BOUGHT_TARIFF";

export interface IInitialState {
  page: number;
  per_page: number;
  total: number;
  prevUsersCount: number;
  users: IUser[] | undefined;
  loading: boolean;
  success: boolean;
  error: string | null;

  user: IUser | undefined;
  byIdLoading: boolean;
  byIdSuccess: boolean;
  byIdError: string | null;

  createdUserId: number;
  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;

  editLoading: boolean;
  editSuccess: boolean;
  editError: string | null;

  delLoading: boolean;
  delSuccess: boolean;
  delError: string | null;

  contactViewCountLoading: boolean;
  contactViewCountSuccess: boolean;
  contactViewCountError: string | null;

  userActivateLoading: boolean;
  userActivateSuccess: boolean;
  userActivateError: string | null;

  bids_page: number;
  bids_per_page: number;
  bids_total: number;
  userBids: IBid[] | undefined;
  userBidsLoading: boolean;
  userBidsSuccess: boolean;
  userBidsError: string | null;

  openInfoAlert: boolean;

  roles: any[] | undefined;
  userRolesLoading: boolean;
  userRolesSuccess: boolean;
  userRolesError: string | null;

  currentRoles: string | undefined;

  userBidFilters: IUserBidFilters | undefined;
  userBidFiltersLoading: boolean;
  userBidFiltersSuccess: boolean;
  userBidFiltersError: string | null;

  createUserFilterLoading: boolean;
  createUserFilterSuccess: boolean;
  createUserFilterError: string | null;

  userFiltersLoading: boolean;
  userFiltersSuccess: boolean;
  userFiltersError: string | null;

  userFiltersEmail: string | undefined;
  userFiltersPhone: string | undefined;

  boughtTariff: boolean;
}

const initialState: IInitialState = {
  page: 1,
  per_page: 20,
  total: 0,
  prevUsersCount: 5,
  users: undefined,
  loading: false,
  success: false,
  error: null,

  user: undefined,
  byIdLoading: false,
  byIdSuccess: false,
  byIdError: null,

  createdUserId: 0,
  createLoading: false,
  createSuccess: false,
  createError: null,

  editLoading: false,
  editSuccess: false,
  editError: null,

  delLoading: false,
  delSuccess: false,
  delError: null,

  contactViewCountLoading: false,
  contactViewCountSuccess: false,
  contactViewCountError: null,

  userActivateLoading: false,
  userActivateSuccess: false,
  userActivateError: null,

  userBids: undefined,
  bids_page: 1,
  bids_per_page: 20,
  bids_total: 0,
  userBidsLoading: false,
  userBidsSuccess: false,
  userBidsError: null,

  openInfoAlert: true,

  roles: undefined,
  userRolesLoading: false,
  userRolesSuccess: false,
  userRolesError: null,

  currentRoles: undefined,

  userBidFilters: undefined,
  userBidFiltersLoading: false,
  userBidFiltersSuccess: false,
  userBidFiltersError: null,

  createUserFilterLoading: false,
  createUserFilterSuccess: false,
  createUserFilterError: null,

  userFiltersLoading: false,
  userFiltersSuccess: false,
  userFiltersError: null,

  userFiltersEmail: undefined,
  userFiltersPhone: undefined,

  boughtTariff: false,
};

export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  {
    storage,
    key: "userFilters",
    whitelist: ["currentRoles", "userFiltersEmail", "userFiltersPhone", "boughtTariff"],
  },
  (state = initialState, action) => {
    switch (action.type) {
      case CLEAR_FETCH: {
        //console.log("CLEAR_FETCH");
        return {
          ...state,
          page: 1,
          per_page: 20,
          total: 0,
          prevUsersCount: 5,
          users: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_REQUEST: {
        return {
          ...state,
          users: undefined,
          loading: true,
          success: false,
          error: null,
        };
      }

      case FETCH_SUCCESS: {
        // console.log("Fetch users: ", action.payload);
        return {
          ...state,
          page: action.payload.page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          prevUsersCount: action.payload.data.length,
          users: action.payload.data,
          loading: false,
          success: true,
        };
      }

      case FETCH_FAIL: {
        return { ...state, loading: false, error: action.payload };
      }

      case CLEAR_FETCH_BY_ID: {
        //console.log("CLEAR_FETCH_BY_ID");
        return {
          ...state,
          user: undefined,
          byIdLoading: false,
          byIdSuccess: false,
          byIdError: null,
        };
      }

      case FETCH_BY_ID_REQUEST: {
        //console.log("FETCH_BY_ID_REQUEST");
        return {
          ...state,
          user: undefined,
          byIdLoading: true,
          byIdSuccess: false,
          byIdError: null,
        };
      }

      case FETCH_BY_ID_SUCCESS: {
        // console.log("Fetch User: ", action.payload);
        return {
          ...state,
          user: action.payload.data,
          byIdLoading: false,
          byIdSuccess: true,
        };
      }

      case FETCH_BY_ID_FAIL: {
        return { ...state, user: undefined, byIdLoading: false, byIdError: action.payload };
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
          users: undefined,
          createdUserId: action.payload.data.id,
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
          user: action.payload.data,
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
        return { ...state, users: undefined, delLoading: false, delSuccess: true };
      }

      case DEL_FAIL: {
        return { ...state, delLoading: false, delError: action.payload };
      }

      case CLEAR_CONTACT_VIEW_COUNT: {
        return {
          ...state,
          contactViewCountLoading: false,
          contactViewCountSuccess: false,
          contactViewCountError: null,
        };
      }

      case CONTACT_VIEW_COUNT_REQUEST: {
        return {
          ...state,
          contactViewCountLoading: true,
          contactViewCountSuccess: false,
          contactViewCountError: null,
        };
      }

      case CONTACT_VIEW_COUNT_SUCCESS: {
        return { ...state, contactViewCountLoading: false, contactViewCountSuccess: true };
      }

      case CONTACT_VIEW_COUNT_FAIL: {
        return {
          ...state,
          contactViewCountLoading: false,
          contactViewCountError: action.payload,
        };
      }

      case SET_OPEN_INFO_ALERT: {
        return {
          ...state,
          openInfoAlert: action.payload.openInfoAlert,
        };
      }

      case CLEAR_USER_ACTIVATE: {
        return {
          ...state,
          userActivateLoading: false,
          userActivateSuccess: false,
          userActivateError: null,
        };
      }

      case USER_ACTIVATE_REQUEST: {
        return {
          ...state,
          userActivateLoading: true,
          userActivateSuccess: false,
          userActivateError: null,
        };
      }

      case USER_ACTIVATE_SUCCESS: {
        return { ...state, userActivateLoading: false, userActivateSuccess: true };
      }

      case USER_ACTIVATE_FAIL: {
        return { ...state, userActivateLoading: false, userActivateError: action.payload };
      }

      case CLEAR_USER_BIDS: {
        return {
          ...state,
          userBidsLoading: false,
          userBidsSuccess: false,
          userBidsError: null,
          bids_page: 1,
          bids_per_page: 20,
          bids_total: 0,
        };
      }

      case USER_BIDS_REQUEST: {
        return { ...state, userBidsLoading: true, userBidsSuccess: false, userBidsError: null };
      }

      case USER_BIDS_SUCCESS: {
        return {
          ...state,
          userBids: action.payload.data,
          bids_page: action.payload.page,
          bids_per_page: action.payload.per_page,
          bids_total: action.payload.total,
          userBidsLoading: false,
          userBidsSuccess: true,
        };
      }

      case USER_BIDS_FAIL: {
        return { ...state, userBidsLoading: false, userBidsError: action.payload };
      }

      case CLEAR_USER_ROLES: {
        return {
          ...state,
          roles: undefined,
          userRolesLoading: false,
          userRolesSuccess: false,
          userRolesError: null,
        };
      }

      case USER_ROLES_REQUEST: {
        return {
          ...state,
          userRolesLoading: true,
          userRolesSuccess: false,
          userRolesError: null,
        };
      }

      case USER_ROLES_SUCCESS: {
        return {
          ...state,
          roles: action.payload.data,
          userRolesLoading: false,
          userRolesSuccess: true,
        };
      }

      case USER_ROLES_FAIL: {
        return {
          ...state,
          userRolesLoading: false,
          userRolesError: action.payload,
        };
      }

      case SET_CURRENT_ROLES: {
        return {
          ...state,
          currentRoles: action.payload,
        };
      }

      case CLEAR_USER_BID_FILTERS: {
        return {
          ...state,
          userBidFilters: undefined,
          userBidFiltersLoading: false,
          userBidFiltersSuccess: false,
          userBidFiltersError: null,
        };
      }

      case USER_BID_FILTERS_REQUEST: {
        return {
          ...state,
          userBidFiltersLoading: true,
          userBidFiltersSuccess: false,
          userBidFiltersError: null,
        };
      }

      case USER_BID_FILTERS_SUCCESS: {
        return {
          ...state,
          userBidFilters: action.payload.data,
          userBidFiltersLoading: false,
          userBidFiltersSuccess: true,
        };
      }

      case USER_BID_FILTERS_FAIL: {
        return {
          ...state,
          userBidFiltersLoading: false,
          userBidFiltersError: action.payload,
        };
      }

      case CLEAR_CREATE_USER_FILTER: {
        return {
          ...state,
          createUserFilterLoading: false,
          createUserFilterSuccess: false,
          createUserFilterError: null,
        };
      }

      case CREATE_USER_FILTER_REQUEST: {
        return {
          ...state,
          createUserFilterLoading: true,
          createUserFilterSuccess: false,
          createUserFilterError: null,
        };
      }

      case CREATE_USER_FILTER_SUCCESS: {
        return {
          ...state,
          createUserFilterLoading: false,
          createUserFilterSuccess: true,
        };
      }

      case CREATE_USER_FILTER_FAIL: {
        return {
          ...state,
          createUserFilterLoading: false,
          createUserFilterError: action.payload,
        };
      }

      case CLEAR_USER_FILTERS: {
        return {
          ...state,
          userFiltersLoading: false,
          userFiltersSuccess: false,
          userFitlersError: null,
        };
      }

      case USER_FILTERS_REQUEST: {
        return {
          ...state,
          users: undefined,
          userFiltersLoading: true,
          userFiltersSuccess: false,
          userFitlersError: null,
        };
      }

      case USER_FILTERS_SUCCESS: {
        return {
          ...state,
          users: action.payload.data,
          userFiltersLoading: false,
          userFiltersSuccess: true,
        };
      }

      case USER_FILTERS_FAIL: {
        return {
          ...state,
          userFiltersLoading: false,
          userFiltersError: action.payload,
        };
      }

      case SET_USER_FILTERS_EMAIL: {
        return {
          ...state,
          userFiltersEmail: action.payload,
        };
      }

      case SET_USER_FILTERS_PHONE: {
        return {
          ...state,
          userFiltersPhone: action.payload,
        };
      }

      case SET_USER_BOUGHT_TARIFF: {
        return {
          ...state,
          boughtTariff: action.payload,
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  clearFetch: () => createAction(CLEAR_FETCH),
  fetchRequest: (payload: {
    page: number;
    perPage: number;
    tariffId?: number;
    funnelStateId?: number;
    userRolesId?: string;
    boughtTariff?: boolean;
  }) => createAction(FETCH_REQUEST, payload),
  fetchSuccess: (payload: IServerResponse<IUser[]>) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload: string) => createAction(FETCH_FAIL, payload),

  clearFetchById: () => createAction(CLEAR_FETCH_BY_ID),
  fetchByIdRequest: (payload: { id: number }) => createAction(FETCH_BY_ID_REQUEST, payload),
  fetchByIdSuccess: (payload: IServerResponse<IUser>) => createAction(FETCH_BY_ID_SUCCESS, payload),
  fetchByIdFail: (payload: string) => createAction(FETCH_BY_ID_FAIL, payload),

  clearCreate: () => createAction(CLEAR_CREATE),
  createRequest: (payload: IUserForCreate) => createAction(CREATE_REQUEST, payload),
  createSuccess: (payload: IServerResponse<IUser>) => createAction(CREATE_SUCCESS, payload),
  createFail: (payload: string) => createAction(CREATE_FAIL, payload),

  clearEdit: () => createAction(CLEAR_EDIT),
  editRequest: (payload: { id: number; data: IUserForEdit }) => createAction(EDIT_REQUEST, payload),
  editSuccess: (payload: IServerResponse<IUser>) => createAction(EDIT_SUCCESS, payload),
  editFail: (payload: string) => createAction(EDIT_FAIL, payload),

  clearDel: () => createAction(CLEAR_DEL),
  delRequest: (payload: { id: number }) => createAction(DEL_REQUEST, payload),
  delSuccess: () => createAction(DEL_SUCCESS),
  delFail: (payload: string) => createAction(DEL_FAIL, payload),

  clearContactViewCount: () => createAction(CLEAR_CONTACT_VIEW_COUNT),
  contactViewCountRequest: (payload: { data: any }) => createAction(CONTACT_VIEW_COUNT_REQUEST, payload),
  contactViewCountSuccess: () => createAction(CONTACT_VIEW_COUNT_SUCCESS),
  contactViewCountError: (payload: string) => createAction(CONTACT_VIEW_COUNT_FAIL, payload),

  clearUserActive: () => createAction(CLEAR_USER_ACTIVATE),
  userActiveRequest: (payload: { email: string }) => createAction(USER_ACTIVATE_REQUEST, payload),
  userActivateSuccess: () => createAction(USER_ACTIVATE_SUCCESS),
  useractivateError: (payload: string) => createAction(USER_ACTIVATE_FAIL, payload),

  clearUserBids: () => createAction(CLEAR_USER_BIDS),
  userBidsRequest: (payload: { userId: number; page: number; perPage: number }) => createAction(USER_BIDS_REQUEST, payload),
  userBidsSuccess: (payload: IServerResponse<IBid[]>) => createAction(USER_BIDS_SUCCESS, payload),
  userBidsFail: (payload: string) => createAction(USER_BIDS_FAIL, payload),

  setOpenInfoAlert: (openInfoAlert: boolean) => createAction(SET_OPEN_INFO_ALERT, { openInfoAlert }),

  clearUserRoles: () => createAction(CLEAR_USER_ROLES),
  userRolesRequest: () => createAction(USER_ROLES_REQUEST),
  userRolesSuccess: (payload: any) => createAction(USER_ROLES_SUCCESS, payload),
  userRolesFail: (payload: string) => createAction(USER_ROLES_FAIL, payload),

  setCurrentRoles: (payload: any) => createAction(SET_CURRENT_ROLES, payload),

  clearUserBidFilters: () => createAction(CLEAR_USER_BID_FILTERS),
  userBidFiltersRequest: (payload: { id: number; type?: string }) => createAction(USER_BID_FILTERS_REQUEST, payload),
  userBidFiltersSuccess: (payload: IServerResponse<IUserBidFilters>) => createAction(USER_BID_FILTERS_SUCCESS, payload),
  userBidFiltersFail: (payload: string) => createAction(USER_BID_FILTERS_FAIL, payload),

  clearCreateUserFilter: () => createAction(CLEAR_CREATE_USER_FILTER),
  createUserFilterRequest: (payload: any) => createAction(CREATE_USER_FILTER_REQUEST, payload),
  createUserFilterSuccess: (payload: any) => createAction(CREATE_USER_FILTER_SUCCESS),
  createUserFilterFail: (payload: string) => createAction(CREATE_USER_FILTER_FAIL, payload),

  clearUserFilters: () => createAction(CLEAR_USER_FILTERS),
  userFiltersRequest: (payload: { email?: string; phone?: string }) => createAction(USER_FILTERS_REQUEST, payload),
  userFiltersSuccess: (payload: any) => createAction(USER_FILTERS_SUCCESS, payload),
  userFiltersFail: (payload: string) => createAction(USER_FILTERS_FAIL, payload),

  setUserFiltersEmail: (payload: string) => createAction(SET_USER_FILTERS_EMAIL, payload),
  setUserFiltersPhone: (payload: string) => createAction(SET_USER_FILTERS_PHONE, payload),

  setUserBoughtTariff: (payload: boolean) => createAction(SET_USER_BOUGHT_TARIFF, payload),
};

export type TActions = ActionsUnion<typeof actions>;

function* fetchSaga({
  payload,
}: {
  payload: {
    page: number;
    perPage: number;
    tariffId?: number;
    funnelStateId?: number;
    userRolesId?: string;
    boughtTariff?: boolean;
  };
}) {
  try {
    const { data }: { data: IServerResponse<IUser[]> } = yield call(() =>
      getUsers(payload.page, payload.perPage, payload.tariffId, payload.funnelStateId, payload.userRolesId, payload.boughtTariff)
    );
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* fetchByIdSaga({ payload }: { payload: { id: number } }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => getUserById(payload.id));
    yield put(actions.fetchByIdSuccess(data));
  } catch (e) {
    yield put(actions.fetchByIdFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* createSaga({ payload }: { payload: IUserForCreate }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => createUser(payload));
    yield put(actions.createSuccess(data));
  } catch (e) {
    yield put(actions.createFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* editSaga({ payload }: { payload: { id: number; data: IUserForEdit } }) {
  try {
    const { data }: { data: IServerResponse<IUser> } = yield call(() => editUser(payload.id, payload.data));
    yield put(actions.editSuccess(data));
  } catch (e) {
    yield put(actions.editFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* delSaga({ payload }: { payload: { id: number } }) {
  try {
    yield call(() => deleteUser(payload.id));
    yield put(actions.delSuccess());
  } catch (e) {
    yield put(actions.delFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* contactViewCountSaga({ payload }: { payload: { data: any } }) {
  try {
    const { data }: { data: any } = yield call(() => editContactViewContact(payload.data));
    // yield put(authActions.fetchSuccess(data));
    yield put(authActions.newUserData(data));
    yield put(actions.contactViewCountSuccess());
  } catch (e) {
    yield put(actions.contactViewCountError(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* userActivateSaga({ payload }: { payload: { email: String } }) {
  try {
    yield call(() => getUserActivate(payload.email));
    yield put(actions.userActivateSuccess());
  } catch (e) {
    yield put(actions.useractivateError(e?.response?.data?.message) || "Ошибка соединения.");
  }
}

function* userBidsSaga({ payload }: { payload: { userId: number; page: number; perPage: number } }) {
  try {
    const { data }: { data: IServerResponse<IBid[]> } = yield call(() => getUserBids(payload));
    yield put(actions.userBidsSuccess(data));
  } catch (e) {
    yield put(actions.userBidsFail(e?.response?.data?.message) || "Ошибка соединения.");
  }
}

function* userRolesSaga() {
  try {
    const { data }: { data: any } = yield call(() => getUserRoles());
    yield put(actions.userRolesSuccess(data));
  } catch (e) {
    yield put(actions.userRolesFail(e?.response?.data?.message) || "Ошибка соединения.");
  }
}

function* userBidFiltersSaga({ payload }: { payload: { id: number; type?: string } }) {
  try {
    const { data }: { data: IServerResponse<IUserBidFilters> } = yield call(() => getUserBidFilters(payload));
    yield put(actions.userBidFiltersSuccess(data));
  } catch (e) {
    yield put(actions.userBidFiltersFail(e?.response?.data?.message) || "Ошибка соединения.");
  }
}

function* createUserFilterSaga({ payload }: { payload: { id: number; data: IFilterForCreate } }) {
  try {
    const { data }: { data: IServerResponse<IMyFilters> } = yield call(() => createUserBidFilter(payload.id, payload.data));
    yield put(actions.createUserFilterSuccess(data));
  } catch (e) {
    yield put(actions.createUserFilterFail(e?.response?.data?.message || "Ошибка соединения."));
  }
}

function* userFiltersSaga({ payload }: { payload: { email?: string; phone?: string } }) {
  try {
    const { data }: { data: any } = yield call(() => getUserFilters(payload.email, payload.phone));
    yield put(actions.userFiltersSuccess(data));
  } catch (e) {
    yield put(actions.userFiltersFail(e?.response?.data?.message) || "Ошибка соединения.");
  }
}

export function* saga() {
  yield takeLatest<ReturnType<typeof actions.fetchRequest>>(FETCH_REQUEST, fetchSaga);
  yield takeLatest<ReturnType<typeof actions.fetchByIdRequest>>(FETCH_BY_ID_REQUEST, fetchByIdSaga);
  yield takeLatest<ReturnType<typeof actions.createRequest>>(CREATE_REQUEST, createSaga);
  yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_REQUEST, editSaga);
  yield takeLatest<ReturnType<typeof actions.delRequest>>(DEL_REQUEST, delSaga);
  yield takeLatest<ReturnType<typeof actions.contactViewCountRequest>>(CONTACT_VIEW_COUNT_REQUEST, contactViewCountSaga);
  yield takeLatest<ReturnType<typeof actions.userActiveRequest>>(USER_ACTIVATE_REQUEST, userActivateSaga);
  yield takeLatest<ReturnType<typeof actions.userBidsRequest>>(USER_BIDS_REQUEST, userBidsSaga);
  yield takeLatest<ReturnType<typeof actions.userRolesRequest>>(USER_ROLES_REQUEST, userRolesSaga);
  yield takeLatest<ReturnType<typeof actions.userBidFiltersRequest>>(USER_BID_FILTERS_REQUEST, userBidFiltersSaga);
  yield takeLatest<ReturnType<typeof actions.createUserFilterRequest>>(CREATE_USER_FILTER_REQUEST, createUserFilterSaga);
  yield takeLatest<ReturnType<typeof actions.userFiltersRequest>>(USER_FILTERS_REQUEST, userFiltersSaga);
}
