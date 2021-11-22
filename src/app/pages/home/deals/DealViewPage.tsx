import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { RouteComponentProps, Link, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, IconButton } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";
import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Alert, Skeleton } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
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
  min_prepayment_amount,
  fetch,
  deals,
  loading,
  error,

  deal,
  setDeal,

  crops,
  fetchCrops,
  cropsError,

  fetchMe,
  fetchDealsFilters,
  dealsFilters,
  filtersLoading,
  filtersError,
  editContactViewCount,

  fetchCropParams,
  cropParams,
  cropParamsError,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [isAlertOpen, setAlertOpen] = useState(false);

  const linkToContact = (dealType: "sale" | "purchase") => {
    if (deal && me) {
      let contactViewCount = me.contact_view_count;
      //@ts-ignore
      if (contactViewCount > 1 || ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0])) {
        history.push(
          me && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me?.roles[0])
            ? dealType === "sale"
              ? `/user/edit/${deal.sale_bid.vendor.id}`
              : `/user/edit/${deal.purchase_bid.vendor.id}`
            : dealType === "sale"
            ? `/user/view/${deal.sale_bid.vendor.id}`
            : `/user/view/${deal.purchase_bid.vendor.id}`
        );
        //@ts-ignore
        editContactViewCount({ data: { contact_view_count: contactViewCount - 2 } });
      } else {
        setAlertOpen(!isAlertOpen);
        setTimeout(() => {
          setAlertOpen(false);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (!!dealsFilters && !deals && !loading)
      fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined);
  }, [deals, dealsFilters, fetch, loading, page, perPage, term, weeks, min_prepayment_amount]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

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
      if (deals.find(item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId)) {
        setDeal(deals.find(item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId));
      } else {
        setDeal(undefined);
      }
    }
    return () => {
      setDeal(undefined);
    };
  }, [deals, purchaseId, saleId, setDeal]);

  if (error || filtersError || cropsError || cropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithTable}>
      {!!crops && (
        <LayoutSubheader title={intl.formatMessage({ id: "DEALS.VIEW.TITLE" }, { name: crops?.find(item => item.id === +cropId)?.name })} />
      )}
      <div className={classes.topButtonsContainer}>
        <div className={classes.button}>
          <Button variant="outlined" color="primary" onClick={() => history.goBack()} disabled={!deals || !crops || !cropParams}>
            {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
          </Button>
        </div>
      </div>

      {!!deals && !deals.find(item => item.sale_bid.id === +saleId && item.purchase_bid.id === +purchaseId) && (
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
              <p>{intl.formatMessage({ id: "DEALS.TABLE.ABOUT_VAT" }, { vat: deal.purchase_bid.vat })}</p>
            )}
            <div className={classes.table}>
              <Table aria-label="simple table">
                <colgroup>
                  <col style={{ width: "30%" }}></col>
                  <col style={{ width: "35%" }}></col>
                  <col style={{ width: "35%" }}></col>
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TopTableCell></TopTableCell>
                    <TopTableCell align="center">
                      <FormattedMessage id="DEALS.TABLE.SALE" />
                    </TopTableCell>
                    <TopTableCell align="center">
                      <FormattedMessage id="DEALS.TABLE.PURCHASE" />
                    </TopTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.3)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.TABLE.PROFIT_WITH_DELIVERY" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.5)" }} colSpan={2} align="center">
                      {thousands(Math.round(deal.profit_with_delivery_price).toString())}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.3)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.TABLE.COST" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.5)" }} colSpan={2} align="center">
                      {thousands(
                        Math.round(
                          deal.sale_bid.price *
                            (deal.purchase_bid.volume < deal.sale_bid.volume ? deal.purchase_bid.volume : deal.sale_bid.volume)
                        ).toString()
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.3)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.TABLE.TOTAL_PROFIT" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.5)" }} colSpan={2} align="center">
                      {thousands(
                        Math.round(
                          deal.profit_with_delivery_price *
                            (deal.purchase_bid.volume < deal.sale_bid.volume ? deal.purchase_bid.volume : deal.sale_bid.volume)
                        ).toString()
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "BIDSLIST.TABLE.PAYMENT_TERM" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }} colSpan={2} align="center">
                      {deal.purchase_bid.payment_term || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.UP_TABLE.DISTANCE" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }} colSpan={2} align="center">
                      {thousands(Math.round(deal.distance).toString())}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.PRICE" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                      {/* {thousands(deal.sale_bid.price.toString())} */}
                      {!!deal?.purchase_bid?.vendor.use_vat && !!deal?.sale_bid?.vat && !deal.sale_bid.vendor.use_vat ? (
                        !deal.sale_bid.price ? (
                          "-"
                        ) : (
                          <>
                            <p style={{ marginBottom: "1px" }}>
                              {!!deal.sale_bid && thousands(Math.round(deal.sale_bid.price * (deal.sale_bid.vat / 100 + 1)))}
                            </p>
                            <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>
                              {`${deal.sale_bid.price && thousands(Math.round(deal.sale_bid.price))} + ${deal.sale_bid.vat}% НДС`}
                            </p>
                          </>
                        )
                      ) : deal.sale_bid.price ? (
                        thousands(Math.round(deal.sale_bid.price))
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>{thousands(deal.purchase_bid.price)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>
                      <strong>{intl.formatMessage({ id: "DEALS.DEAL.VOLUME" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>{deal.sale_bid.volume}</TableCell>
                    <TableCell style={{ backgroundColor: "rgba(10, 187, 135, 0.1)" }}>{deal.purchase_bid.volume}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>{intl.formatMessage({ id: "DEALS.DEAL.WORK_WITH_VAT" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#eeeeee" }}>
                      {!!deal.sale_bid.vat && !!deal.sale_bid.vendor.use_vat
                        ? `${intl.formatMessage({ id: "ALL.YES" })}, ${deal.sale_bid.vat}%`
                        : intl.formatMessage({ id: "ALL.NO" })}
                    </TableCell>
                    <TableCell>
                      {!!deal.purchase_bid.vat && !!deal.purchase_bid.vendor.use_vat
                        ? `${intl.formatMessage({ id: "ALL.YES" })}, ${deal.purchase_bid.vat}%`
                        : intl.formatMessage({ id: "ALL.NO" })}
                    </TableCell>
                  </TableRow>

                  {cropParams.map(
                    item =>
                      (deal.sale_bid.parameter_values.find(param => param.parameter_id === item.id) ||
                        deal.purchase_bid.parameter_values.find(param => param.parameter_id === item.id)) && (
                        <TableRow key={item.id}>
                          <TableCell>
                            <strong>{item.name}</strong>
                          </TableCell>
                          <TableCell style={{ backgroundColor: "#eeeeee" }}>
                            {deal.sale_bid.parameter_values.find(param => param.parameter_id === item.id)?.value || "-"}
                          </TableCell>
                          <TableCell>
                            {deal.purchase_bid.parameter_values.find(param => param.parameter_id === item.id)?.value || "-"}
                          </TableCell>
                        </TableRow>
                      )
                  )}

                  <TableRow>
                    <TableCell>
                      <strong>{intl.formatMessage({ id: "USER.EDIT_FORM.LOCATIONS" })}</strong>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#eeeeee" }}>{deal.sale_bid.location.text}</TableCell>
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
                      {`${deal.purchase_bid.modified_at.slice(8, 10)}.${deal.purchase_bid.modified_at.slice(
                        5,
                        7
                      )}.${deal.purchase_bid.modified_at.slice(0, 4)}`}
                    </TableCell>
                  </TableRow>

                  {me && (
                    <TableRow>
                      <TableCell>
                        <strong>{intl.formatMessage({ id: "DEALS.TABLE.AGENT" })}</strong>
                      </TableCell>
                      <TableCell style={{ backgroundColor: "#eeeeee" }}>
                        <p>
                          <div style={{ cursor: "pointer", color: "blue" }} onClick={() => linkToContact("sale")}>
                            {deal.sale_bid.vendor.login}
                          </div>
                        </p>
                        <p>
                          <div style={{ cursor: "pointer", color: "blue" }} onClick={() => linkToContact("sale")}>
                            {`${deal?.sale_bid.vendor.surname || ""} ${deal?.sale_bid.vendor.firstname || ""} ${deal?.sale_bid.vendor
                              .lastname || ""}`}
                          </div>
                        </p>
                        {!!deal?.sale_bid?.vendor?.phone && <p>тел.: {deal.sale_bid.vendor.phone}</p>}
                        <UserActivity intl={intl} user={deal.sale_bid.vendor} />
                        <div className={classes.topMargin}>
                          {!!deal.sale_bid.vendor.company && <div>{deal.sale_bid.vendor.company.short_name}</div>}
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
                          {!!deal?.sale_bid?.vendor?.company?.colors && !!deal?.sale_bid?.vendor?.company_confirmed_by_payment && (
                            <TrafficLight intl={intl} colors={deal?.sale_bid?.vendor?.company?.colors} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>
                          <div style={{ cursor: "pointer", color: "blue" }} onClick={() => linkToContact("purchase")}>
                            {deal.purchase_bid.vendor.login}
                          </div>
                        </p>
                        <p>
                          <div style={{ cursor: "pointer", color: "blue" }} onClick={() => linkToContact("purchase")}>
                            {`${deal?.purchase_bid.vendor.surname || ""} ${deal?.purchase_bid.vendor.firstname || ""} ${deal?.purchase_bid
                              .vendor.lastname || ""}`}
                          </div>
                        </p>
                        {!!deal?.purchase_bid?.vendor?.phone && <p>тел.: {deal.purchase_bid.vendor.phone}</p>}
                        <UserActivity intl={intl} user={deal.purchase_bid.vendor} />

                        <div className={classes.topMargin}>
                          {!!deal.purchase_bid.vendor.company && <div>{deal.purchase_bid.vendor.company.short_name}</div>}
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
                          {!!deal?.purchase_bid?.vendor?.company?.colors && !!deal?.purchase_bid?.vendor?.company_confirmed_by_payment && (
                            <TrafficLight intl={intl} colors={deal?.purchase_bid?.vendor?.company?.colors} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) && (
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell style={{ backgroundColor: "#eeeeee" }}>
                        <Link to={`/bid/edit/sale/${deal.sale_bid.id}`}>{intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}</Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/bid/edit/purchase/${deal.purchase_bid.id}`}>{intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}</Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {me && accessByRoles(me, ["ROLE_TRADER"]) && (
                <div style={{ marginTop: 20 }}>
                  <Alert className={classes.infoAlert} severity="warning" color="error" style={{ marginTop: 8, marginBottom: 8 }}>
                    {`Сегодня вам доступен просмотр ${me?.contact_view_count} контактов ${intl.formatMessage({
                      id: "BID.CONTACTS.LIMIT",
                    })}`}
                  </Alert>
                </div>
              )}
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
    min_prepayment_amount: state.deals.min_prepayment_amount,

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

    contactViewCountLoading: state.users.contactViewCountLoading,
    contactViewCountSuccess: state.users.contactViewCountSuccess,
    contactViewCountError: state.users.contactViewCountError,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetch: dealsActions.fetchRequest,
    fetchCrops: crops2Actions.fetchRequest,
    fetchCropParams: crops2Actions.cropParamsRequest,
    setDeal: dealsActions.setDeal,
    fetchDealsFilters: dealsActions.fetchFiltersRequest,
    editContactViewCount: usersActions.contactViewCountRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(DealViewPage);
