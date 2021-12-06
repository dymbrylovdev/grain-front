import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { editPhotoBid } from "../../../../../crud/bids.crud";
import { IPointPriceForGet } from "../../../../../interfaces/bids";
import { actions as bidsActions } from "../../../../../store/ducks/bids.duck";
import { getResponseMessage } from "../../../../../utils";

export const useLoadPhotos: any = (bidId: number, pointPrices: IPointPriceForGet[]) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const fetchEditCompany = useCallback(
    async (payload: { id: number; data: FormData }) => {
      setLoading(true);
      editPhotoBid(payload.id, payload.data, true)
        .then(res => {
          dispatch(bidsActions.fetchByIdRequest(bidId, { filter: { point_prices: pointPrices } }));
          setSuccess(true);
          enqueueSnackbar("Фотографии успешно загружены", { variant: "success" });
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

  return [fetchEditCompany, loading, success];
};
