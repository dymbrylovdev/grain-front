import { takeLatest, put, call } from "redux-saga/effects";
import { actions as builderActions} from "../../../_metronic/ducks/builder";
import { persistReducer } from "redux-persist";
import getMenuConfig from "../../router/MenuConfig";
import { getCrops } from "../../crud/crops.crud";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetCropsList: "[SetCrop] Action",
    CreateCropSucces: "[CreateCrop] Action",
    EditCropSuccess: "[EditCrop] Action"
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
        case actionTypes.EditCropSuccess: {
          const { data } = action.payload;
          const newCrops = state.crops.map(item => item.id === data.id ? data : item);
          return { ...state, crops: newCrops}
        }
        default:
          return state;
      }
    }
  );

  export const actions = {
    setCrops: (data, isAdmin) => ({type: actionTypes.SetCropsList, payload: {data, isAdmin}}),
    editCropSuccess: (data) => ({type: actionTypes.EditCropSuccess, payload: {data}}),
    createCropSuccess: () => ({type: actionTypes.CreateCropSucces})
  }


  export function* saga(){
    yield takeLatest(actionTypes.SetCropsList, function* setMenuConfig({payload}){
      const menuWithCrops = getMenuConfig(payload.data, payload.isAdmin);
      yield put(builderActions.setMenuConfig(menuWithCrops));
    })
    yield takeLatest(actionTypes.CreateCropSucces, function* getCropsRequest(){
      const data = call(getCrops);
      if(data && data.data){
      yield put(actionTypes.CreateCropSucces, data.data)
      }
    })
  }



  