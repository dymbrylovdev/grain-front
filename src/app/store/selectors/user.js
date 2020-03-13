import { useSelector, shallowEqual } from "react-redux";

function UserSelector(id) {
  const user = useSelector(({ users: { users } }) => {
    if(!id){
      return {user: {}};
    }
    const myUser = users && users.filter(item => item.id === Number.parseInt(id));
    if (myUser && myUser.length > 0) {
      return myUser[0];
    }
    return {user: {}};
  }, shallowEqual);
  return {user};
}


export default UserSelector;