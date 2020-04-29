import React from "react";
import { Dialog, DialogContent, Grid, IconButton, DialogTitle } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { CompanyConfirmPage } from "../../companies";

interface IProps {
  id: number;
  intl: any;
  isOpen: boolean;
  handleClose: () => void;
}

const CompanyConfirmDialog: React.FC<IProps> = ({ id, handleClose, isOpen, intl }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth={"sm"} fullWidth>
      <DialogTitle>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            {intl.formatMessage({
              id: "COMPANY.CONFIRM.MAIN.TITLE",
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
        <CompanyConfirmPage companyId={id} />
      </DialogContent>
    </Dialog>
  );
};

export default CompanyConfirmDialog;
