import React, { useEffect } from "react";
import { compose } from "redux";
import { RouteComponentProps, Link, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";
import { UserActivity, TrafficLight } from "../users/components";
import { accessByRoles, getConfirmCompanyString } from "../../../utils/utils";
import { thousands } from "./utils/utils";

const DealViewPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ cropId: string; saleId: string; purchaseId: string }>> = ({
  match: {
    params: { cropId, saleId, purchaseId },
  },
  intl,

  me,

  page,
  perPage,
  total,
  weeks,
  term,
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
  const history = useHistory();

  useEffect(() => {
    if (!!dealsFilters && !deals && !loading) fetch(page, perPage, weeks, !term ? 999 : +term);
  }, [deals, dealsFilters, fetch, loading, page, perPage, term, weeks]);

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
    <Paper className={classes.paperWithTable}>
      {!!crops && (
        <LayoutSubheader
          title={intl.formatMessage(
            { id: "DEALS.VIEW.TITLE" },
            { name: crops?.find(item => item.id === +cropId)?.name }
          )}
        />
      )}
      <div className={classes.topButtonsContainer}>
        <div className={classes.button}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => history.goBack()}
            disabled={!deals || !crops || !cropParams}
          >
            {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
          </Button>
        </div>
      </div>

      {!!deals &&
        !deals.find(
          item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId
        ) && (
          <div className={classes.tableTitle}>{intl.formatMessage({ id: "DEALS.EMPTY_DEAL" })}</div>
        )}
      {!deals || !crops || !cropParams ? (
        <>
          <Skeleton width={340} height={33} animation="wave" />
          <Skeleton width={340} height={33} animation="wave" />
          <Skeleton width={140} height={33} animation="wave" />
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={120} animation="wave" />
          <Skeleton width="100%" height={53} animation="wave" />
        </>
      ) : (
        !!deal && (
          <>
            {!deal.sale_bid.vendor.use_vat && deal.purchase_bid.vendor.use_vat && (
              <p>
                {intl.formatMessage(
                  { id: "DEALS.TABLE.ABOUT_VAT" },
                  { vat: deal.purchase_bid.vat }
                )}
              </p>
            )}
            <div className={classes.table}>
              <Table aria-label="simple table">
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
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.3)" }}>
                      <strong>
                        {intl.formatMessage({ id: "DEALS.TABLE.PROFIT_WITH_DELIVERY" })}
                      </strong>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "rgba(10, 187, 135, 0.5)" }}
                      colSpan={2}
                      align="center"
                    >
                      {thousands(Math.round(deal.profit_with_delivery_price).toString())}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.3)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.TABLE.COST" })}</strong>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "rgba(10, 187, 135, 0.5)" }}
                      colSpan={2}
                      align="center"
                    >
                      {thousands(
                        Math.round(
                          deal.purchase_bid.price *
                            (deal.purchase_bid.volume < deal.sale_bid.volume
                              ? deal.purchase_bid.volume
                              : deal.sale_bid.volume)
                        ).toString()
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.3)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.TABLE.TOTAL_PROFIT" })}</strong>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "rgba(10, 187, 135, 0.5)" }}
                      colSpan={2}
                      align="center"
                    >
                      {thousands(
                        Math.round(
                          deal.profit_with_delivery_price *
                            (deal.purchase_bid.volume < deal.sale_bid.volume
                              ? deal.purchase_bid.volume
                              : deal.sale_bid.volume)
                        ).toString()
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.UP_TABLE.DISTANCE" })}</strong>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}
                      colSpan={2}
                      align="center"
                    >
                      {thousands(Math.round(deal.distance).toString())}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "BIDSLIST.TABLE.PAYMENT_TERM" })}</strong>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}
                      colSpan={2}
                      align="center"
                    >
                      {deal.purchase_bid.payment_term || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.PRICE" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                      {thousands(deal.sale_bid.price.toString())}
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      {thousands(deal.purchase_bid.price.toString())}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.DEAL.VOLUME" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                      {deal.sale_bid.volume}
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      {deal.purchase_bid.volume}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>{intl.formatMessage({ id: "DEALS.DEAL.WORK_WITH_VAT" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#eeeeee" }}>
                      {deal.sale_bid.vendor.use_vat
                        ? `${intl.formatMessage({ id: "ALL.YES" })}, ${deal.sale_bid.vat}%`
                        : intl.formatMessage({ id: "ALL.NO" })}
                    </TableCell>
                    <TableCell>
                      {deal.purchase_bid.vendor.use_vat
                        ? `${intl.formatMessage({ id: "ALL.YES" })}, ${deal.purchase_bid.vat}%`
                        : intl.formatMessage({ id: "ALL.NO" })}
                    </TableCell>
                  </TableRow>

                  {cropParams.map(
                    item =>
                      (deal.sale_bid.parameter_values.find(
                        param => param.parameter_id === item.id
                      ) ||
                        deal.purchase_bid.parameter_values.find(
                          param => param.parameter_id === item.id
                        )) && (
                        <TableRow key={item.id}>
                          <TableCell>
                            <strong>{item.name}</strong>
                          </TableCell>
                          <TableCell style={{ backgroundColor: "#eeeeee" }}>
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
                    <TableCell>
                      <strong>{intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#eeeeee" }}>
                      {deal.sale_bid.location.text}
                    </TableCell>
                    <TableCell>{deal.purchase_bid.location.text}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>{intl.formatMessage({ id: "DEALS.DEAL.DATE" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#eeeeee" }}>
                      {`${deal.sale_bid.modified_at.slice(8, 10)}.${deal.sale_bid.modified_at.slice(
                        5,
                        7
                      )}.${deal.sale_bid.modified_at.slice(0, 4)}`}
                    </TableCell>
                    <TableCell>
                      {`${deal.purchase_bid.modified_at.slice(
                        8,
                        10
                      )}.${deal.purchase_bid.modified_at.slice(
                        5,
                        7
                      )}.${deal.purchase_bid.modified_at.slice(0, 4)}`}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>{intl.formatMessage({ id: "DEALS.TABLE.AGENT" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#eeeeee" }}>
                      <p>
                        <Link to={`/user/view/${deal.sale_bid.vendor.id}`}>
                          {deal.sale_bid.vendor.fio || deal.sale_bid.vendor.login}
                        </Link>
                      </p>
                      {!!deal?.sale_bid?.vendor?.phone && (
                        <p>тел.: +7 {deal.sale_bid.vendor.phone}</p>
                      )}
                      <UserActivity intl={intl} user={deal.sale_bid.vendor} />
                      <div className={classes.topMargin}>
                        {!!deal.sale_bid.vendor.company && (
                          <div>{deal.sale_bid.vendor.company.short_name}</div>
                        )}
                        <div className={`${classes.flexRow} ${classes.bottomMargin1}`}>
                          {!!deal?.sale_bid?.vendor?.company && (
                            <div className={classes.rightMargin1}>
                              {!deal?.sale_bid?.vendor?.company_confirmed_by_payment ? (
                                <ReportProblemIcon color="error" />
                              ) : (
                                <CheckCircleOutlineIcon color="secondary" />
                              )}
                            </div>
                          )}
                          <div>{getConfirmCompanyString(deal.sale_bid.vendor, intl)}</div>
                        </div>
                        {!!deal?.sale_bid?.vendor?.company?.colors &&
                          !!deal?.sale_bid?.vendor?.company_confirmed_by_payment && (
                            <TrafficLight
                              intl={intl}
                              colors={deal?.sale_bid?.vendor?.company?.colors}
                            />
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>
                        <Link to={`/user/view/${deal.purchase_bid.vendor.id}`}>
                          {deal.purchase_bid.vendor.fio || deal.purchase_bid.vendor.login}
                        </Link>
                      </p>
                      {!!deal?.purchase_bid?.vendor?.phone && (
                        <p>тел.: +7 {deal.purchase_bid.vendor.phone}</p>
                      )}
                      <UserActivity intl={intl} user={deal.purchase_bid.vendor} />

                      <div className={classes.topMargin}>
                        {!!deal.purchase_bid.vendor.company && (
                          <div>{deal.purchase_bid.vendor.company.short_name}</div>
                        )}
                        <div className={`${classes.flexRow} ${classes.bottomMargin1}`}>
                          {!!deal?.purchase_bid?.vendor?.company && (
                            <div className={classes.rightMargin1}>
                              {!deal?.purchase_bid?.vendor?.company_confirmed_by_payment ? (
                                <ReportProblemIcon color="error" />
                              ) : (
                                <CheckCircleOutlineIcon color="secondary" />
                              )}
                            </div>
                          )}
                          <div>{getConfirmCompanyString(deal.purchase_bid.vendor, intl)}</div>
                        </div>
                        {!!deal?.purchase_bid?.vendor?.company?.colors &&
                          !!deal?.purchase_bid?.vendor?.company_confirmed_by_payment && (
                            <TrafficLight
                              intl={intl}
                              colors={deal?.purchase_bid?.vendor?.company?.colors}
                            />
                          )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell style={{ backgroundColor: "#eeeeee" }}>
                        <Link to={`/bid/edit/sale/${deal.sale_bid.id}`}>
                          {intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/bid/edit/purchase/${deal.purchase_bid.id}`}>
                          {intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )
      )}
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,

    page: state.deals.page,
    perPage: state.deals.per_page,
    total: state.deals.total,
    weeks: state.deals.weeks,
    term: state.deals.term,

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
