import React from "react";
import { Dialog, DialogContent, Grid, IconButton, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { PricesEdit } from "../../../myFilters/components";

function PricesDialog({ handleClose, isOpen, intl }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"md"} fullWidth>
      <DialogTitle>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            {intl.formatMessage({
              id: "LOCATIONS.PRICES.MODAL_NAME",
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
        <PricesEdit />
      </DialogContent>
    </Dialog>
  );
}

export default PricesDialog;
