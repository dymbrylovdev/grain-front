import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";

import { ActionsUnion, createAction } from "../../utils/action-helper";

const SET_LEFT_MENU_OPEN = "leftMenu/SET_LEFT_MENU_OPEN";
const SET_SALE_PURCHASE_MODE = "leftMenu/SET_SALE_PURCHASE_MODE";

const initialState = {
  leftMenuOpen: false,
  salePurchaseMode: undefined as "sale" | "purchase" | undefined,
};

export type TInitialState = typeof initialState;

export const reducer: Reducer<TInitialState, TAppActions> = (state = initialState, action) => {
  switch (action.type) {
    case SET_LEFT_MENU_OPEN: {
      return {
        ...state,
        leftMenuOpen: action.payload.leftMenuOpen,
      };
    }

    case SET_SALE_PURCHASE_MODE: {
      return {
        ...state,
        salePurchaseMode: action.payload.salePurchaseMode,
      };
    }

    default:
      return state;
  }
};

export const leftMenuActions = {
  setLeftMenuOpen: (leftMenuOpen: boolean) => createAction(SET_LEFT_MENU_OPEN, { leftMenuOpen }),
  setSalePurchaseMode: (salePurchaseMode: "sale" | "purchase" | undefined) =>
    createAction(SET_SALE_PURCHASE_MODE, { salePurchaseMode }),
};

export type TActions = ActionsUnion<typeof leftMenuActions>;
