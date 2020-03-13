import { takeLatest, put, call } from "redux-saga/effects";
import { actions as builderActions} from "../../../_metronic/ducks/builder";
import { persistReducer } from "redux-persist";
import getMenuConfig from "../../router/MenuConfig";
import { getCrops } from "../../crud/crops.crud";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetCropsList: "[SetCrop] Action",
    CreateCropSucces: "[CreateCrop] Action",
    EditCropSuccess: "[EditCrop] Action",
    SetFilterForCrop: "[SetFilterForCrop] Action",
    Logout:  "[CropLogout] Action"
}

const initialCropState = {
    crops: [],
    filters: {

    }
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
        case actionTypes.SetFilterForCrop: {
          const { filter, cropId} = action.payload;
          return {...state, filters: { ...state.filters, [cropId]:filter}}
        }
        case actionTypes.Logout: {
           return initialCropState;
        }
        default:
          return state;
      }
    }
  );

  export const actions = {
    setCrops: (data, user) => ({type: actionTypes.SetCropsList, payload: {data, user}}),
    editCropSuccess: (data) => ({type: actionTypes.EditCropSuccess, payload: {data}}),
    createCropSuccess: () => ({type: actionTypes.CreateCropSucces}),
    setFilterForCrop: (filter, cropId) => ({type: actionTypes.SetFilterForCrop, payload: {filter, cropId}}),
    logout: ()=> ({type: actionTypes.Logout})
  }


  export function* saga(){
    yield takeLatest(actionTypes.SetCropsList, function* setMenuConfig({payload}){
      const menuWithCrops = getMenuConfig(payload.data, payload.user);
      yield put(builderActions.setMenuConfig(menuWithCrops));
    })
  }



  