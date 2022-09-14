import { ILocation } from './../../interfaces/locations';
import { Reducer } from "redux";
import { put, takeLatest, call } from "redux-saga/effects";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { ActionsUnion, createAction } from "../../utils/action-helper";
import {editOptions} from "../../crud/options.crud";
import {actions as authActions} from "./auth.duck";

const EDIT_OPTIONS_REQUEST = "options/EDIT_OPTIONS_REQUEST";
const EDIT_OPTIONS_SUCCESS = "options/EDIT_OPTIONS_SUCCESS";
const SET_SELECTED_LOCATION = "options/SET_SELECTED_LOCATION";
const CLEAR_SELECTED_LOCATION = "options/CLEAR_SELECTED_LOCATION";
const EDIT_OPTIONS_ERR = "options/EDIT_OPTIONS_ERR";

export interface IInitialState {
    editLoading: boolean;
    selectedLocation: ILocation | null;
}

const initialState: IInitialState = {
    editLoading: false, 
    selectedLocation: null,
};

export type TInitialState = typeof initialState;


export const reducer: Reducer<any> = persistReducer(
    {
        storage,
        key: "options",
        // whitelist: ["currentSaleFilters", "currentPurchaseFilters", "pointPrices"],
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
            case EDIT_OPTIONS_ERR: {
                return {
                    ...state,
                    editLoading: false,
                    editLoadingErr: action.payload
                };
            }
            case SET_SELECTED_LOCATION: {
                return {
                    ...state,
                    selectedLocation: action.payload,
                };
            }
            case CLEAR_SELECTED_LOCATION: {
                return {
                    ...state,
                    selectedLocation: null,
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
    editOptionsErr: (payload: any) => createAction(EDIT_OPTIONS_ERR, payload),
    setSelectedLocation: (payload : any) => createAction(SET_SELECTED_LOCATION, payload),
    clearSelectedLocation: () => createAction(CLEAR_SELECTED_LOCATION),

};

export type TActions = ActionsUnion<typeof actions>;

function* editSaga({ payload }: { payload: { id: any, data: any } }) {
    try {
          const {data} = yield call(() => editOptions(payload.id, payload.data));
          yield put(actions.editOptionsSuccess());
          yield put(authActions.editUserSuccess(data));
    } catch (e) {
          yield put(actions.editOptionsErr(e?.response?.data?.message || "Ошибка соединения."));
    }
}



export function* saga() {
    yield takeLatest<ReturnType<typeof actions.editRequest>>(EDIT_OPTIONS_REQUEST, editSaga);
}