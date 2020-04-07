import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  TextField,
  Theme,
  IconButton,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

import useStyles from "../../styles";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import { ILocationToRequest, ILocation } from "../../../../interfaces/locations";
import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { actions as googleLocationsActions } from "../../../../store/ducks/yaLocations.duck";
import { actions as locationsActions } from "../../../../store/ducks/locations.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { IAppState } from "../../../../store/rootDuck";
import Preloader from "../../../../components/ui/Loaders/Preloader";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { Skeleton } from "@material-ui/lab";

const innerStyles = makeStyles((theme: Theme) => ({
  container: {
    flexDirection: "row",
    display: "flex",
  },
  group: {
    marginBottom: theme.spacing(2),
    minHeight: 200,
    padding: theme.spacing(2),
    border: "1px solid",
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
}));

interface IProps {
  count: number;
  intl: any;
}

const LocationsSkeleton: React.FC<IProps> = ({ intl, count }) => {
  const innerClasses = innerStyles();
  const classes = useStyles();

  let locs: any[] = [];
  if (count) {
    for (let i = 0; i < count; i++) locs.push(i);
  } else {
    for (let i = 0; i < 1; i++) locs.push(i);
  }

  return (
    <div>
      {locs.map((item, i) => (
        <Grid
          container
          direction="column"
          justify="space-around"
          alignItems="stretch"
          key={i}
          className={innerClasses.group}
        >
          <Grid item>
            <Skeleton width="50%" height={45} animation="wave" />
          </Grid>
          <Grid item>
            <Skeleton height={80} animation="wave" />
          </Grid>
          <Grid item>
            <Skeleton width={130} height={35} animation="wave" />
          </Grid>
        </Grid>
      ))}
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={1}
        className={classes.buttonContainer}
      >
        <Grid item>
          <Button variant="contained" color="primary" disabled={true} onClick={() => {}}>
            {intl.formatMessage({ id: "LOCATIONS.FORM.ADD_LOCATIONS" })}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default LocationsSkeleton;
