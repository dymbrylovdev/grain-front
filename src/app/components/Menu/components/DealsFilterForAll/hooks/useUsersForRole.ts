import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { getResponseMessage } from "../../../../../utils";
import { IUser } from "../../../../../interfaces/users";
import { getUsers } from "../../../../../crud/users.crud";

export const useUsersForRole: any = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const fetch = useCallback(
    async (page: number, perPage: number, role: string) => {
      setLoading(true);
      getUsers(page, perPage, undefined, undefined, role)
        .then((res: any) => {
          setUsers(res.data.data);
        })
        .catch(e => {
          enqueueSnackbar(`Ошибка: ${getResponseMessage(e)}`, { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [enqueueSnackbar]
  );

  return [fetch, loading, users];
};
