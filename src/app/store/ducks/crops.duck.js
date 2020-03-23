import { takeLatest, put, call } from "redux-saga/effects";
import { actions as builderActions } from "../../../_metronic/ducks/builder";
import { persistReducer } from "redux-persist";
import getMenuConfig from "../../router/MenuConfig";
import {
  getCrops,
  getCropParams,
  editCrop,
  createCrop,
  editCropParam,
  createCropParam,
} from "../../crud/crops.crud";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  CreateCrop: "[CreateCrop] Action",
  CreateCropSuccess: "[CreateCrop] Success",

  EditCrop: "[EditCrop] Action",
  EditCropSuccess: "[EditCrop] Success",

  EditCropParam : "[EditCropParam] Action",
  CreateCropParam : "[CreateCropParam] Action",

  GetCropParams: "[GetCropParams] Action",

  SetFilterForCrop: "[SetFilterForCrop] Action",
  Logout: "[CropLogout] Action",

  GetCrops: "[GetCrops] Action",
  CropsSuccess: "[GetCrops] Success",
  CropsFail: "[GetCrops] Fail",
};

const initialCropState = {
  crops: {},
  errors: {},
  filters: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-crops" },
  (state = initialCropState, action) => {
    switch (action.type) {
      case actionTypes.SetFilterForCrop: {
        const { filter, cropId } = action.payload;
        return { ...state, filters: { ...state.filters, [cropId]: filter } };
      }
      case actionTypes.GetCrops: {
        return { ...state, crops: { loading: true }, errors: {} };
      }
      case actionTypes.CropsSuccess: {
        const { data } = action.payload;
        return { ...state, crops: data };
      }
      case actionTypes.CropsFail: {
        return { ...state, crops: { ...state.crops, loading: false }, errors: { crops: true } };
      }
      case actionTypes.Logout: {
        return initialCropState;
      }
      default:
        return state;
    }
  }
);

export const actions = {
  editCrop: (id, params, user, successCallback, failCallback) => ({type: actionTypes.EditCrop, payload: {id, params, user, successCallback, failCallback}}),
  editCropSuccess: user => ({ type: actionTypes.EditCropSuccess, payload: { user } }),

  createCrop: (params, user, successCallback, failCallback) => ({type: actionTypes.CreateCrop, payload: { params, user, successCallback, failCallback}}),
  createCropSuccess: user => ({ type: actionTypes.CreateCropSuccess, payload: { user } }),

  editCropParam: (id, params, successCallback, failCallback) => ({type: actionTypes.EditCropParam, payload: {id, params, successCallback, failCallback}}),
  createCropParam: (id, params, successCallback, failCallback) => ({type: actionTypes.CreateCropParam, payload: {id, params, successCallback, failCallback}}),

  setFilterForCrop: (filter, cropId) => ({
    type: actionTypes.SetFilterForCrop,
    payload: { filter, cropId },
  }),

  getCropParams: (id, successCallback, failCallback) => ({
    type: actionTypes.GetCropParams,
    payload: { id, successCallback, failCallback },
  }),

  getCrops: user => ({ type: actionTypes.GetCrops, payload: { user } }),
  cropsSuccess: data => ({ type: actionTypes.CropsSuccess, payload: { data } }),
  cropsFail: () => ({ type: actionTypes.CropsFail }),

  logout: () => ({ type: actionTypes.Logout }),
};

function* getCropsSaga({ payload: { user } }) {
  try {
    const { data } = yield getCrops();
    if (data) {
      const menuWithCrops = getMenuConfig(data.data, user);
      yield put(builderActions.setMenuConfig(menuWithCrops));
      yield put(actions.cropsSuccess(data));
    }
  } catch {
    yield put(actions.cropsFail());
  }
}

function* getCropParamsSaga({ payload: { id, successCallback, failCallback } }) {
  try {
    const { data } = yield getCropParams(id);
    yield call(successCallback, (data && data.data)|| []);
  } catch {
    yield call(failCallback);
  }
}

function* editCropSaga ( {payload: {id, params, user, successCallback, failCallback}}){
  try {
    const { data } = yield editCrop(id, params);
    yield call(successCallback, (data && data.data) || []);
    yield put(actions.editCropSuccess(user));
  } catch {
    yield call(failCallback);
  }
}

function* createCropSaga ( {payload: {params, user, successCallback, failCallback}}){
  try {
    const { data } = yield createCrop(params);
    yield call(successCallback, (data && data.data) || []);
    yield put(actions.createCropSuccess(user));
  } catch {
    yield call(failCallback);
  }
}

function* editCropParamSaga ( {payload: {id, params, successCallback, failCallback}}){
  try {
    const { data } = yield editCropParam(params, id)
    yield call(successCallback, (data && data.data) || []);
  } catch(e) {
    yield call(failCallback);
  }
}

function* createCropParamSaga ( {payload: {id, params, successCallback, failCallback}}){
  try {
    const { data } = yield createCropParam(params, id);
    yield call(successCallback, (data && data.data) || []);
  } catch {
    yield call(failCallback);
  }
}


export function* saga() {
  yield takeLatest(actionTypes.GetCrops, getCropsSaga);
  yield takeLatest(actionTypes.EditCropSuccess, getCropsSaga);
  yield takeLatest(actionTypes.CreateCropSuccess, getCropsSaga);
  yield takeLatest(actionTypes.GetCropParams, getCropParamsSaga);
  yield takeLatest(actionTypes.EditCrop, editCropSaga);
  yield takeLatest(actionTypes.CreateCrop, createCropSaga);
  yield takeLatest(actionTypes.EditCropParam, editCropParamSaga);
  yield takeLatest(actionTypes.CreateCropParam, createCropParamSaga);
}
