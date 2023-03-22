import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { YMaps, Map } from "react-yandex-maps";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, TableFooter, Button, CircularProgress, TextField, MenuItem } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { useSnackbar } from "notistack";
import { actions as dealsActions } from "../../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../../store/ducks/crops2.duck";
import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import useStyles from "../../styles";
import { IAppState } from "../../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../../_metronic";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import MiniTrafficLight from "./miniTrafficLight/MiniTrafficLight";
import { TablePaginator } from "../../../../components/ui/Table/TablePaginator";
import { thousands } from "../../deals/utils/utils";
import { ILocalDeals } from "../../deals/DealViewPage";
import { IDeal } from "../../../../interfaces/deals";
import { sign } from "crypto";
import moment from "moment";

interface IProps {
  vendorId: number
}

const DealsPage: React.FC<TPropsFromRedux & WrappedComponentProps & IProps> = ({
  intl,
  loadingMe,
  fetchMe,
  clearMe,
  vendorId,

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

  fetchDealsFilters,
  dealsFilters,
  filtersError,

  fetchCrops,
  crops,
  cropsError,

  fetchAllCropParams,
  allCropParams,
  allCropParamsError,

  clearEditFilter,
  editFilterSuccess,
  editFilterError,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [currentDeal, setCurrentDeal] = useState<IDeal | null>(null);
  const [loadDistanation, setLoadDistanation] = useState<number | null>(null);
  const [cropId, setCropId] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const localDeals: ILocalDeals[] | null = useMemo(() => {
    const storageDeals = localStorage.getItem("deals");
    return storageDeals ? JSON.parse(storageDeals) : null;
  }, [currentDeal]);

  const getCurrentCrop = useCallback((currentDeal: IDeal) => crops?.find(crop => crop.id === currentDeal.sale_bid.crop_id), [crops]);

  const getDistance = useCallback(
    (currentDeal: IDeal, noneElement?: boolean) => {
      if (localDeals) {
        const localDistance = localDeals.find(
          item =>
            item.purchase_bid.lat === currentDeal.purchase_bid.location.lat &&
            item.purchase_bid.lng === currentDeal.purchase_bid.location.lng &&
            item.sale_bid.lat === currentDeal.sale_bid.location.lat &&
            item.sale_bid.lng === currentDeal.sale_bid.location.lng
        );
        if (localDistance) {
          return {
            isLocal: true,
            data: noneElement ? (
              localDistance.distance
            ) : (
              <TableCell className={classes.tableCellModifed}>{localDistance.distance}</TableCell>
            ),
          };
        }
      }
      return {
        isLocal: false,
        data: noneElement ? currentDeal.distance : <TableCell>{currentDeal.distance}</TableCell>,
      };
    },
    [localDeals]
  );

  const getProfit = useCallback(
    (currentDeal: IDeal) => {
      const currentCrop = getCurrentCrop(currentDeal);
      const localDistance = getDistance(currentDeal, true);
      if (localDistance.data && typeof localDistance.data === "number" && currentCrop && currentCrop.delivery_price_coefficient) {
        const distance = localDistance.data > 100 ? localDistance.data : 100;
        return (
          <TableCell className={localDistance.isLocal ? classes.tableCellModifed : undefined} style={{
            color: (currentDeal.purchase_bid.price -
              Math.round(currentDeal.sale_bid.price * (currentDeal.sale_bid.vat / 100 + 1)) -
              distance * currentCrop.delivery_price_coefficient) < 0 ? "#000000" : "#21BA88"
          }}>
            {!!currentDeal?.purchase_bid?.vendor.use_vat && !!currentDeal?.sale_bid?.vat && !currentDeal.sale_bid.vendor.use_vat ? (
              <>
                {currentDeal.purchase_bid.price -
                  Math.round(currentDeal.sale_bid.price * (currentDeal.sale_bid.vat / 100 + 1)) -
                  distance * currentCrop.delivery_price_coefficient}
              </>
            ) : (
              <>{currentDeal.purchase_bid.price - currentDeal.sale_bid.price - distance * currentCrop.delivery_price_coefficient}</>
            )}
          </TableCell>
        );
      }
      return <TableCell style={{
        color: currentDeal.profit_with_delivery_price < 0? "#000000" : "#21BA88"
      }}>{Math.round(currentDeal.profit_with_delivery_price)}</TableCell>;
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
      fetch(1, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, vendorId);
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
    if (!!dealsFilters) fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, vendorId);
  }, [dealsFilters, fetch, page, perPage, term, weeks, min_prepayment_amount]);

  if (error || filtersError || cropsError || allCropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  const sign = (item) => {
    const parseValue = (item) => {
      if (typeof item === 'number') {
        return item
      } else {
        return item?.props?.children
      }
    }
    if (Number(parseValue(item)) < 0) {
      return '-'
    } else {
      return null
    }
  }

  const checkDealAge = useCallback((bid) => {
    const now = moment(new Date());
    const end = moment(bid?.modified_at);
    const duration = moment.duration(now.diff(end));
    const days = duration.asDays();
    return days > 30 ? true : false
  }, []);

  return (
    <>
      <div>
        {crops && (
          <TextField
            select
            margin="normal"
            label={intl.formatMessage({
              id: "DEALS.CROPS.TITLE",
            })}
            onChange={(e) => {
              setCropId(Number(e.target.value))
              fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, vendorId, Number(e.target.value))
            }}
            name="status"
            variant="outlined"
          >
            {crops!.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>
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
                    %
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
                    <TableRow key={i} style={{
                      border: (checkDealAge(item.purchase_bid) || checkDealAge(item.sale_bid))? "4px solid #FD397A" : 'none',
                      padding: (checkDealAge(item.purchase_bid) || checkDealAge(item.sale_bid))? 8 : 0,
                    }}>
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
                      {getProfit(item)}

                      <TableCell style={{ width: '100px' }}>
                        {sign(getProfit(item).props.children)}
                        {Math.abs(Number(((item.profit_with_delivery_price / item.purchase_bid.price_with_delivery) * 100).toFixed(0)))}%</TableCell>
                      <TableCell>{item.purchase_bid.payment_term || "-"}</TableCell>
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
                      fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, vendorId)
                    }
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </Paper>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
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

    fetchMe: authActions.fetchRequest,
    clearMe: authActions.clearFetch,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsPage));
