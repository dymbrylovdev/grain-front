import React from "react";
import { makeStyles } from "@material-ui/styles";
import FilterForm from "./FilterForm";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

function FilterModal({ isOpen, handleClose, handleSubmit, cropId, enumParams, numberParams, classes }) {
  const innerClasses = useStyles();
  return (
      <div className={innerClasses.container}>
        <FilterForm classes={classes} handleSubmit={handleSubmit}  cropId={cropId} enumParams={enumParams} numberParams={numberParams} isOpen={isOpen} handleClose={handleClose}/>
      </div>

  );
}

export default FilterModal;
