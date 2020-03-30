import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import {
  Typography,
  makeStyles,
  createStyles,
  Link,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import Preloader from "../../../components/ui/Loaders/Preloader";
import { IAppState } from "../../../store/rootDuck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";

const useStyles = makeStyles(theme =>
  createStyles({
    empty: {
      marginBottom: 20,
      marginTop: 20,
    },
    buttons: {
      marginRight: theme.spacing(3),
    },
    card: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
    },
  })
);

const MyFiltersPage: React.FC<TPropsFromRedux> = ({ myFilters, fetch }) => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    fetch();
  }, [fetch]);

  console.log(myFilters);

  return <Preloader />;
};

const connector = connect(
  (state: IAppState) => ({
    myFilters: state.myFilters.myFilters,
  }),
  {
    fetch: myFiltersActions.fetchRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MyFiltersPage);
