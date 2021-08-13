import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IUser, TRole } from "../interfaces/users";

export const useForbidAccess = (me: IUser | undefined, roles: TRole[]) => {
  const history = useHistory();

  useEffect(() => {
    if (!me) return;
    let isForbidden = false;
    for (const role of roles) {
      if (me.roles.includes(role)) {
        isForbidden = true;
        break;
      }
    }
    if (isForbidden) {
      history.replace("/error/error-v1");
    }
  }, [me, roles, history]);
};
