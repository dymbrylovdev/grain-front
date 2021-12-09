import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { delCropPhoto } from "../../../../crud/crops.crud";
import { actions as cropsActions } from "../../../../store/ducks/crops.duck";
import { getResponseMessage } from "../../../../utils";

export const useDelCropPhoto: any = (user: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const fetch = useCallback(
    async (payload: number) => {
      setLoading(true);
      delCropPhoto(payload)
        .then((res: any) => {
          setSuccess(true);
          enqueueSnackbar("Фотография удалена", { variant: "success" });
          dispatch(cropsActions.getCrops(user));
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
    [dispatch, enqueueSnackbar, user]
  );

  return [fetch, loading, success];
};
