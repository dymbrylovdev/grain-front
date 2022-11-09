import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";

interface IProps {
  isOpen: boolean;
  text: string;
  okText?: string;
  handleClose: () => {} | void;
}

const ErrorDialog: React.FC<IProps & WrappedComponentProps> = ({ intl, isOpen, handleClose, text, okText = "OK" }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle>{intl.formatMessage({ id: "ERROR.DIALOG.TITLE" })}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default injectIntl(ErrorDialog);
