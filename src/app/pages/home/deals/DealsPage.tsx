import React, { useEffect } from "react";
import { compose } from "redux";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useSnackbar } from "notistack";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";

const DealsPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ cropId: string }>> = ({
  match: {
    params: { cropId },
  },
  intl,
  page,
  perPage,
  total,
  fetch,
  deals,
  loading,
  error,

  crops,
  fetchCrops,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEdit();
    }
    if (editSuccess) {
      fetch({ page, perPage, id: +cropId });
    }
  }, [clearEdit, cropId, editError, editSuccess, enqueueSnackbar, fetch, intl, page, perPage]);

  useEffect(() => {
    fetch({ page, perPage, id: +cropId });
  }, [cropId, fetch, page, perPage]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  if (error) return <ErrorPage />;

  return (
    <Paper className={classes.tableContainer}>
      {!!crops && (
        <LayoutSubheader
          title={intl.formatMessage(
            { id: "DEALS.TITLE" },
            { name: crops.find(item => item.id === +cropId)?.name }
          )}
        />
      )}
      <div className={classes.tableTitle}>
        {!!deals && !deals?.length
          ? intl.formatMessage(
              { id: "DEALS.EMPTY" },
              { name: crops?.find(item => item.id === +cropId)?.name }
            )
          : ""}
      </div>
      {!deals || !crops ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={53} animation="wave" />
        </>
      ) : (
        !!deals.length && (
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.SALE" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.PURCHASE" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.PROFIT" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.DISTANCE" />
                </TopTableCell>
                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals &&
                deals.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className={classes.flexColumn}>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}
                          {item.sale_bid.volume}
                        </div>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}
                          {item.sale_bid.price}
                        </div>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.LOCATION" })}
                          {item.sale_bid.location.text}
                        </div>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.SELLER" })}
                          {item.sale_bid.vendor.company.short_name ||
                            item.sale_bid.vendor.fio ||
                            item.sale_bid.vendor.login}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.flexColumn}>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}
                          {item.purchase_bid.volume}
                        </div>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}
                          {item.purchase_bid.price}
                        </div>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.LOCATION" })}
                          {item.purchase_bid.location.text}
                        </div>
                        <div>
                          {intl.formatMessage({ id: "DEALS.TABLE.BUYER" })}
                          {item.purchase_bid.author.company.short_name ||
                            item.purchase_bid.author.fio ||
                            item.purchase_bid.author.login}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{Math.round(item.profit_with_delivery_price)}</TableCell>
                    <TableCell>{item.distance}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() =>
                          history.push(
                            `/deals/view/${cropId}/${item.sale_bid.id}/${item.purchase_bid.id}`
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePaginator
                  id={+cropId}
                  page={page}
                  realPerPage={deals.length}
                  perPage={perPage}
                  total={total}
                  fetchRows={fetch}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )
      )}
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    page: state.deals.page,
    perPage: state.deals.per_page,
    total: state.deals.total,
    deals: state.deals.deals,
    loading: state.deals.loading,
    error: state.deals.error,

    crops: state.crops2.crops,

    editLoading: state.deals.editLoading,
    editSuccess: state.deals.editSuccess,
    editError: state.deals.editError,
  }),
  {
    fetch: dealsActions.fetchRequest,
    fetchCrops: crops2Actions.fetchRequest,
    clearEdit: dealsActions.clearEdit,
    edit: dealsActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(DealsPage);
