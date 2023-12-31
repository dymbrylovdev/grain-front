import { all, fork } from "redux-saga/effects";
import { combineReducers, Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";

import { metronic } from "../../_metronic";

import * as auth from "./ducks/auth.duck";
import * as users from "./ducks/users.duck";
import * as statuses from "./ducks/statuses.duck";
import * as locations from "./ducks/locations.duck";
import * as yaLocations from "./ducks/yaLocations.duck";
import * as docs from "./ducks/docs.duck";
import * as agreement from "./ducks/agreement.duck";
import * as bids from "./ducks/bids.duck";
import * as myFilters from "./ducks/myFilters.duck";
import * as crops from "./ducks/crops.duck";
import * as crops2 from "./ducks/crops2.duck";
import * as companies from "./ducks/companies.duck";
import * as funnelStates from "./ducks/funnelStates.duck";
import * as deals from "./ducks/deals.duck";
import * as tariffs from "./ducks/tariffs.duck";
import * as trial from "./ducks/trial.duck";
import * as leftMenu from "./ducks/leftMenu.duck";
import * as options from "./ducks/options.duck";

import * as prompter from "./ducks/prompter.duck";

export type TAppActions =
  | agreement.TActions
  | auth.TActions
  | users.TActions
  | statuses.TActions
  | locations.TActions
  | yaLocations.TActions
  | prompter.TActions
  | myFilters.TActions
  | bids.TActions
  | crops2.TActions
  | funnelStates.TActions
  | deals.TActions
  | tariffs.TActions
  | trial.TActions
  | leftMenu.TActions
  | options.TActions;

export interface IAppState {
  i18n: typeof metronic.i18n.reducer;
  builder: typeof metronic.builder.reducer;
  auth: auth.IInitialState & PersistPartial;
  users: users.IInitialState & PersistPartial;
  statuses: statuses.IInitialState;
  locations: locations.IInitialState;
  yaLocations: yaLocations.IInitialState;
  docs: typeof docs.reducer;
  agreement: agreement.IInitialState;
  bids: bids.IInitialState & PersistPartial;
  myFilters: myFilters.IInitialState & PersistPartial;
  crops: typeof crops.reducer;
  crops2: crops2.IInitialState & PersistPartial;
  companies: typeof companies.reducer;
  funnelStates: funnelStates.IInitialState;
  prompter: prompter.IInitialState & PersistPartial;
  deals: deals.IInitialState & PersistPartial;
  tariffs: tariffs.IInitialState & PersistPartial;
  trial: trial.IInitialState;
  leftMenu: leftMenu.TInitialState;
  options: options.TInitialState;
}

export const rootReducer: Reducer<IAppState, TAppActions> = combineReducers<IAppState, TAppActions>(
  {
    auth: auth.reducer,
    i18n: metronic.i18n.reducer,
    builder: metronic.builder.reducer,
    users: users.reducer,
    statuses: statuses.reducer,
    locations: locations.reducer,
    yaLocations: yaLocations.reducer,
    docs: docs.reducer,
    agreement: agreement.reducer,
    bids: bids.reducer,
    myFilters: myFilters.reducer,
    crops: crops.reducer,
    crops2: crops2.reducer,
    companies: companies.reducer,
    funnelStates: funnelStates.reducer,
    prompter: prompter.reducer,
    deals: deals.reducer,
    tariffs: tariffs.reducer,
    trial: trial.reducer,
    leftMenu: leftMenu.reducer,
    options: options.reducer,

  }
);

export function* rootSaga() {
  yield all(
    [
      agreement.saga,
      auth.saga,
      users.saga,
      statuses.saga,
      crops.saga,
      crops2.saga,
      bids.saga,
      myFilters.saga,
      locations.saga,
      yaLocations.saga,
      companies.saga,
      funnelStates.saga,
      deals.saga,
      tariffs.saga,
      trial.saga,
      options.saga,
    ].map(saga => fork(saga))
  );
}
