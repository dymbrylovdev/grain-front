import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { archivedBId } from "../../../../../crud/bids.crud";
import { getResponseMessage } from "../../../../../utils";

export const useArchivedBid: any = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const fetch = useCallback(
    async (id: number) => {
      setLoading(true);
      archivedBId(id)
        .then((res: any) => {
          setSuccess(true);
        })
        .catch(e => {
          enqueueSnackbar(`Ошибка: ${getResponseMessage(e)}`, { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
          setErr(null);
          setSuccess(false);
        });
    },
    [enqueueSnackbar]
  );

  return [fetch, loading, success];
};
