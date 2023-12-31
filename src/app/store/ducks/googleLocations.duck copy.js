import { persistReducer } from "redux-persist";
import { put, takeLatest, delay, call } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { getLocation } from "../../crud/location.crud";
import { dataToEntities } from "../../utils";

export const actionTypes = {
  FetchLocаtionRequest: "[FetchLocаtionRequest] Action",
  FetchLocаtionSuccess: "[FetchLocаtionSuccess] Action",
  FetchLocаtionFail: "[FetchLocаtionFail] Action",
  ClearLocations: "[ClearLocations] Action",
};

const initialState = {
  locations: [],
  isLoadingLocations: false,
  error: false,
};

export const reducer = persistReducer(
  { storage, key: "locations" },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FetchLocаtionRequest: {
        return {
          ...state,
          isLoadingLocations: true,
          locations: [],
          error: false,
        };
      }
      case actionTypes.ClearLocations: {
        return {
          ...state,
          isLoadingLocations: false,
          error: false,
        };
      }
      case actionTypes.FetchLocаtionSuccess: {
        const locations = dataToEntities(action.payload.response);
        return {
          ...state,
          locations,
          isLoadingLocations: false,
        };
      }
      case actionTypes.FetchLocationFail: {
        return {
          ...state,
          isLoadingLocations: false,
          error: true,
        };
      }
      default:
        return state;
    }
  }
);

export const actions = {
  clearLocations: payload => ({ type: actionTypes.ClearLocations, payload }),
  fetchLocationsRequest: payload => ({ type: actionTypes.FetchLocаtionRequest, payload }),
  fetchLocationsSuccess: payload => ({ type: actionTypes.FetchLocаtionSuccess, payload }),
  fetchLocationsFail: payload => ({ type: actionTypes.FetchLocаtionFail, payload }),
};

export function* saga() {
  yield takeLatest(actionTypes.FetchLocаtionRequest, function* fetchLocationsSaga({ payload }) {
    if (!payload) return yield put(actions.clearLocations());
    try {
      yield delay(1000);
      const { data } = yield call(getLocation, payload);

      yield put(actions.fetchLocationsSuccess(data));
    } catch (e) {
      yield put(actions.fetchLocationsFail());
    }
  });
}
