import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { FormattedMessage, injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { connect, useSelector, shallowEqual } from "react-redux";
import * as crops from "../../../store/ducks/crops.duck";
import * as builder from "../../../../_metronic/ducks/builder";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Erros";


function CropsListPage({ setMenuConfig, getCrops, match }) {
  const { crops, user, loading, errors } = useSelector(
    ({ crops: {crops, errors}, auth }) => ({
      crops: (crops && crops.data) || [],
      user: auth.user,
      loading: crops && crops.loading,
      errors: errors || {}
    }),
    shallowEqual
  );
  const classes = useStyles();

  const getCropsAction = () => {
    getCrops(user);
  };
  useEffect(() => {
    getCropsAction();
  }, []);
  if (loading) return <Preloader />;
  if (errors.crops) return <LoadError handleClick={() => getCropsAction()} />;
  return (
    <Paper className={classes.tableContainer}>
      <div className={classes.buttonContainer}>
        <Link to="/crop/create">
          <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
            <FormattedMessage id="CROPSLIST.BUTTON.CREATE" />
          </button>
        </Link>
      </div>
      <Table aria-label="simple table" className={classes.table}>
        <TableHead>
          <TableRow>
            <TopTableCell>
              <FormattedMessage id="CROPSLIST.TABLE.ID" />
            </TopTableCell>
            <TopTableCell>
              <FormattedMessage id="CROPSLIST.TABLE.ID" />
            </TopTableCell>
            <TopTableCell>
              <FormattedMessage id="CROPSLIST.TABLE.ACTIONS" />
            </TopTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crops && crops.map(crop => (
            <TableRow key={crop.id}>
              <TableCell>{crop.id}</TableCell>
              <TableCell>{crop.name}</TableCell>
              <TableCell>
                <Link to={`/crop/edit/${crop.id}`}>
                  <IconButton size="medium" color="primary">
                    <EditIcon />
                  </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default injectIntl(connect(null, { ...builder.actions, ...crops.actions })(CropsListPage));
