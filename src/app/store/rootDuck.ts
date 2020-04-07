import { all, fork } from "redux-saga/effects";
import { combineReducers, Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";

import { metronic } from "../../_metronic";

import * as auth from "./ducks/auth.duck";
import * as users from "./ducks/users.duck";
import * as statuses from "./ducks/statuses.duck";
import * as locations from "./ducks/locations.duck";
import * as googleLocations from "./ducks/yaLocations.duck";
import * as docs from "./ducks/docs.duck";
import * as bids from "./ducks/bids.duck";
import * as myFilters from "./ducks/myFilters.duck";
import * as crops from "./ducks/crops.duck";
import * as crops2 from "./ducks/crops2.duck";
import * as companies from "./ducks/companies.duck";

import * as prompter from "./ducks/prompter.duck";

export type TAppActions =
  | auth.TActions
  | users.TActions
  | statuses.TActions
  | locations.TActions
  | googleLocations.TActions
  | prompter.TActions
  | myFilters.TActions
  | crops2.TActions;

export interface IAppState {
  i18n: typeof metronic.i18n.reducer;
  builder: typeof metronic.builder.reducer;
  auth: auth.IInitialState & PersistPartial;
  users: users.IInitialState;
  statuses: statuses.IInitialState;
  locations: locations.IInitialState;
  googleLocations: googleLocations.IInitialState;
  docs: typeof docs.reducer;
  bids: typeof bids.reducer;
  myFilters: myFilters.IInitialState & PersistPartial;
  crops: typeof crops.reducer;
  crops2: crops2.IInitialState & PersistPartial;
  companies: typeof companies.reducer;
  prompter: prompter.IInitialState & PersistPartial;
}

export const rootReducer: Reducer<IAppState, TAppActions> = combineReducers<IAppState, TAppActions>(
  {
    auth: auth.reducer,
    i18n: metronic.i18n.reducer,
    builder: metronic.builder.reducer,
    users: users.reducer,
    statuses: statuses.reducer,
    locations: locations.reducer,
    googleLocations: googleLocations.reducer,
    docs: docs.reducer,
    bids: bids.reducer,
    myFilters: myFilters.reducer,
    crops: crops.reducer,
    crops2: crops2.reducer,
    companies: companies.reducer,
    prompter: prompter.reducer,
  }
);

export function* rootSaga() {
  yield all(
    [
      auth.saga,
      users.saga,
      statuses.saga,
      crops.saga,
      crops2.saga,
      bids.saga,
      myFilters.saga,
      locations.saga,
      googleLocations.saga,
      companies.saga,
    ].map(saga => fork(saga))
  );
}
