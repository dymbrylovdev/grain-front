import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest, put } from "redux-saga/effects";
import { getBestBids, getAllBids, getMyBids, getBidById } from "../../crud/bids.crud";

export const actionTypes = {
  CreateBidSuccess: "[CreateBid] Action",
  EditBidSuccess: "[EditBid] Action",
  DeleteBidSuccess: "[DeleteBid] Action",

  GetBestBids: "[GetBestBids] Action",
  BestBidsSuccess: "[GetBestBids] Success",
  BestBidsFail: "[GetBestBids] Fail",



  GetAllBids: "[GetAllBids] Action",
  AllBidsFail: "[GetAllBidsFail] Action",
  AllBidsSuccess: "[GetAllBidsSuccess] Action",

  GetMyBids: "[GetMyBids] Action",
  MyBidsSuccess: "[GetMyBids] Success",
  MyBidsFail: "[GetMyBids] Fail",

  GetBidById: "[GetAdById] Action",
  BidByIdFail: "[GetAdById] Fail",
  BidByIdSuccess: "[GetAdById] Success",
};

const initialAdState = {
  bestAds: [],
  myAds: {},
  allBids: {},
  currentAd: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-ads" },
  (state = initialAdState, action) => {
    switch (action.type) {
      case actionTypes.GetAllBids: {
        return { ...state, allBids: { ...state.allBids, loading: true } };
      }
      case actionTypes.AllBidsFail: {
        return { ...state, allBids: { ...state.allBids, loading: false } };
      }
      case actionTypes.AllBidsSuccess: {
        const { data } = action.payload;
        return { ...state, allBids: data };
      }

      case actionTypes.GetMyBids: {
        return { ...state, myAds: { ...state.myAds, loading: true } };
      }
      case actionTypes.MyBidsFail: {
        return { ...state, myAds: { ...state.myAds, loading: false } };
      }
      case actionTypes.MyBidsSuccess: {
        const { data } = action.payload;
        return { ...state, myAds: data };
      }

      case actionTypes.GetBestBids: {
        return { ...state, bestAds: { ...state.bestAds, loading: true } };
      }
      case actionTypes.BestBidsFail: {
        return { ...state, bestAds: { ...state.bestAds, loading: false } };
      }
      case actionTypes.BestBidsSuccess: {
        const { data } = action.payload;
        return { ...state, bestAds: data };
      }

      case actionTypes.GetBidById: {
        return { ...state, currentAd: { ...state.currentAd, loading: true } };
      }
      case actionTypes.BidByIdFail: {
        return { ...state, currentAd: { ...state.currentAd, loading: false } };
      }
      case actionTypes.BidByIdSuccess: {
        const { data } = action.payload;
        const myAdsList =
          state.myAds &&
          state.myAds.list &&
          state.myAds.list.map(item => (data.id === item.id ? data : item));
        const bestAdsExactList =
          state.bestAds &&
          state.bestAds.equal &&
          state.bestAds.equal.map(item => (data.id === item.id ? data : item));
        const bestAdsinexactList =
          state.bestAds &&
          state.bestAds.inexact &&
          state.bestAds.inexact.map(item => (data.id === item.id ? data : item));
        const allAdsList =
          state.allBids &&
          state.allBids.data &&
          state.allBids.data.map(item => (data.id === item.id ? data : item));
          
        return {
          ...state,
          myAds: { ...state.myAds, list: myAdsList },
          allBids: { ...state.allBids, data: allAdsList },
          bestAds: { ...state.bestAds, equal: bestAdsExactList, inexact: bestAdsinexactList },
          currentAd: { loading: false}
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  getBestBids: params => ({ type: actionTypes.GetBestBids, payload: { params } }),
  bestBidsSuccess: data => ({ type: actionTypes.BestBidsSuccess, payload: { data } }),
  bestBidsFail: () => ({ type: actionTypes.BestBidsFail }),

  createBidSuccess: () => ({ type: actionTypes.CreateBidSuccess }),
  deleteBidSuccess: id => ({ type: actionTypes.DeleteBidSuccess, payload: { id } }),
  editBidSuccess: data => ({ type: actionTypes.EditBidSuccess, payload: { data } }),

  getAllBids: (id, page) => ({ type: actionTypes.GetAllBids, payload: { id, page } }),
  allBidsSuccess: data => ({ type: actionTypes.AllBidsSuccess, payload: { data } }),
  allBidsFail: () => ({ type: actionTypes.AllBidsFail }),

  getMyBids: () => ({ type: actionTypes.GetMyBids }),
  myBidsSuccess: data => ({ type: actionTypes.MyBidsSuccess, payload: { data } }),
  myBidsFail: () => ({ type: actionTypes.MyBidsFail }),

  getBidById: (id, data) => ({ type: actionTypes.GetBidById, payload: { data, id } }),
  bidByIdSuccess: data => ({ type: actionTypes.BidByIdSuccess, payload: { data } }),
  bidByIdFail: () => ({ type: actionTypes.BidByIdFail }),
};

function* getAllBidsSaga({ payload: { id, page } }) {
  try {
    const { data } = yield getAllBids(id, page);
    if (data && data.data) {
      yield put(actions.allBidsSuccess(data));
    }
  } catch (e) {
    yield put(actions.allBidsFail());
  }
}

function* getMyBidsSaga() {
  try {
    const { data } = yield getMyBids();
    if (data) {
      yield put(actions.myBidsSuccess(data));
    }
  } catch (e) {
    yield put(actions.myBidsFail());
  }
}

function* getBestBidsSaga({ payload: { params } }) {
  try {
    const { data } = yield getBestBids(params);
    if (data && data.data) {
      yield put(actions.bestBidsSuccess(data.data));
    }
  } catch (e) {
    yield put(actions.bestBidsFail());
  }
}

function* getBidByIdSaga({ payload: { id } }) {
  if (id) {
    try {
      const { data } = yield getBidById(id);
      if (data && data.data) {
        yield put(actions.bidByIdSuccess(data.data));
      }
    } catch (e) {
      yield put(actions.bidByIdFail());
    }
  } else {
    yield put(actions.bidByIdSuccess({}));
  }
}

export function* saga() {
  yield takeLatest(actionTypes.GetAllBids, getAllBidsSaga);
  yield takeLatest(actionTypes.GetMyBids, getMyBidsSaga);
  yield takeLatest(actionTypes.GetBestBids, getBestBidsSaga);
  yield takeLatest(actionTypes.GetBidById, getBidByIdSaga);
}
