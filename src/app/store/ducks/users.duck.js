import { persistReducer } from "redux-persist";
import { put, takeLatest } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { getUsers, getStatuses, getUserById, deleteUser } from "../../crud/users.crud";

export const actionTypes = {
  CreateUser: "[CreateUser] Action",
  EditUser: "[EditUser] Action",

  GetStatuses: "[GetStatuses] Action",
  StatusesSuccess: "[GetStatuses] Success",
  StatusesFail: "[GetStatuses] Fail",
  

  GetUserById:  "[GetUserById] Action",
  UserByIdSuccess: "[GetUserById] Success",
  UserByIdFail: "[GetUserById] Fail",

  GetUsers: "[GetUsers] Action",
  UsersSuccess: "[GetUsers] Success",
  UsersFail: "[GetUsers] Fail",

  DeleteUser: "[DeleteUser] Action",
  DeleteUserSuccess: "[DeleteUser] Success",
  DeleteUserFail: "[DeleteUser] Fail",

  ClearUsersErros: "[ClearUserErrors] Action",


};

const initialDocState = {
  users: [],
  statuses: [],
  roles: [],
  currentUser: {},
  errors: {},
};

export const reducer = persistReducer(
  { storage, key: "demo1-users" },
  (state = initialDocState, action) => {
    switch (action.type) {
      case actionTypes.EditUser: {
        const { data } = action.payload;
        const { users } = state;
        const replaceUsers = users.map(item => (item.id === data.id ? data : item));
        return { ...state, users: replaceUsers };
      }
      case actionTypes.SetUsers: {
        const { data } = action.payload;
        const { page, per_page, total, total_pages, data: users } = data;
        return { ...state, users, page, per_page, total, total_pages };
      }
      case actionTypes.StatusesSuccess: {
        const { data } = action.payload;
        return { ...state, statuses: data };
      }

      case actionTypes.GetUserById: {
        return { ...state, currentUser: { loading: true}, errors: {}}
      }
      case actionTypes.UserByIdFail: {
        return { ...state, currentUser: { loading: false}, errors: {current: true}}
      }
      case actionTypes.UserByIdSuccess: {
        const { data } = action.payload
        return { ...state, currentUser: data }
      }

      case actionTypes.GetUsers: {
        const { params: {page} } = action.payload;
        return { ...state, users: { loading: true, page}, errors: { }}
      }
      case actionTypes.UsersSuccess: {
        const { data } = action.payload;
        return { ...state, users: data};
      }
      case actionTypes.UsersFail: {
        return { ...state,  errors: {  getUser: true}, users: { ...state.users, loading: false} }
      }

      case actionTypes.DeleteUser: {
        return { ...state, errors: {}}
      }
      case actionTypes.DeleteUserFail: {
        return { ...state, errors: {  delete: true}}
      }

      case actionTypes.ClearUsersErros: {
        return { ...state, errors: {}};
      }

      default:
        return state;
    }
  }
);

export const actions = {
  createUser: () => ({ type: actionTypes.CreateUser }),
  editUserSuccess: data => ({ type: actionTypes.EditUser, payload: { data } }),


  getStatuses: () => ({type: actionTypes.GetStatuses}),
  statusesSucces: data => ({ type: actionTypes.StatusesSuccess, payload: { data } }),

  getUserById: id => ({type: actionTypes.GetUserById, payload: {id}}),
  userByIdSuccess: data => ({type: actionTypes.UserByIdSuccess, payload: {data}}),
  UserByIdFail: () => ({type: actionTypes.UserByIdFail}),

  getUsers: params => ({type: actionTypes.GetUsers, payload: {params}}),
  usersSuccess: data => ({ type: actionTypes.UsersSuccess, payload: {data}}),
  usersFail: error => ({ type: actionTypes.UsersFail, payload: {error}}),

  deleteUser: (id, params) => ({ type: actionTypes.DeleteUser, payload: { id, params } }),
  deleteUserFail: error => ({ type: actionTypes.DeleteUserFail, payload: { error }}),

  clearErrors: () => ({type: actionTypes.ClearUsersErros}),

};

function* getUserByIdSaga({payload:{id}}){
    try{
        const {data} = yield getUserById(id);
        if(data && data.data){
          yield put(actions.userByIdSuccess(data.data));
        }
    }catch(e){
        yield put(actions.UserByIdFail());
    }
}

function* getUsersSaga({payload: {params}}){
  try {
    const {data} = yield getUsers(params);
    if (data){
      yield put(actions.usersSuccess(data));
    }
  }catch(e){
      yield put(actions.usersFail());
  }
}

function* deleteUserSaga({payload: {id, params}}){
  try {
    const { data } = yield deleteUser(id);
    yield put(actions.getUsers(params))
  } catch(e){
    yield put(actions.deleteUserFail());
  }
}

function* getStatusesSaga(){
  try {
    const {data} = yield getStatuses();
    console.log('---getStatuses', data);
    if( data && data.data){
      yield put(actions.statusesSuccess(data.data));
    }
  }catch(e){
    
}
}
export function* saga() {
  yield takeLatest(actionTypes.CreateUser, function* userRequested() {
    const { data } = yield getUsers({ page: 1 });
    yield put(actions.setUsers(data));
  });
  yield takeLatest(actionTypes.GetUserById, getUserByIdSaga);
  yield takeLatest(actionTypes.GetUsers, getUsersSaga);
  yield takeLatest(actionTypes.DeleteUser, deleteUserSaga);
  yield takeLatest(actionTypes.GetStatuses, getStatusesSaga);
}
