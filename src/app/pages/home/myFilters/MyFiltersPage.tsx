import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useSnackbar } from "notistack";

import Preloader from "../../../components/ui/Loaders/Preloader";
import { IAppState } from "../../../store/rootDuck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import StatusIndicator from "../../../components/ui/Table/StatusIndicator";
import { LoadError } from "../../../components/ui/Errors";

const MyFiltersPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  fetch,
  myFilters,
  loading,
  error,
  clearCreate,
  create,
  createLoading,
  createSuccess,
  createError,
  clearDel,
  del,
  delLoading,
  delSuccess,
  delError,
  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [deleteFilterId, setDeleteFilterId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.DEL_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      setAlertOpen(false);
      clearDel();
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, intl]);

  useEffect(() => {
    if (!myFilters && !loading) {
      fetch();
    }
  }, [del, fetch, loading, myFilters]);

  if (error) return <LoadError handleClick={() => fetch()} />;

  if (!myFilters) return <Preloader />;

  return (
    <Paper className={classes.tableContainer}>
      <div className={classes.topButtonsContainer}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push("/user/filters/edit/new")}
        >
          {intl.formatMessage({ id: "FILTER.FORM.TABS.CREATE_FILTER" })}
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push("/user/filters/prices")}
        >
          {intl.formatMessage({ id: "FILTER.FORM.TABS.EDIT_PRICES" })}
        </Button>
      </div>
      {!myFilters.length ? (
        <div>
          <FormattedMessage id="FILTERS.TABLE.EMPTY" />
        </div>
      ) : (
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TopTableCell>
                <FormattedMessage id="FILTERS.TABLE.HEADER.CROP" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="FILTERS.TABLE.HEADER.NAME" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="FILTERS.TABLE.HEADER.SUBSCRIPTION" />
              </TopTableCell>
              <TopTableCell align="right"></TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myFilters
              .sort((a, b) => a.crop.id - b.crop.id)
              .map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.crop.name}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <StatusIndicator isActive={item.subscribed} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/user/filters/view/${item.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/user/filters/edit/${item.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={() => {
                        setDeleteFilterId(item.id);
                        setAlertOpen(true);
                      }}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "FILTER.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "FILTER.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "FILTER.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => {
          del(deleteFilterId);
        }}
        loadingText={intl.formatMessage({
          id: "FILTER.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    myFilters: state.myFilters.myFilters,
    loading: state.myFilters.loading,
    error: state.myFilters.error,
    createLoading: state.myFilters.createLoading,
    createSuccess: state.myFilters.createSuccess,
    createError: state.myFilters.createError,
    delLoading: state.myFilters.delLoading,
    delSuccess: state.myFilters.delSuccess,
    delError: state.myFilters.delError,
    editLoading: state.myFilters.editLoading,
    editSuccess: state.myFilters.editSuccess,
    editError: state.myFilters.editError,
  }),
  {
    fetch: myFiltersActions.fetchRequest,
    clearCreate: myFiltersActions.clearCreate,
    create: myFiltersActions.createRequest,
    clearDel: myFiltersActions.clearDel,
    del: myFiltersActions.delRequest,
    clearEdit: myFiltersActions.clearEdit,
    edit: myFiltersActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(MyFiltersPage);
