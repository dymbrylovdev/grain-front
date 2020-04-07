import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { LocationsForm } from "../../../users/components";

function LocationDialog({ handleClose, isOpen, user, classes, submitAction }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"md"} fullWidth>
      <DialogContent>
        <LocationsForm editMode="profile" />
      </DialogContent>
    </Dialog>
  );
}

export default LocationDialog;
