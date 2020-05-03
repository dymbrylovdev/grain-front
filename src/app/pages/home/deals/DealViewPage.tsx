import React, { useEffect } from "react";
import { compose } from "redux";
import { RouteComponentProps, Link } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  // TableFooter,
} from "@material-ui/core";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
// import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";

const DealViewPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ cropId: string; saleId: string; purchaseId: string }>> = ({
  match: {
    params: { cropId, saleId, purchaseId },
  },
  intl,
  page,
  perPage,
  total,
  fetch,
  deals,
  loading,
  error,

  deal,
  setDeal,

  crops,
  fetchCrops,
  cropsError,

  fetchDealsFilters,
  dealsFilters,
  filtersLoading,
  filtersError,

  fetchCropParams,
  cropParams,
  cropParamsError,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!!dealsFilters)
      fetch({ page, perPage, id: dealsFilters.find(item => item.crop.id === +cropId)?.id || 0 });
  }, [cropId, dealsFilters, fetch, page, perPage]);

  useEffect(() => {
    fetchCropParams(+cropId);
  }, [cropId, fetchCropParams]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    fetchDealsFilters();
  }, [fetchDealsFilters]);

  useEffect(() => {
    if (!!deals) {
      if (
        deals.find(item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId)
      ) {
        setDeal(
          deals.find(item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId)
        );
      } else {
        setDeal(undefined);
      }
    }
    return () => {
      setDeal(undefined);
    };
  }, [deals, purchaseId, saleId, setDeal]);

  if (error || filtersError || cropsError || cropParamsError) return <ErrorPage />;

  return (
    <Paper className={classes.tableContainer}>
      {!!crops && (
        <LayoutSubheader
          title={intl.formatMessage(
            { id: "DEALS.VIEW.TITLE" },
            { name: crops?.find(item => item.id === +cropId)?.name }
          )}
        />
      )}
      <div className={classes.tableTitle}>
        {!!deals &&
        !deals.find(item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId)
          ? intl.formatMessage({ id: "DEALS.EMPTY_DEAL" })
          : ""}
      </div>
      {!deals || !crops || !cropParams ? (
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
        !!deal && (
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell></TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.SALE" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.PURCHASE" />
                </TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cropParams.map(
                item =>
                  (deal.sale_bid.parameter_values.find(param => param.parameter_id === item.id) ||
                    deal.purchase_bid.parameter_values.find(
                      param => param.parameter_id === item.id
                    )) && (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {deal.sale_bid.parameter_values.find(
                          param => param.parameter_id === item.id
                        )?.value || "-"}
                      </TableCell>
                      <TableCell>
                        {deal.purchase_bid.parameter_values.find(
                          param => param.parameter_id === item.id
                        )?.value || "-"}
                      </TableCell>
                    </TableRow>
                  )
              )}
              <TableRow>
                <TableCell>{intl.formatMessage({ id: "DEALS.PRICE" })}</TableCell>
                <TableCell>{deal.sale_bid.price}</TableCell>
                <TableCell>{deal.purchase_bid.price}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {intl.formatMessage({ id: "DEALS.TABLE.PROFIT_WITHOUT_DELIVERY" })}
                </TableCell>
                <TableCell colSpan={2} align="center">
                  {deal.profit_without_delivery_price}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {intl.formatMessage({ id: "DEALS.TABLE.PROFIT_WITH_DELIVERY" })}
                </TableCell>
                <TableCell colSpan={2} align="center">
                  {deal.profit_with_delivery_price}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{intl.formatMessage({ id: "DEALS.TABLE.DISTANCE" })}</TableCell>
                <TableCell colSpan={2} align="center">
                  {deal.distance}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{intl.formatMessage({ id: "DEALS.TABLE.AGENT" })}</TableCell>
                <TableCell>
                  <Link to={`/user/view/${deal.sale_bid.vendor.id}`}>
                    {deal.sale_bid.vendor.fio || deal.sale_bid.vendor.login}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/user/view/${deal.purchase_bid.vendor.id}`}>
                    {deal.purchase_bid.vendor.fio || deal.purchase_bid.vendor.login}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Link to={`/bid/edit/${deal.sale_bid.id}/fromAdmin`}>
                    {intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/bid/edit/${deal.purchase_bid.id}/fromAdmin`}>
                    {intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
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
    deal: state.deals.deal,
    crops: state.crops2.crops,
    cropsError: state.crops2.error,
    cropParams: state.crops2.cropParams,
    cropParamsError: state.crops2.cropParamsError,

    dealsFilters: state.deals.filters,
    filtersLoading: state.deals.filtersLoading,
    filtersError: state.deals.filtersError,
  }),
  {
    fetch: dealsActions.fetchRequest,
    fetchCrops: crops2Actions.fetchRequest,
    fetchCropParams: crops2Actions.cropParamsRequest,
    setDeal: dealsActions.setDeal,
    fetchDealsFilters: dealsActions.fetchFiltersRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(DealViewPage);
