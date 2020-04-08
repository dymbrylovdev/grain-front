import React from "react";
import { Theme, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import useStyles from "../../styles";
import { Skeleton } from "@material-ui/lab";

const innerStyles = makeStyles((theme: Theme) => ({
  container: {
    flexDirection: "row",
    display: "flex",
  },
  group: {
    marginBottom: theme.spacing(2),
    minHeight: 160,
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
