import { persistReducer } from "redux-persist";
import { put, takeLatest, call } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import {
  getCompanyById,
  createCompany,
  editCompany,
  getCompanies,
  sentConfirmCode,
  confrimByEmail,
} from "../../crud/companies.crud";
import { getResponseMessage } from "../../utils";
import * as authDuck from "./auth.duck";

export const actionTypes = {
  GetCompanyById: "[GetCompanyById] Action",
  CompanyByIdSuccess: "[GetCompanyById] Success",
  CompanyByIdFail: "[GetCompanyById] Fail",

  CreateCompany: "[CreateCompany] Action",
  EditCompany: "[EditCompany] Action",

  GetCompanies: "[GetCompanies] Action",
  CompaniesSuccess: "[GetCompanies] Success",
  CompaniesFail: "[GetCompanies] Fail",

  SentConfirmCode: "[SentConfirmCode] Action",
  ConfirmByEmail: "[ConfirmByEmail] Action",

  ClearCompanyErrors: "[ClearCompanyErrors] Action",
};

const initialState = {
  currentCompany: {},
  companies: {},
  errors: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-companies" },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GetCompanyById: {
        return { ...state, currentCompany: { ...state.currentCompany, loading: true }, errors: {} };
      }
      case actionTypes.CompanyByIdSuccess: {
        const { data } = action.payload;
        return { ...state, currentCompany: data };
      }
      case actionTypes.CompanyByIdFail: {
        return { ...state, currentCompany: { loading: false }, errors: { get: true } };
      }
      case actionTypes.ClearCompanyErrors: {
        return { ...state, errors: {} };
      }

      case actionTypes.GetCompanies: {
        return { ...state, errors: {}, companies: { ...state.companies, loading: true } };
      }
      case actionTypes.CompaniesSuccess: {
        const { data } = action.payload;
        console.log(data);
        return { ...state, companies: data };
      }
      case actionTypes.CompaniesFail: {
        return {
          ...state,
          companies: { ...state.companies, loading: false },
          errors: { all: true },
        };
      }
      default:
        return state;
    }
  }
);

export const actions = {
  createCompany: (params, successCallback, failCallback) => ({
    type: actionTypes.CreateCompany,
    payload: { params, successCallback, failCallback },
  }),

  editCompany: (id, params, successCallback, failCallback) => ({
    type: actionTypes.EditCompany,
    payload: { id, params, successCallback, failCallback },
  }),

  getCompanyById: id => ({ type: actionTypes.GetCompanyById, payload: { id } }),
  companyByIdSuccess: data => ({ type: actionTypes.CompanyByIdSuccess, payload: { data } }),
  companyByIdFail: () => ({ type: actionTypes.CompanyByIdFail }),

  getCompanies: page => ({ type: actionTypes.GetCompanies, payload: { page } }),
  companiesSuccess: data => ({ type: actionTypes.CompaniesSuccess, payload: { data } }),
  companiesFail: () => ({ type: actionTypes.CompaniesFail }),

  sentConfirmCode: (params, successCallback, failCallback) => ({
    type: actionTypes.SentConfirmCode,
    payload: { params, successCallback, failCallback },
  }),
  confirmByEmail: (code, successCallback, failCallback) => ({
    type: actionTypes.ConfirmByEmail,
    payload: { code, successCallback, failCallback },
  }),

  clearErrors: () => ({ type: actionTypes.ClearCompanyErrors }),
};

function* companyByIdSaga({ payload: { id } }) {
  if (id) {
    try {
      const { data } = yield call(getCompanyById, id);
      if (data && data.data) {
        yield put(actions.companyByIdSuccess(data.data));
      } else {
        yield put(actions.companyByIdFail());
      }
    } catch (e) {
      yield put(actions.companyByIdFail());
    }
  } else {
    yield put(actions.companyByIdSuccess({}));
  }
}

function* createCompanySaga({ payload: { params, successCallback, failCallback } }) {
  try {
    const { data } = yield createCompany(params);
    if (data) {
      yield call(successCallback);
    } else {
      yield call(failCallback);
    }
  } catch (e) {
    const error = getResponseMessage(e);
    yield call(failCallback, error);
  }
}

function* editCompanySaga({ payload: { id, params, successCallback, failCallback } }) {
  try {
    const { data } = yield editCompany(id, params);
    if (data) {
      yield call(successCallback);
    } else {
      yield call(failCallback);
    }
  } catch (e) {
    const error = getResponseMessage(e);
    yield call(failCallback, error);
  }
}

function* companiesSaga({ payload: { page } }) {
  try {
    const { data } = yield call(getCompanies, page);
    if (data) {
      yield put(actions.companiesSuccess(data));
    } else {
      yield put(actions.companiesFail());
    }
  } catch {
    yield put(actions.companiesFail());
  }
}

function* sentConfirmCodeSaga({ payload: { params = {}, successCallback, failCallback } }) {
  try {
    const { data } = yield call(sentConfirmCode, params.companyId, params.userId);
    if (data) {
      yield call(successCallback);
    } else {
      yield call(failCallback);
    }
  } catch (e) {
    const error = getResponseMessage(e);
    yield call(failCallback, error);
  }
}

function* confrimByEmailSaga({ payload: { code, successCallback, failCallback } }) {
  try {
    const { data } = yield call(confrimByEmail, code);
    if (data) {
      yield put(authDuck.actions.mergeUser({ company_confirmed_by_email: true }));
      yield call(successCallback);
    } else {
      yield call(failCallback);
    }
  } catch (e) {
    const error = getResponseMessage(e);
    yield call(failCallback, error);
  }
}

export function* saga() {
  yield takeLatest(actionTypes.GetCompanyById, companyByIdSaga);
  yield takeLatest(actionTypes.CreateCompany, createCompanySaga);
  yield takeLatest(actionTypes.EditCompany, editCompanySaga);
  yield takeLatest(actionTypes.GetCompanies, companiesSaga);
  yield takeLatest(actionTypes.SentConfirmCode, sentConfirmCodeSaga);
  yield takeLatest(actionTypes.ConfirmByEmail, confrimByEmailSaga);
}
