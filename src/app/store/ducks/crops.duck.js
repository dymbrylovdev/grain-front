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
  CreateCropSucces: "[CreateCrop] Action",
  EditCropSuccess: "[EditCrop] Action",

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
  editCropSuccess: user => ({ type: actionTypes.EditCropSuccess, payload: { user } }),

  createCropSuccess: user => ({ type: actionTypes.CreateCropSucces, payload: { user } }),

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
    console.log("---cropsData", data);
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

export function* saga() {
  yield takeLatest(actionTypes.GetCrops, getCropsSaga);
  yield takeLatest(actionTypes.EditCropSuccess, getCropsSaga);
  yield takeLatest(actionTypes.CreateCropSucces, getCropsSaga);
  yield takeLatest(actionTypes.GetCropParams, getCropParamsSaga);
}
