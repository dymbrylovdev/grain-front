import React, { useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { FormattedMessage, injectIntl } from "react-intl";
import { Link, useHistory } from "react-router-dom";
import { connect, useSelector, shallowEqual } from "react-redux";
import * as crops from "../../../store/ducks/crops.duck";
import * as builder from "../../../../_metronic/ducks/builder";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Errors";

function CropsListPage({ setMenuConfig, getCrops, match }) {
  const history = useHistory();

  const { crops, user, loading, errors } = useSelector(
    ({ crops: { crops, errors }, auth }) => ({
      crops: (crops && crops.data) || [],
      user: auth.user,
      loading: crops && crops.loading,
      errors: errors || {},
    }),
    shallowEqual
  );
  const classes = useStyles();

  const getCropsAction = useCallback(() => {
    getCrops(user);
  }, [getCrops, user]);

  useEffect(() => {
    getCropsAction();
  }, [getCropsAction]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    document.getElementById("kt_aside_close_btn")?.click();
  });

  if (loading) return <Preloader />;

  if (errors.crops) return <LoadError handleClick={() => getCropsAction()} />;
  return (
    <Paper className={classes.tableContainer}>
      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" onClick={() => history.push("/crop/create")}>
          <FormattedMessage id="CROPSLIST.BUTTON.CREATE" />
        </Button>
      </div>
      <Table aria-label="simple table" className={classes.table}>
        <TableHead>
          <TableRow>
            <TopTableCell>
              <FormattedMessage id="CROPSLIST.TABLE.ID" />
            </TopTableCell>
            <TopTableCell>
              <FormattedMessage id="CROPSLIST.TABLE.NAME" />
            </TopTableCell>
            <TopTableCell>
              <FormattedMessage id="CROPSLIST.TABLE.ACTIONS" />
            </TopTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crops &&
            crops.map(crop => (
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
