import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useSnackbar } from "notistack";

import { actions as agreementActions } from "../../../store/ducks/agreement.duck";

import { IAppState } from "../../../store/rootDuck";

const agreementStyle = {
  color: "black",
};

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
}

const TermDialog: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  isOpen,
  handleClose,
  intl,

  fetchAgreement,
  agreement,
  fetchAgreementLoading,
  fetchAgreementSuccess,
  fetchAgreementError,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (fetchAgreementError) {
      enqueueSnackbar(fetchAgreementError, {
        variant: "error",
      });
    }
  }, [enqueueSnackbar, fetchAgreementError]);

  useEffect(() => {
    fetchAgreement();
  }, [fetchAgreement]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {intl.formatMessage({ id: "AUTH.GENERAL.LEGAL" })}
      </DialogTitle>
      <DialogContent>
        {agreement ? (
          <div dangerouslySetInnerHTML={{ __html: agreement.text }} style={agreementStyle} />
        ) : (
          <>{intl.formatMessage({ id: "AUTH.TERM.LOADING" })}</>
        )}
      </DialogContent>
    </Dialog>
  );
};

const connector = connect(
  (state: IAppState) => ({
    regLoading: state.auth.regLoading,
    regSuccess: state.auth.regSuccess,
    regError: state.auth.regError,

    agreement: state.agreement.agreement,
    fetchAgreementLoading: state.agreement.loading,
    fetchAgreementSuccess: state.agreement.success,
    fetchAgreementError: state.agreement.error,
  }),
  {
    fetchAgreement: agreementActions.fetchRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(TermDialog));
