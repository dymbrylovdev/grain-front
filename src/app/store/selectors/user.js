import { useSelector, shallowEqual } from "react-redux";

function UserSelector(id) {
  const user = useSelector(({ users: { users } }) => {
    const myUser = users.filter(item => item.id === Number.parseInt(id));
    if (myUser.length > 0) {
      return myUser[0];
    }
    return {user: {}};
  }, shallowEqual);
  return {user};
}


export default UserSelector;