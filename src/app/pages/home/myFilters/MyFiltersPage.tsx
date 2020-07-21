import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory, RouteComponentProps } from "react-router-dom";
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

import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";

import { IAppState } from "../../../store/rootDuck";
import useStyles from "../styles";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import StatusIndicator from "../../../components/ui/Table/StatusIndicator";
import { ErrorPage } from "../../../components/ErrorPage";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../_metronic";

const MyFiltersPage: React.FC<TPropsFromRedux & WrappedComponentProps & RouteComponentProps> = ({
  match,
  intl,
  me,
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

  setCurrentSaleFilter,
  setCurrentPurchaseFilter,
  currentSaleFilters,
  currentPurchaseFilters,
}) => {
  const classes = useStyles();
  const history = useHistory();

  let salePurchaseMode: "sale" | "purchase" = "sale";
  if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";

  const [deleteFilterId, setDeleteFilterId] = useState(0);
  const [deleteFilterCropId, setDeleteFilterCropId] = useState(0);
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
      if (delSuccess) {
        if (salePurchaseMode === "sale") {
          // console.log("deleteFilterId: ", deleteFilterId);
          // console.log("currentFilter: ", currentSaleFilters[deleteFilterCropId]);
          if (
            !!deleteFilterId &&
            currentSaleFilters[deleteFilterCropId] &&
            currentSaleFilters[deleteFilterCropId].id === deleteFilterId
          ) {
            setCurrentSaleFilter(deleteFilterCropId, undefined);
          }
        }
        if (salePurchaseMode === "purchase") {
          // console.log("deleteFilterId: ", deleteFilterId);
          // console.log("currentFilter: ", currentPurchaseFilters[deleteFilterCropId]);
          if (
            !!deleteFilterId &&
            currentPurchaseFilters[deleteFilterCropId] &&
            currentPurchaseFilters[deleteFilterCropId].id === deleteFilterId
          ) {
            setCurrentPurchaseFilter(deleteFilterCropId, undefined);
          }
        }

        fetch(salePurchaseMode);
      }
    }
  }, [
    clearDel,
    currentPurchaseFilters,
    currentSaleFilters,
    delError,
    delSuccess,
    deleteFilterCropId,
    deleteFilterId,
    enqueueSnackbar,
    fetch,
    intl,
    me,
    salePurchaseMode,
    setCurrentPurchaseFilter,
    setCurrentSaleFilter,
  ]);

  useEffect(() => {
    fetch(salePurchaseMode);
  }, [fetch, me, salePurchaseMode]);

  if (error) return <ErrorPage />;

  return (
    <Paper className={classes.tableContainer}>
      <LayoutSubheader
        title={
          salePurchaseMode === "sale"
            ? intl.formatMessage({ id: "FILTERS.MY.SALE" })
            : intl.formatMessage({ id: "FILTERS.MY.PURCHASE" })
        }
      />
      <div className={classes.topButtonsContainer}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(`/${salePurchaseMode}/filters/edit/new`)}
          disabled={!myFilters}
        >
          {intl.formatMessage({ id: "FILTER.FORM.TABS.CREATE_FILTER" })}
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(`/${salePurchaseMode}/filters/prices`)}
          disabled={!myFilters}
        >
          {intl.formatMessage({ id: "FILTER.FORM.TABS.EDIT_PRICES" })}
        </Button>
      </div>
      {!myFilters ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
        </>
      ) : !myFilters.length ? (
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
                      onClick={() => history.push(`/${salePurchaseMode}/filters/view/${item.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/${salePurchaseMode}/filters/edit/${item.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="medium"
                      onClick={() => {
                        setDeleteFilterCropId(item.crop.id);
                        setDeleteFilterId(item.id || 0);
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
    me: state.auth.user,
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

    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,
  }),
  {
    fetch: myFiltersActions.fetchRequest,
    clearCreate: myFiltersActions.clearCreate,
    create: myFiltersActions.createRequest,
    clearDel: myFiltersActions.clearDel,
    del: myFiltersActions.delRequest,
    clearEdit: myFiltersActions.clearEdit,
    edit: myFiltersActions.editRequest,
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(MyFiltersPage);
