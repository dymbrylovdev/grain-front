import { takeLatest, put } from "redux-saga/effects";
import { actions as builderActions} from "../../../_metronic/ducks/builder";
import { persistReducer } from "redux-persist";
import getMenuConfig from "../../router/MenuConfig";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetCropsList: "[SetCrop] Action",
}

const initialCropState = {
    crops: []
}


export const reducer = persistReducer(
    { storage, key: "demo1-crops"},
    (state = initialCropState, action) => {
      switch (action.type) {
        case actionTypes.SetCropsList: {
          const { data } = action.payload;   
          return { ...state, crops: data };
        }
        default:
          return state;
      }
    }
  );

  export const actions = {
    setCrops: (data, isAdmin) => ({type: actionTypes.SetCropsList, payload: {data, isAdmin}})
  }


  export function* saga(){
    yield takeLatest(actionTypes.SetCropsList, function* setMenuConfig({payload}){
      const menuWithCrops = getMenuConfig(payload.data, payload.isAdmin);
      yield put(builderActions.setMenuConfig(menuWithCrops));
    })
  }



  