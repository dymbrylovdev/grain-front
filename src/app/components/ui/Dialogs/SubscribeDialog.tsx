import React from "react";
import { Dialog, DialogContent, Grid, IconButton, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ButtonWithLoader from "../Buttons/ButtonWithLoader";

export default function SubDialog({ handleClose, isOpen, children, handleSubmit }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"sm"} fullWidth>
      <div style={{padding: 10}}>
      <DialogTitle style={{ padding: 8 }}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item style={{ marginLeft: 16 }}>
            Подписать на объявления
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent style={{textAlign: 'right', marginBottom: 8, marginTop: 10, display: 'flex', justifyContent: 'space-around'}}>
        <div>{children}</div>
        <ButtonWithLoader onPress={handleSubmit}>
          Подписать
        </ButtonWithLoader>
      </DialogContent>
      </div>
    </Dialog>
  );
};