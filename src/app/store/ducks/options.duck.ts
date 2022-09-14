import { Reducer } from "redux";
import { TAppActions } from "../rootDuck";
import { put, takeLatest, call } from "redux-saga/effects";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import {editOptions} from "../../crud/options.crud";
import {actions as authActions} from "./auth.duck";


const EDIT_OPTIONS_REQUEST = "options/EDIT_OPTIONS_REQUEST";
const EDIT_OPTIONS_SUCCESS = "options/EDIT_OPTIONS_SUCCESS";

export interface IInitialState {
    editLoading: boolean;
}

const initialState: IInitialState = {
    editLoading: false
};

export type TInitialState = typeof initialState;


export const reducer: Reducer<any> = persistReducer(
    {
        storage,
        key: "filters",
        whitelist: ["currentSaleFilters", "currentPurchaseFilters", "pointPrices"],
    },
    (state = initialState, action) => {
        switch (action.type) {
            case EDIT_OPTIONS_REQUEST: {
                return {
                    ...state,
                    editLoading: true,
                };
            }
            case EDIT_OPTIONS_SUCCESS: {
                return {
                    ...state,
                    editLoading: false,
                };
            }



            default:
                return state;
        }
    }
);

export const actions = {
    editRequest: (payload: { id: any, data: any }) => createAction(EDIT_OPTIONS_REQUEST, payload),
    editOptionsSuccess: () => createAction(EDIT_OPTIONS_SUCCESS),

};

export type TActions = ActionsUnion<typeof actions>;

function* editSaga({ payload }: { payload: { id: any, data: any } }) {
    try {
          const {data} = yield call(() => editOptions(payload.id, payload.data));
          yield put(actions.editOptionsSuccess());
          yield put(authActions.editUserSuccess(data));
    } catch (e) {
          yield put(authActions.fetchFail(e?.response?.data?.message || "Ошибка соединения."));
    }
}



export function* saga() {
    yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_OPTIONS_REQUEST, editSaga);
}