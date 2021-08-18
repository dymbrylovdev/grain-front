import { useMemo } from "react";
import { IUser, TRole } from "../interfaces/users";

export const useDefineUserRole = (me: IUser | undefined, role: TRole) => {
  return useMemo(() => {
    if (!me) return null;
    if (me.roles.includes(role)) {
      return true;
    }
    return false;
  }, [me, role]);
};
