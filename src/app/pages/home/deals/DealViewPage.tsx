import React, { useEffect } from "react";
import { compose } from "redux";
import { useHistory, RouteComponentProps, Link } from "react-router-dom";
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
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
}) => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    fetch(+cropId);
  }, [cropId, fetch]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

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

  if (error) return <ErrorPage />;

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
        deal && (
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
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TablePaginator
                page={page}
                realPerPage={deals.length}
                perPage={perPage}
                total={total}
                fetchRows={fetch}
              />
            </TableRow>
          </TableFooter> */}
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
  }),
  {
    fetch: dealsActions.fetchRequest,
    fetchCrops: crops2Actions.fetchRequest,
    setDeal: dealsActions.setDeal,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(DealViewPage);
