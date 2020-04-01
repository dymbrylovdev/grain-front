import { all, fork } from "redux-saga/effects";
import { combineReducers } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";

import { metronic } from "../../_metronic";

import * as auth from "./ducks/auth.duck";
import * as users from "./ducks/users.duck";
import * as locations from "./ducks/locations.duck";
import * as docs from "./ducks/docs.duck";
import * as bids from "./ducks/bids.duck";
import * as myFilters from "./ducks/myFilters.duck";
import * as crops from "./ducks/crops.duck";
import * as crops2 from "./ducks/crops2.duck";
import * as companies from "./ducks/companies.duck";

import * as prompter from "./ducks/prompter.duck";

export type TAppActions = prompter.TActions | myFilters.TActions | crops2.TActions;

export interface IAppState {
  i18n: typeof metronic.i18n.reducer;
  builder: typeof metronic.builder.reducer;
  auth: typeof auth.reducer;
  users: typeof users.reducer;
  locations: typeof locations.reducer;
  docs: typeof docs.reducer;
  bids: typeof bids.reducer;
  myFilters: myFilters.IInitialState & PersistPartial;
  crops: typeof crops.reducer;
  crops2: crops2.IInitialState & PersistPartial;
  companies: typeof companies.reducer;
  prompter: prompter.IInitialState & PersistPartial;
}

export const rootReducer: (state: IAppState, action: TAppActions) => IAppState = combineReducers<
  IAppState,
  TAppActions
>({
  auth: auth.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  users: users.reducer,
  locations: locations.reducer,
  docs: docs.reducer,
  bids: bids.reducer,
  myFilters: myFilters.reducer,
  crops: crops.reducer,
  crops2: crops2.reducer,
  companies: companies.reducer,
  prompter: prompter.reducer,
});

export function* rootSaga() {
  yield all(
    [
      auth.saga,
      users.saga,
      crops.saga,
      crops2.saga,
      bids.saga,
      myFilters.saga,
      locations.saga,
      companies.saga,
    ].map(saga => fork(saga))
  );
}
