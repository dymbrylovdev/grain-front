import React from "react";
import { Dialog, DialogContent, Grid, IconButton, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { PricesEdit } from "../../../myFilters/components";

function PricesDialog({ handleClose, isOpen, intl, cropId }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"sm"} fullWidth>
      <DialogTitle style={{ padding: 8 }}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item style={{ marginLeft: 16 }}>
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
        <PricesEdit cropId={cropId} />
      </DialogContent>
    </Dialog>
  );
}

export default PricesDialog;
