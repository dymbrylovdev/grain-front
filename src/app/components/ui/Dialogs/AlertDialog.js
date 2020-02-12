import React from 'react';
import { Button, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';


export default function AlertDialog({isOpen, handleClose, handleAgree, text, okText, cancelText}){
    return(
        <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgree} color="primary">
            {okText}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            {cancelText}
          </Button>
        </DialogActions>
      </Dialog>
    )
}