import React from "react";
import { Dialog, DialogContent, Grid, IconButton, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { LocationsForm } from "../../../users/components";

function LocationDialog({ handleClose, isOpen, user, classes, intl }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"md"} fullWidth>
      <DialogTitle style={{ padding: 8 }}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item style={{ marginLeft: 16 }}>
            {intl.formatMessage({
              id: "LOCATIONS.MODAL_NAME",
            })}
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <LocationsForm editMode="profile" />
      </DialogContent>
    </Dialog>
  );
}

export default LocationDialog;
