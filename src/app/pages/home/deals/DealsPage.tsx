import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, TableFooter } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { useSnackbar } from "notistack";
import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../_metronic";
import { FilterModal } from "./components";
import MiniTrafficLight from "../users/components/miniTrafficLight/MiniTrafficLight";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { thousands } from "./utils/utils";
import { ILocalDeals } from "./DealViewPage";
import { IDeal } from "../../../interfaces/deals";

const DealsPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,

  me,
  loadingMe,
  fetchMe,
  clearMe,

  page,
  perPage,
  total,
  weeks,
  setWeeks,
  term,
  setTerm,
  min_prepayment_amount,
  setPrepayment,
  fetch,
  deals,
  loading,
  error,

  fetchDealsFilters,
  dealsFilters,
  filtersLoading,
  filtersError,

  fetchCrops,
  crops,
  cropsError,

  fetchAllCropParams,
  allCropParams,
  allCropParamsError,

  clearEditFilter,
  editFilter,
  editFilterLoading,
  editFilterSuccess,
  editFilterError,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const localDeals: ILocalDeals[] | null = useMemo(() => {
    const storageDeals = localStorage.getItem("deals");
    return storageDeals ? JSON.parse(storageDeals) : null;
  }, []);

  const getCurrentCrop = useCallback((currentDeal: IDeal) => crops?.find(crop => crop.id === currentDeal.sale_bid.crop_id), [crops]);

  const getDistance = useCallback(
    (currentDeal: IDeal) => {
      if (localDeals) {
        const localDistance = localDeals.find(
          item =>
            item.purchase_bid.lat === currentDeal.purchase_bid.location.lat &&
            item.purchase_bid.lng === currentDeal.purchase_bid.location.lng &&
            item.sale_bid.lat === currentDeal.sale_bid.location.lat &&
            item.sale_bid.lng === currentDeal.sale_bid.location.lng
        );
        if (localDistance) return localDistance.distance;
      }
      return currentDeal.distance;
    },
    [localDeals]
  );

  const getProfit = useCallback(
    (currentDeal: IDeal) => {
      const currentCrop = getCurrentCrop(currentDeal);
      const localDistance = getDistance(currentDeal);
      if (localDistance && currentCrop && currentCrop.delivery_price_coefficient) {
        return currentDeal.purchase_bid.price - currentDeal.sale_bid.price - localDistance * currentCrop.delivery_price_coefficient;
      }
      return Math.round(currentDeal.profit_with_delivery_price);
    },
    [getCurrentCrop, getDistance]
  );

  useEffect(() => {
    if (editFilterSuccess || editFilterError) {
      enqueueSnackbar(
        editFilterSuccess
          ? intl.formatMessage({ id: "NOTISTACK.EDIT_DEAL_PARAMS" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editFilterError}`,
        {
          variant: editFilterSuccess ? "success" : "error",
        }
      );
      clearEditFilter();
    }
    if (editFilterSuccess) {
      fetch(1, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined);
      fetchDealsFilters();
    }
  }, [
    clearEditFilter,
    editFilterError,
    editFilterSuccess,
    enqueueSnackbar,
    fetch,
    fetchDealsFilters,
    intl,
    page,
    perPage,
    term,
    weeks,
    min_prepayment_amount,
  ]);

  useEffect(() => {
    fetchMe();

    return () => {
      clearMe();
    };
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    fetchAllCropParams("enum");
  }, [fetchAllCropParams]);

  useEffect(() => {
    fetchDealsFilters();
  }, [fetchDealsFilters]);

  useEffect(() => {
    if (!!dealsFilters) fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined);
  }, [dealsFilters, fetch, page, perPage, term, weeks, min_prepayment_amount]);

  if (error || filtersError || cropsError || allCropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithTable} style={{ paddingTop: 16 }}>
      <LayoutSubheader title={intl.formatMessage({ id: "DEALS.TITLE" })} />
      {!deals || !crops || !dealsFilters || !allCropParams || loadingMe || loading ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={53} animation="wave" />
        </>
      ) : !deals?.length ? (
        <div>{intl.formatMessage({ id: "DEALS.EMPTY" })}</div>
      ) : (
        <div className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.CROP" />
                </TopTableCell>
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
                <TopTableCell>
                  <FormattedMessage id="BIDSLIST.TABLE.TIME" />
                </TopTableCell>
                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!deals &&
                deals.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{crops.find(crop => crop.id === item.sale_bid.crop_id)?.name}</TableCell>
                    <TableCell>
                      <div className={classes.flexColumn}>
                        <div style={{ display: "flex" }}>
                          <strong style={{ marginRight: 5 }}>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
                          <strong>
                            {!!item?.purchase_bid?.vendor.use_vat && !!item?.sale_bid?.vat && !item.sale_bid.vendor.use_vat ? (
                              !item.sale_bid.price ? (
                                "-"
                              ) : (
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <p style={{ marginBottom: "1px", marginRight: 10 }}>
                                    {!!item.sale_bid && thousands(Math.round(item.sale_bid.price * (item.sale_bid.vat / 100 + 1)))}
                                  </p>
                                  <p style={{ marginBottom: 0, color: "#999999", fontSize: "10px" }}>
                                    ({`${item.sale_bid.price && thousands(Math.round(item.sale_bid.price))} + ${item.sale_bid.vat}% НДС`})
                                  </p>
                                </div>
                              )
                            ) : item.sale_bid.price ? (
                              thousands(Math.round(item.sale_bid.price))
                            ) : (
                              "-"
                            )}
                          </strong>
                        </div>
                        <div>
                          <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
                          <strong>{item.sale_bid.volume}</strong>
                        </div>
                        <div>
                          {intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.SALE" })}
                          {": "}
                          {item.sale_bid.location.text}
                        </div>
                        <div>{intl.formatMessage({ id: "DEALS.TABLE.SELLER" })}</div>
                        <div>
                          <div className={classes.flexRow}>
                            {item?.sale_bid?.vendor?.company_confirmed_by_payment && (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "USERLIST.TOOLTIP.COMPANY",
                                })}
                              >
                                <CheckCircleOutlineIcon color="secondary" style={{ marginRight: 4, width: 16, height: 16 }} />
                              </Tooltip>
                            )}
                            <div>{`${item?.sale_bid.vendor.login || ""}`}</div>
                          </div>
                          <div>{` ${item?.sale_bid.vendor.surname || ""} ${item?.sale_bid.vendor.firstname || ""} ${item?.sale_bid.vendor
                            .lastname || ""}`}</div>
                          {item?.sale_bid.vendor.company && (
                            <div className={classes.flexRow} style={{ marginTop: 10 }}>
                              {!!item?.sale_bid?.vendor?.company?.colors && item?.sale_bid.vendor.company.colors.length > 0 && (
                                <MiniTrafficLight intl={intl} colors={item?.sale_bid.vendor.company.colors} />
                              )}
                              <div>{`${item?.sale_bid.vendor.company.short_name || ""}`}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.flexColumn}>
                        <div>
                          <strong>{intl.formatMessage({ id: "DEALS.TABLE.PRICE" })}</strong>
                          <strong>{item.purchase_bid.price}</strong>
                        </div>
                        <div>
                          <strong>{intl.formatMessage({ id: "DEALS.TABLE.VOLUME" })}</strong>
                          <strong>{item.purchase_bid.volume}</strong>
                        </div>
                        <div>
                          {intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.PURCHASE" })}
                          {": "}
                          {item.purchase_bid.location.text}
                        </div>
                        <div>{intl.formatMessage({ id: "DEALS.TABLE.BUYER" })}</div>
                        <div>
                          <div className={classes.flexRow}>
                            {item?.purchase_bid?.vendor?.company_confirmed_by_payment && (
                              <Tooltip
                                title={intl.formatMessage({
                                  id: "USERLIST.TOOLTIP.COMPANY",
                                })}
                              >
                                <CheckCircleOutlineIcon color="secondary" style={{ marginRight: 4, width: 16, height: 16 }} />
                              </Tooltip>
                            )}
                            <div>{`${item?.purchase_bid.vendor.login || ""}`}</div>
                          </div>
                          <div>{`${item?.purchase_bid.vendor.surname || ""} ${item?.purchase_bid.vendor.firstname || ""} ${item
                            ?.purchase_bid.vendor.lastname || ""}`}</div>
                          {item?.purchase_bid.vendor.company && (
                            <div className={classes.flexRow} style={{ marginTop: 10 }}>
                              {!!item?.purchase_bid?.vendor?.company?.colors && item?.purchase_bid.vendor.company.colors.length > 0 && (
                                <MiniTrafficLight intl={intl} colors={item?.purchase_bid.vendor.company.colors} />
                              )}
                              <div>{`${item?.purchase_bid.vendor.company.short_name || ""}`}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getProfit(item)}</TableCell>
                    <TableCell>{getDistance(item)}</TableCell>
                    <TableCell>{item.purchase_bid.payment_term || "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() => history.push(`/deals/view/${item.purchase_bid.crop_id}/${item.sale_bid.id}/${item.purchase_bid.id}`)}
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
                  page={page}
                  realPerPage={deals.length}
                  perPage={perPage}
                  total={total}
                  fetchRows={(page, perPage) =>
                    fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined)
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
      <FilterModal
        intl={intl}
        isOpen={filterModalOpen}
        handleClose={() => setFilterModalOpen(false)}
        dealsFilters={dealsFilters}
        crops={crops}
        allCropParams={allCropParams}
        editFilter={editFilter}
        editFilterLoading={editFilterLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    loadingMe: state.auth.loading,

    page: state.deals.page,
    perPage: state.deals.per_page,
    total: state.deals.total,
    weeks: state.deals.weeks,
    term: state.deals.term,
    min_prepayment_amount: state.deals.min_prepayment_amount,
    deals: state.deals.deals,
    loading: state.deals.loading,
    error: state.deals.error,

    dealsFilters: state.deals.filters,
    filtersLoading: state.deals.filtersLoading,
    filtersError: state.deals.filtersError,

    crops: state.crops2.crops,
    cropsError: state.crops2.error,

    allCropParams: state.crops2.allCropParams,
    allCropParamsError: state.crops2.allCropParamsError,

    editFilterLoading: state.deals.editFilterLoading,
    editFilterSuccess: state.deals.editFilterSuccess,
    editFilterError: state.deals.editFilterError,

    editLoading: state.bids.editLoading,
    editSuccess: state.bids.editSuccess,
    editError: state.bids.editError,
  }),
  {
    fetch: dealsActions.fetchRequest,
    fetchDealsFilters: dealsActions.fetchFiltersRequest,
    fetchCrops: crops2Actions.fetchRequest,
    fetchAllCropParams: crops2Actions.allCropParamsRequest,
    clearEditFilter: dealsActions.clearEditFilter,
    editFilter: dealsActions.editFilterRequest,
    setWeeks: dealsActions.setWeeks,
    setTerm: dealsActions.setTerm,
    setPrepayment: dealsActions.setPrepayment,

    fetchMe: authActions.fetchRequest,
    clearMe: authActions.clearFetch,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsPage));
