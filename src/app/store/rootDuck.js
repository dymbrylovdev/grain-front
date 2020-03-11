import { all, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import * as users from "./ducks/users.duck";
import * as locations from "./ducks/locations.duck";
import * as docs from "./ducks/docs.duck";
import * as bids from "./ducks/bids.duck";
import * as crops from "./ducks/crops.duck";
import * as companies from "./ducks/companies.duck";
import { metronic } from "../../_metronic";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  users: users.reducer,
  locations: locations.reducer,
  docs: docs.reducer,
  bids: bids.reducer,
  crops: crops.reducer,
  companies: companies.reducer,
});

export function* rootSaga() {
  yield all([auth.saga, users.saga, crops.saga, bids.saga, locations.saga, companies.saga].map(saga => fork(saga)));
}
