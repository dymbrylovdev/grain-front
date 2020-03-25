import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Reducer } from "redux";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { TAppActions } from "../rootDuck";

import { ActionsUnion, createAction } from "../../utils/action-helper";

const RUN_PROMPTER = "prompter/RUN_PROMPTER";
const STOP_PROMPTER = "prompter/STOP_PROMPTER";
const SET_ACTIVE_STEP = "prompter/SET_ACTIVE_STEP";

type TDullRole = "buyer" | "seller";

export interface IInitialState {
  dullRole: TDullRole;
  running: boolean;
  activeStep: number;
}

const initialState: IInitialState = {
  dullRole: "buyer",
  running: false,
  activeStep: 0,
};

export const reducer: Reducer<IInitialState & PersistPartial, TAppActions> = persistReducer(
  { storage, key: "prompter", whitelist: ["user", "authToken"] },
  (state = initialState, action) => {
    switch (action.type) {
      case RUN_PROMPTER: {
        return {
          ...state,
          dullRole: action.payload,
          running: true,
        };
      }

      case STOP_PROMPTER: {
        return {
          ...state,
          running: false,
        };
      }

      case SET_ACTIVE_STEP:
        return {
          ...state,
          activeStep: action.payload,
        };

      default:
        return state;
    }
  }
);

export const actions = {
  runPrompter: (payload: TDullRole) => createAction(RUN_PROMPTER, payload),
  stopPrompter: () => createAction(STOP_PROMPTER),
  setActiveStep: (payload: number) => createAction(SET_ACTIVE_STEP, payload),
};

export type TActions = ActionsUnion<typeof actions>;
