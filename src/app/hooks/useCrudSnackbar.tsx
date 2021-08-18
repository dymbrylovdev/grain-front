import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

interface IProps {
  successMessage: string;
  errorMessage: string;
  success: boolean;
  error: string | null;
  clear?: () => void;
  afterSuccess?: () => void;
  afterSuccessOrError?: () => void;
}

const useCrudSnackbar = ({
  success,
  error,
  clear,
  successMessage,
  errorMessage,
  afterSuccess,
  afterSuccessOrError,
}: IProps) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (success || error) {
      enqueueSnackbar(success ? successMessage : errorMessage, {
        variant: success ? 'success' : 'error',
      });

      if (afterSuccessOrError) afterSuccessOrError();
    }

    if (success && afterSuccess) afterSuccess();
  }, [success, error, successMessage, errorMessage]); // eslint-disable-line

  useEffect(
    () => () => {
      if (clear) clear();
    },
    []
  ); // eslint-disable-line

  return {};
};

export default useCrudSnackbar;
