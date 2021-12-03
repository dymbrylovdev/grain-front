import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { delPhoto } from "../../../../../crud/bids.crud";
import { getResponseMessage } from "../../../../../utils";
import { actions as bidsActions } from "../../../../../store/ducks/bids.duck";
import { IPointPriceForGet } from "../../../../../interfaces/bids";

export const useDelPhoto: any = (bidId: number, pointPrices: IPointPriceForGet[]) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const fetch = useCallback(
    async (payload: number) => {
      setLoading(true);
      delPhoto(payload)
        .then((res: any) => {
          setSuccess(true);
          enqueueSnackbar("Фотография удалена", { variant: "success" });
          dispatch(bidsActions.fetchByIdRequest(bidId, { filter: { point_prices: pointPrices } }));
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
    [dispatch, enqueueSnackbar, bidId, pointPrices]
  );

  return [fetch, loading, success];
};
