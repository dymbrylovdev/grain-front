import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest, put } from "redux-saga/effects";
import { getBestAds, getAllAds } from "../../crud/ads.crud";

export const actionTypes = {
  CreateAdSuccess: "[CreateAd] Action",
  EditAdSuccess: "[EditAd] Action",
  SetBestAds: "[GetBestAds] Action",
  SetMyAds: "[GetMyAds] Action",
  DeleteAdSuccess: "[DeleteAd] Action",
  GetAllAds: "[GetAllBids] Action",
  AllAdsFail: "[GetAllBidsFail] Action",
  AllAdsSuccess: "[GetAllBidsSuccess] Action",
};

const initialAdState = {
  bestAds: [],
  myAds: [],
  allBids: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-ads" },
  (state = initialAdState, action) => {
    switch (action.type) {
      case actionTypes.SetBestAds: {
        const { data } = action.payload;
        return { ...state, bestAds: data };
      }
      case actionTypes.SetMyAds: {
        const { data } = action.payload;
        return { ...state, myAds: data };
      }
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
      /*case actionTypes.DeleteAdSuccess: {
        const { id } = action.payload;
        const { bestAds } = state;
        const replaceAds = bestAds.filter(item => item.id !== id);
        return { ...state, bestAds: replaceAds };
      }*/
      default:
        return state;
    }
  }
);

export const actions = {
  setBestAds: data => ({ type: actionTypes.SetBestAds, payload: { data } }),
  setMyAds: data => ({ type: actionTypes.SetMyAds, payload: { data } }),
  createAdSuccess: () => ({ type: actionTypes.CreateAdSuccess }),
  deleteAdSuccess: id => ({ type: actionTypes.DeleteAdSuccess, payload: { id } }),
  editAdSuccess: data => ({ type: actionTypes.EditAdSuccess, payload: { data } }),
  getAllAds: (id, page) => ({ type: actionTypes.GetAllAds, payload: { id, page } }),
  allAdsSucess: data => ({ type: actionTypes.AllAdsSuccess, payload: { data } }),
  allAdsFail: () => ({ type: actionTypes.AllAdsFail }),
};



export function* saga() {
  yield takeLatest(actionTypes.GetAllAds, function* getAllAdsSaga({ payload: { id, page } }) {
    try {
      const { data } = yield getAllAds(id, page);
      if (data && data.data) {
        yield put(actions.allAdsSucess(data));
      }
    } catch (e) {
      yield put(actions.allAdsFail());
    }
  });
}
