import { useEffect } from "react";
import { useSnackbar } from "notistack";

export const useShowErrors = (possibleErrors: Array<null | any>) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const trueErrors = possibleErrors.filter(el => !!el);
    for (const trueError of trueErrors) {
      const text = trueError?.response?.data?.message || String(trueError);
      enqueueSnackbar(text, { variant: "error" });
    }
  }, [enqueueSnackbar, ...possibleErrors]);
};
