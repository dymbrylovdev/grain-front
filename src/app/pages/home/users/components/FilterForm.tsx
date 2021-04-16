import React, { ReactElement, useEffect, useState } from "react";
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

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";
import { actions as userActions } from "../../../../store/ducks/users.duck";

import { IAppState } from "../../../../store/rootDuck";
import useStyles from "../../styles";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import StatusIndicator from "../../../../components/ui/Table/StatusIndicator";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../../_metronic";
import { declOfNum } from "../../../../utils";
import { accessByRoles } from "../../../../utils/utils";

interface IFilterForm {
  match: any;
  userId: number | undefined;
}

const FilterForm: React.FC<IFilterForm & TPropsFromRedux & WrappedComponentProps> = ({
  match,
  intl,
  fetchMe,
  me,
  meError,
  userId,
  filterCount,
  loading,
  error,
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

  setTariffTable,

  userBidFilters,
  userBidFiltersLoading,
  userBidFiltersSuccess,
  userBidFiltersError,
  clearUserBidFilters,
  fetchUserBidFilters,
}): ReactElement => {
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
          if (
            !!deleteFilterId &&
            currentSaleFilters[deleteFilterCropId] &&
            currentSaleFilters[deleteFilterCropId].id === deleteFilterId
          ) {
            setCurrentSaleFilter(deleteFilterCropId, undefined);
          }
        }
        if (salePurchaseMode === "purchase") {
          if (
            !!deleteFilterId &&
            currentPurchaseFilters[deleteFilterCropId] &&
            currentPurchaseFilters[deleteFilterCropId].id === deleteFilterId
          ) {
            setCurrentPurchaseFilter(deleteFilterCropId, undefined);
          }
        }

        if (userId) fetchUserBidFilters({ id: +userId, type: salePurchaseMode })
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
    intl,
    me,
    salePurchaseMode,
    setCurrentPurchaseFilter,
    setCurrentSaleFilter,
    fetchUserBidFilters,
    userId
  ]);

  useEffect(() => {
    if (userId) fetchUserBidFilters({ id: +userId, type: salePurchaseMode })
  }, [fetchUserBidFilters, userId, salePurchaseMode]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (error || meError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithTable}>
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
          disabled={
            !userBidFilters ||
            (!!me?.tariff_matrix.tariff_limits.max_filters_count &&
              !!userBidFilters &&
              me.tariff_matrix.tariff_limits.max_filters_count - userBidFilters?.filters?.length <= 0)
          }
        >
          {intl.formatMessage({ id: "FILTER.FORM.TABS.CREATE_FILTER" })}
        </Button>

        {accessByRoles(me, ["ROLE_BUYER", "ROLE_VENDOR", "ROLE_TRADER"]) &&
          me &&
          me.tariff_matrix.tariff.name === "Бесплатный" && (
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={() => {
                setTariffTable(1);
                history.push(`/user/profile/tariffs`);
              }}
              disabled={!userBidFilters?.filters}
            >
              {intl.formatMessage({ id: "BID.PRICES.GET.PREMIUM" })}
            </Button>
          )}

        {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) && (
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => history.push(`/${salePurchaseMode}/filters/prices`)}
            disabled={!userBidFilters?.filters}
          >
            {intl.formatMessage({ id: "BID.PRICES.BUTTON" })}
          </Button>
        )}
      </div>
      {!userBidFilters?.filters ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
        </>
      ) : (
        <>
          {!!me && !!userBidFilters?.filters && (
            <div className={classes.bottomMargin1} style={{ fontWeight: "bold" }}>
              {intl.formatMessage(
                { id: "FILTER.FORM.LIMIT" },
                {
                  count:
                    !me?.tariff_matrix ||
                    (!!me?.tariff_matrix && me.tariff_matrix.tariff_limits.max_filters_count - filterCount <= 0)
                      ? "0"
                      : me?.tariff_matrix?.tariff_limits.max_filters_count - filterCount,
                  word: declOfNum(me?.tariff_matrix?.tariff_limits.max_filters_count - filterCount, [
                    "подписка",
                    "подписки",
                    "подписок",
                  ]),
                  fullCount: me?.tariff_matrix?.tariff_limits.max_filters_count,
                }
              )}
            </div>
          )}
          {userBidFilters?.filters.length > 0 && (
            <div className={classes.table}>
              <Table aria-label="simple table">
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
                    <TopTableCell>
                      <FormattedMessage id="FILTERS.TABLE.HEADER.SMS.SENDING" />
                    </TopTableCell>
                    <TopTableCell align="right"></TopTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userBidFilters?.filters
                    .sort((a, b) => a.crop.id - b.crop.id)
                    .map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.crop.name}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <StatusIndicator isActive={item.subscribed} />
                        </TableCell>
                        <TableCell>
                          <StatusIndicator isActive={item.is_sending_sms} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={() =>
                              history.push(`/${salePurchaseMode}/user/${userId ? +userId : null}/filters/view/${item.id}`)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={() =>
                              history.push(`/${salePurchaseMode}/user/${userId ? +userId : null}/filters/edit/${item.id}`)
                            }
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
            </div>
          )}
        </>
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
    meError: state.auth.error,
    myFilters: state.myFilters.myFilters,
    filterCount: state.myFilters.filterCount,
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

    userBidFilters: state.users.userBidFilters,
    userBidFiltersLoading: state.users.userBidFiltersLoading,
    userBidFiltersSuccess: state.users.userBidFiltersSuccess,
    userBidFiltersError: state.users.userBidFiltersError,
  }),
  {
    fetch: myFiltersActions.fetchRequest,
    fetchMe: authActions.fetchRequest,
    clearCreate: myFiltersActions.clearCreate,
    create: myFiltersActions.createRequest,
    clearDel: myFiltersActions.clearDel,
    del: myFiltersActions.delRequest,
    clearEdit: myFiltersActions.clearEdit,
    edit: myFiltersActions.editRequest,
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,
    setTariffTable: tariffsActions.setTariffTable,
    clearUserBidFilters: userActions.clearUserBidFilters,
    fetchUserBidFilters: userActions.userBidFiltersRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(FilterForm));
