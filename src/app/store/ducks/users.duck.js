import { persistReducer } from "redux-persist";
import { put, takeLatest } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { getUsers, getStatuses, getUserById } from "../../crud/users.crud";

export const actionTypes = {
  CreateUser: "[CreateUser] Action",
  EditUser: "[EditUser] Action",
  DeleteUser: "[DeleteUser] Action",
  SetUsers: "[GetUsers] Action",
  SetStatuses: "[GetStatuses] Action",

  GetUserById:  "[GetUserById] Action",
  UserByIdSuccess: "[GetUserById] Success",
  UserByIdFail: "[GetUserById] Fail",


};

const initialDocState = {
  page: 1,
  users: [],
  statuses: [],
  roles: [],
  currentUser: {

  }
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
      case actionTypes.DeleteUser: {
        const { id } = action.payload;
        const { users } = state;
        const replaceUsers = users.filter(item => item.id !== id);
        return { ...state, users: replaceUsers };
      }
      case actionTypes.SetUsers: {
        const { data } = action.payload;
        const { page, per_page, total, total_pages, data: users } = data;
        return { ...state, users, page, per_page, total, total_pages };
      }
      case actionTypes.SetStatuses: {
        const { data } = action.payload;
        return { ...state, statuses: data };
      }

      case actionTypes.GetUserById: {
        return { ...state, currentUser: { loading: true}}
      }
      case actionTypes.UserByIdFail: {
        return { ...state, currentUser: { loading: false}}
      }
      case actionTypes.UserByIdSuccess: {
        const { data } = action.payload
        return { ...state, currentUser: data }
      }
      default:
        return state;
    }
  }
);

export const actions = {
  createUser: () => ({ type: actionTypes.CreateUser }),
  editUserSuccess: data => ({ type: actionTypes.EditUser, payload: { data } }),
  setUsers: data => ({ type: actionTypes.SetUsers, payload: { data } }),
  setStatuses: data => ({ type: actionTypes.SetStatuses, payload: { data } }),
  deleteUserSuccess: id => ({ type: actionTypes.DeleteUser, payload: { id } }),

  getUserById: id => ({type: actionTypes.GetUserById, payload: {id}}),
  userByIdSuccess: data => ({type: actionTypes.UserByIdSuccess, payload: {data}}),
  UserByIdFail: () => ({type: actionTypes.UserByIdFail}),
};

function* getUserByIdSaga({payload:{id}}){
    try{
        const {data} = yield getUserById(id);
        console.log('---userData', data);
        
        if(data && data.data){
          yield put(actions.userByIdSuccess(data.data));
        }
    }catch{
        yield put(actions.UserByIdFail());
    }
}

export function* saga() {
  yield takeLatest(actionTypes.CreateUser, function* userRequested() {
    const { data } = yield getUsers({ page: 1 });
    yield put(actions.setUsers(data));
  });
  yield takeLatest(actionTypes.SetUsers, function* userStatuses() {
    const { data } = yield getStatuses();
    if (data && data.data) {
      yield put(actions.setStatuses(data.data));
    }
  });
  yield takeLatest(actionTypes.GetUserById, getUserByIdSaga);
}
