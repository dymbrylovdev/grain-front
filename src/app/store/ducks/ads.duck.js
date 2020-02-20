import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest, put } from "redux-saga/effects";
import { getBestAds } from "../../crud/ads.crud";

export const actionTypes = {
  CreateAdSuccess: "[CreateAd] Action",
  EditAdSuccess: "[EditAd] Action",
  SetBestAds: "[GetBestAds] Action",
  SetMyAds: "[GetMyAds] Action",
  DeleteAdSuccess: "[DeleteAd] Action",
};

const initialAdState = {
  bestAds: [],
  myAds: [],
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
      case actionTypes.EditAdSuccess: {
        const { data } = action.payload;
        const { bestAds } = state;
        const replaceAds = bestAds.map(item => (item.id === data.id ? data : item));
        return { ...state, bestAds: replaceAds };
      }
      case actionTypes.DeleteAdSuccess: {
        const { id } = action.payload;
        const { bestAds } = state;
        const replaceAds = bestAds.filter(item => item.id !== id);
        return { ...state, bestAds: replaceAds };
      }
      default:
        return state;
    }
  }
);

export const actions = {
  setBestAds: data => ({ type: actionTypes.SetBestAds, payload: { data } }),
  setMyAds: data => ({ type: actionTypes.SetMyAds, payload: { data } }),
  createAdSuccess: () => ({ type: actionTypes.CreateAdSuccess }),
  deleteAdSuccess: (id) => ({type: actionTypes.DeleteAdSuccess, payload: {id}}),
  editAdSuccess: (data) => ({type: actionTypes.EditAdSuccess, payload: {data}})
};

export function* saga() {
  yield takeLatest(actionTypes.CreateAdSuccess, function* adsRequested() {
    const { data } = yield getBestAds();
    yield put(actions.setBestAds(data.data));
  });
}
