import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, LinearProgress } from "@material-ui/core";

export default function AlertDialog({ isOpen, handleClose, handleAgree, text, okText, cancelText, loadingText = "", isLoading = false }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogContent>
        {isLoading ? (
          <>
            <DialogContentText id="alert-dialog-description" style={{ textAlign: "center" }}>
              {loadingText}
            </DialogContentText>
            <LinearProgress color="primary" style={{ minWidth: 200, marginBottom: 12 }} />
          </>
        ) : (
          <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
        )}
      </DialogContent>
      {!isLoading && (
        <DialogActions>
          <Button onClick={handleAgree} color="primary">
            {okText}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            {cancelText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
