import React from "react";
import { Dialog } from "@material-ui/core";
import LocationForm from "./LocationForm";

function LocationDialog({ handleClose, isOpen, user, classes, submitAction }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"sm"} fullWidth>
      <LocationForm user={user} classes={classes} submitAction={submitAction} />
    </Dialog>
  );
}

export default LocationDialog;
