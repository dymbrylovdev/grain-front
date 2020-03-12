import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";

import CompanyTable from "./CompanyTable";

function CompanySearchDialog({ title, isOpen, handleClose, chooseAction, companies, classes }) {
  return (
    <Dialog maxWidth={"sm"} fullWidth open={isOpen} onClose={handleClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <CompanyTable companies={companies} chooseAction={chooseAction} classes={classes} forSearch />
      </DialogContent>
    </Dialog>
  );
}

export default CompanySearchDialog;
