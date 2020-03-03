import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@material-ui/core';
import { FormattedMessage } from "react-intl";


export default function ErrorDialog({isOpen, handleClose, text, okText }){
    return(
        <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle> <FormattedMessage id="ERROR.DIALOG.TITLE" default="Ошибка"/> </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {okText}
          </Button>
        </DialogActions>
      </Dialog>
    )
}
