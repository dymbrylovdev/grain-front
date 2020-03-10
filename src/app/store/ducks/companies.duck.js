import { persistReducer } from "redux-persist";
import { put, takeLatest, call } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { getCompanyById } from "../../crud/company.crud";


export const actionTypes = {
    GetCompanyById: "[GetCompanyById] Action",
    CompanyByIdSuccess: "[GetCompanyById] Success",
    CompanyByIdFail: "[GetCompanyById] Fail",

    CreateCompany: "[CreateCompany] Action",
    EditCompany: "[EditCompany] Action",

    ClearCompanyErrors: "[ClearCompanyErrors] Action",
}

const initialState = {
    currentCompany: {

    },
    companies: [],
    errors: {}
}


export const reducer = persistReducer(
    { storage, key: "demo1-companies" },
    (state = initialState, action) => {
      switch (action.type) {
        case actionTypes.GetCompanyById: {
            return { ...state, currentCompany: {...state.currentCompany, loading: true}, errors: {}}
        }
        case actionTypes.CompanyByIdSuccess: {
            const {data} = action.payload;
            return {...state, currentCompany: data}
        }
        case actionTypes.CompanyByIdFail: {
            return {...state, currentCompany: {loading: false}, errors: { get: true}}
        }
        case actionTypes.ClearCompanyErrors: {
            return {...state, errors: {}}
        }
        default:
          return state;
      }
    }
  );


  export const actions = {

    createCompany: (params, successCallback, failCallback) => ({ type: actionTypes.CreateCompany, payload: {params, successCallback, failCallback} }),
  
    editCompany: (id, params, successCallback, failCallback) => ({ type: actionTypes.EditCompany, payload: { id, params, successCallback, failCallback } }),
  
  
    getCompanyById: id => ({type: actionTypes.GetCompanyById, payload: {id}}),
    companyByIdSuccess: data => ({type: actionTypes.CompanyByIdSuccess, payload: {data}}),
    companyByIdFail: () => ({type: actionTypes.CompanyByIdFail}),
  
  
    clearErrors: () => ({type: actionTypes.ClearCompanyErrors}),
  
  };

  function* companyByIdSaga({payload: {id}}){
      try{
        const {data} = yield call(getCompanyById, id);
        put(actions.companyByIdSuccess(data))
      }catch(e){
          put(actions.companyByIdFail());
      }
  }

  //function* createCompanySaga({payload: {}})
