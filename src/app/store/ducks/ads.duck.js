import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest, put } from "redux-saga/effects";
import { getBestAds, getAllAds, getMyAds } from "../../crud/ads.crud";

export const actionTypes = {
  CreateAdSuccess: "[CreateAd] Action",
  EditAdSuccess: "[EditAd] Action",
  GetBestAds: "[GetBestAds] Action",
  BestAdsSuccess: "[GetBestAds] Success",
  BestAdsFail: "[GetBestAds] Fail",
  DeleteAdSuccess: "[DeleteAd] Action",
  GetAllAds: "[GetAllBids] Action",
  AllAdsFail: "[GetAllBidsFail] Action",
  AllAdsSuccess: "[GetAllBidsSuccess] Action",
  GetMyAds: "[GetMyAds] Action",
  MyAdsSuccess: "[GetMyAds] Success",
  MyAdsFail: "[GetMyAds] Fail",
};

const initialAdState = {
  bestAds: [],
  myAds: {},
  allBids: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-ads" },
  (state = initialAdState, action) => {
    switch (action.type) {

      case actionTypes.GetAllAds: {
        return { ...state, allBids: { ...state.allBids, loading: true } };
      }
      case actionTypes.AllAdsFail: {
        return { ...state, allBids: { ...state.allBids, loading: false } };
      }
      case actionTypes.AllAdsSuccess: {
        const { data } = action.payload;
        return { ...state, allBids: data };
      }

      case actionTypes.GetMyAds: {
        return { ...state, myAds: { ...state.myAds, loading: true } };
      }
      case actionTypes.MyAdsFail: {
        return { ...state, myAds: { ...state.myAds, loading: false } };
      }
      case actionTypes.MyAdsSuccess: {
        const { data } = action.payload;
        return { ...state, myAds: data };
      }

      case actionTypes.GetBestAds: {
        return { ...state, bestAds: { ...state.bestAds, loading: true } };
      }
      case actionTypes.BestAdsFail: {
        return { ...state, bestAds: { ...state.bestAds, loading: false } };
      }
      case actionTypes.BestAdsSuccess: {
        const { data } = action.payload;
        return { ...state, bestAds: data };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  getBestAds: (params) => ({type: actionTypes.GetBestAds, payload: {params}}),
  bestAdsSuccess: data => ({ type: actionTypes.BestAdsSuccess, payload: { data } }),
  bestAdsFail: () => ({ type: actionTypes.BestAdsFail }),
  createAdSuccess: () => ({ type: actionTypes.CreateAdSuccess }),
  deleteAdSuccess: id => ({ type: actionTypes.DeleteAdSuccess, payload: { id } }),
  editAdSuccess: data => ({ type: actionTypes.EditAdSuccess, payload: { data } }),
  getAllAds: (id, page) => ({ type: actionTypes.GetAllAds, payload: { id, page } }),
  allAdsSuccess: data => ({ type: actionTypes.AllAdsSuccess, payload: { data } }),
  allAdsFail: () => ({ type: actionTypes.AllAdsFail }),
  getMyAds: () => ({ type: actionTypes.GetMyAds }),
  myAdsSuccess: data => ({ type: actionTypes.MyAdsSuccess, payload: { data } }),
  myAdsFail: () => ({ type: actionTypes.MyAdsFail }),
};

function* getAllAdsSaga({ payload: { id, page } }) {
  try {
    const { data } = yield getAllAds(id, page);
    if (data && data.data) {
      yield put(actions.allAdsSuccess(data));
    }
  } catch (e) {
    yield put(actions.allAdsFail());
  }
}

function* getMyAdsSaga() {
  try {
    const { data } = yield getMyAds();
    if (data) {
      yield put(actions.myAdsSuccess(data));
    }
  } catch (e) {
    yield put(actions.myAdsFail());
  }
}

function* getBestAdsSaga({payload: {params}}) {
  try {
    const { data } = yield getBestAds(params);
    if (data && data.data) {
      yield put(actions.bestAdsSuccess(data.data));
    }
  } catch (e) {
    yield put(actions.bestAdsFail());
  }
}



export function* saga() {
  yield takeLatest(actionTypes.GetAllAds, getAllAdsSaga);
  yield takeLatest(actionTypes.GetMyAds, getMyAdsSaga);
  yield takeLatest(actionTypes.GetBestAds, getBestAdsSaga)
}
