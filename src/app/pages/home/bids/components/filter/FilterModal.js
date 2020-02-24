import React from "react";
import { Dialog } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FilterForm from "./FilterForm";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

function FilterModal({ isOpen, handleClose, handleSubmit, filter, enumParams, numberParams, classes }) {
  const innerClasses = useStyles();
  return (
      <div className={innerClasses.container}>
        <FilterForm classes={classes} handleSubmit={handleSubmit} filter={filter} enumParams={enumParams} numberParams={numberParams} isOpen={isOpen} handleClose={handleClose}/>
      </div>

  );
}

export default FilterModal;
