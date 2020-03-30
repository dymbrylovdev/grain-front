import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { makeStyles, Card, Switch, TextField, FormControlLabel, Button } from "@material-ui/core";
import { Formik } from "formik";
import Preloader from "../../../components/ui/Loaders/Preloader";
import * as Yup from "yup";

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: theme.spacing(3),
  },
  actions: {
    marginTop: theme.spacing(3),
  },
  buttons: {
    marginRight: theme.spacing(2),
  },
  switch: {
    marginLeft: theme.spacing(1),
  },
}));

const MyFiltersEditPage: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  return <Preloader />;
};

export default MyFiltersEditPage;
