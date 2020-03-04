import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest, put } from "redux-saga/effects";
import { getBestBids, getAllBids, getMyBids, getBidById, deleteBid } from "../../crud/bids.crud";

export const bidTypes = {
  BestBids: "BestBids",
  MyBids: "MyBids",
  AllBids: "AllBids",
};

export const actionTypes = {
  CreateBidSuccess: "[CreateBid] Action",
  EditBidSuccess: "[EditBid] Action",

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

  DeleteBid: "[DeleteBid] Action",
  DeleteBidSuccess: "[DeleteBid] Success",
  DeleteBidFail: "[DeleteBid] Fail",

  ClearErrors: "[ClearErrors] Action"
};

const initialBidState = {
  bestBids: [],
  myBids: {},
  allBids: {},
  currentBid: {},
  errors: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-ads" },
  (state = initialBidState, action) => {
    switch (action.type) {
      case actionTypes.GetAllBids: {
        return { ...state, allBids: { ...state.allBids, loading: true }, errors: {} };
      }
      case actionTypes.AllBidsFail: {
        return { ...state, allBids: { ...state.allBids, loading: false }, errors: { all: true}};
      }
      case actionTypes.AllBidsSuccess: {
        const { data } = action.payload;
        return { ...state, allBids: data };
      }

      case actionTypes.GetMyBids: {
        return { ...state, myBids: { ...state.myBids, loading: true }, errors: {} };
      }
      case actionTypes.MyBidsFail: {
        return { ...state, myBids: { ...state.myBids, loading: false }, errors: {my: true} };
      }
      case actionTypes.MyBidsSuccess: {
        const { data } = action.payload;
        return { ...state, myBids: data };
      }

      case actionTypes.GetBestBids: {
        return { ...state, bestBids: { ...state.bestBids, loading: true }, errors: {} };
      }
      case actionTypes.BestBidsFail: {
        return { ...state, bestBids: { ...state.bestBids, loading: false }, errors: {bests: true} };
      }
      case actionTypes.BestBidsSuccess: {
        const { data } = action.payload;
        return { ...state, bestBids: data };
      }

      case actionTypes.GetBidById: {
        return { ...state, currentBid: { ...state.currentBid, loading: true }, errors: {} };
      }
      case actionTypes.BidByIdFail: {
        return { ...state, currentBid: { ...state.currentBid, loading: false }, errors: { get: true} };
      }
      case actionTypes.BidByIdSuccess: {
        const { data } = action.payload;
        const myBidsList =
          state.myBids &&
          state.myBids.list &&
          state.myBids.list.map(item => (data.id === item.id ? data : item));
        const bestBidsExactList =
          state.bestBids &&
          state.bestBids.equal &&
          state.bestBids.equal.map(item => (data.id === item.id ? data : item));
        const bestBidsinexactList =
          state.bestBids &&
          state.bestBids.inexact &&
          state.bestBids.inexact.map(item => (data.id === item.id ? data : item));
        const allBidsList =
          state.allBids &&
          state.allBids.data &&
          state.allBids.data.map(item => (data.id === item.id ? data : item));

        return {
          ...state,
          myBids: { ...state.myBids, list: myBidsList },
          allBids: { ...state.allBids, data: allBidsList },
          bestBids: { ...state.bestBids, equal: bestBidsExactList, inexact: bestBidsinexactList },
          currentBid: { loading: false },
        };
      }

      case actionTypes.DeleteBid: {
        return { ...state, errors: {} };
      }

      case actionTypes.DeleteBidFail: {
        return { ...state, errors: { delete: true } };
      }
      case actionTypes.ClearErrors: {
        return { ...state, errors: {}};
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

  deleteBid: (id, type, params )  => ({ type: actionTypes.DeleteBid, payload: { id, type, params } }),
  deleteBidFail: () => ({ type: actionTypes.DeleteBidFail }),

  clearErrors: () => ({ type: actionTypes.ClearErrors}),
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

function* deleteBidSaga({ payload: { id, type, params } }) {
  try {
    const { data } = yield deleteBid(id);
    if (data) {
      switch (type) {
        case bidTypes.BestBids:
          yield put(actions.getBestBids(params));
          break;
        case bidTypes.AllBids:
          yield put(actions.getAllBids(params && params.id, params && params.page));
          break;
        case bidTypes.MyBids:
          yield put(actions.getMyBids());
          break;
        default:
          break;
      }

    }
  } catch (e) {
    yield put(actions.deleteBidFail());
  }
}

export function* saga() {
  yield takeLatest(actionTypes.GetAllBids, getAllBidsSaga);
  yield takeLatest(actionTypes.GetMyBids, getMyBidsSaga);
  yield takeLatest(actionTypes.GetBestBids, getBestBidsSaga);
  yield takeLatest(actionTypes.GetBidById, getBidByIdSaga);
  yield takeLatest(actionTypes.DeleteBid, deleteBidSaga);
}
