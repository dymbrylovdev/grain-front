import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { compose } from "redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import { Button, Modal, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { YMaps, Map } from "react-yandex-maps";
import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";
import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Alert, Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../_metronic";
import { TrafficLight, UserActivity } from "../users/components";
import { accessByRoles, getConfirmCompanyString } from "../../../utils/utils";
import { thousands } from "./utils/utils";
import { MuiPickersUtilsProvider, Calendar } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruRU from "date-fns/locale/ru";
import { isValid } from "date-fns";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { useShowErrors } from "../../../hooks/useShowErrors";
import { REACT_APP_GOOGLE_API_KEY } from "../../../constants";

export interface ILocalDeals {
  sale_bid: {
    lat: number;
    lng: number;
    text: string;
  };
  purchase_bid: {
    lat: number;
    lng: number;
    text: string;
  };
  distance: number;
}

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

  edit,
  editLoading,
  editSuccess,
  editError,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const routeRef = useRef();
  const [archiveBid, setArchiveBid] = useState<undefined | { id: number; type: "sale" | "purchase" }>();
  const [archiveDate, setArchiveDate] = useState(new Date());
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [map, setMap] = useState<any>();
  const [ymaps, setYmaps] = useState<any>();
  const [localDistance, setLocalDistance] = useState<number | null>(null);
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

  const currentCrop = useMemo(() => crops?.find(item => item.id.toString() === cropId), [crops, cropId]);

  const newProfit = useMemo(() => {
    if (localDistance && currentCrop && deal && currentCrop.delivery_price_coefficient) {
      return deal.purchase_bid.price - deal.sale_bid.price - localDistance * currentCrop.delivery_price_coefficient;
    } else if (deal) {
      return Math.round(deal.profit_with_delivery_price);
    }
    return 0;
  }, [localDistance, currentCrop, deal]);

  const localDeals: ILocalDeals[] | null = useMemo(() => {
    const storageDeals = localStorage.getItem("deals");
    return storageDeals ? JSON.parse(storageDeals) : null;
  }, []);

  const mapState = useMemo(() => {
    if (deal?.sale_bid?.location) {
      return { center: [deal.sale_bid.location.lat, deal.sale_bid.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
    } else {
      return null;
    }
  }, [deal]);

  const addRoute = useCallback(
    async (pointA: any, pointB: any) => {
      map.geoObjects.remove(routeRef.current);

      // create multiroute and add to the map
      const multiRoute = await ymaps.route([pointA.text, pointB.text], {
        multiRoute: true,
        mapStateAutoApply: true,
      });
      routeRef.current = multiRoute;
      await map.geoObjects.add(multiRoute);

      // open active route balloon
      const routes = multiRoute.getRoutes();
      for (let i = 0, l = routes.getLength(); i < l; i++) {
        const route = routes.get(i);
        // if (!route.properties.get('blocked')) {
        multiRoute.setActiveRoute(route);
        route.balloon.open();
        break;
        // }
      }
      const activeProperties = multiRoute.getActiveRoute();
      if (activeProperties && deal) {
        const { distance } = activeProperties.properties.getAll();
        const currentDeal: ILocalDeals = {
          distance: Math.round(distance.value / 1000),
          purchase_bid: {
            lat: deal.purchase_bid.location.lat,
            lng: deal.purchase_bid.location.lng,
            text: deal.purchase_bid.location.text,
          },
          sale_bid: {
            lat: deal.sale_bid.location.lat,
            lng: deal.sale_bid.location.lng,
            text: deal.sale_bid.location.text,
          },
        };
        setLocalDistance(currentDeal.distance);
        if (localDeals) {
          const existDealsIndex = localDeals.findIndex(
            item =>
              item.purchase_bid.lat === deal.purchase_bid.location.lat &&
              item.purchase_bid.lng === deal.purchase_bid.location.lng &&
              item.sale_bid.lat === deal.sale_bid.location.lat &&
              item.sale_bid.lng === deal.sale_bid.location.lng
          );
          if (existDealsIndex > -1) {
            const newArr = localDeals;
            newArr[existDealsIndex] = currentDeal;
            localStorage.setItem("deals", JSON.stringify(newArr));
          } else {
            localStorage.setItem("deals", JSON.stringify([...localDeals, currentDeal]));
          }
        } else {
          localStorage.setItem("deals", JSON.stringify([currentDeal]));
        }
      }
    },
    [ymaps, map, routeRef, localDeals, deal]
  );

  useEffect(() => {
    if (ymaps && map && deal?.sale_bid?.location && deal?.purchase_bid?.location)
      addRoute(deal.sale_bid.location, deal.purchase_bid.location);
  }, [deal, addRoute, ymaps, map]);

  useEffect(() => {
    if (archiveBid && archiveBid.type && deal && deal[`${archiveBid.type}_bid`].archived_to) {
      setArchiveDate(new Date(deal[`${archiveBid.type}_bid`].archived_to));
    }
  }, [archiveBid]);

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

  useEffect(() => {
    if (editSuccess && deal && archiveBid && archiveBid.type) {
      setDeal({
        ...deal,
        [`${archiveBid.type}_bid`]: {
          ...deal[`${archiveBid.type}_bid`],
          archived_to: archiveDate,
        },
      });
      setArchiveBid(undefined);
      history.goBack();
    }
  }, [editSuccess]);

  if (error || filtersError || cropsError || cropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  useShowErrors([editError]);

  return (
    <>
      <div style={{ display: "none" }}>
        {deal && mapState && (
          <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
            <Map
              state={mapState}
              instanceRef={ref => setMap(ref)}
              onLoad={ymaps => {
                setYmaps(ymaps);
              }}
              modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
            />
          </YMaps>
        )}
        \
      </div>
      <Modal open={!!archiveBid && !editLoading} onClose={() => setArchiveBid(undefined)}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: 10,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruRU}>
            <Calendar
              minDate={new Date()}
              date={archiveDate}
              onChange={e => {
                if (isValid(e)) {
                  setArchiveDate(e as Date);
                }
              }}
            />
          </MuiPickersUtilsProvider>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <Button color="secondary" onClick={() => setArchiveBid(undefined)} style={{ marginRight: 15 }}>
              Отмена
            </Button>
            {archiveBid && (
              <Button color="primary" onClick={() => edit(archiveBid.id, { archived_to: archiveDate, is_archived: true })}>
                Архивировать
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Paper className={classes.paperWithTable}>
        {!!crops && (
          <LayoutSubheader
            title={intl.formatMessage({ id: "DEALS.VIEW.TITLE" }, { name: crops?.find(item => item.id === +cropId)?.name })}
          />
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
        {!deals || !crops || !cropParams || editLoading ? (
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
                        {thousands(newProfit.toString())}
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
                            newProfit * (deal.purchase_bid.volume < deal.sale_bid.volume ? deal.purchase_bid.volume : deal.sale_bid.volume)
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
                        {thousands(localDistance ? localDistance.toString() : Math.round(deal.distance).toString())}
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
                            {!!deal?.purchase_bid?.vendor?.company?.colors &&
                              !!deal?.purchase_bid?.vendor?.company_confirmed_by_payment && (
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
                          <Button onClick={() => history.push(`/bid/edit/sale/${deal.sale_bid.id}`)}>
                            {intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}
                          </Button>

                          {(deal.sale_bid.author.id === me?.id || me?.is_admin) && !deal.sale_bid.is_archived && (
                            <Button onClick={() => setArchiveBid({ id: deal.sale_bid.id, type: "sale" })}>
                              {intl.formatMessage({ id: "DEALS.TABLE.ARCHIVE_TEXT" })}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => history.push(`/bid/edit/purchase/${deal.purchase_bid.id}`)}>
                            {intl.formatMessage({ id: "DEALS.TABLE.EDIT_TEXT" })}
                          </Button>

                          {(deal.purchase_bid.author.id === me?.id || me?.is_admin) && !deal.purchase_bid.is_archived && (
                            <Button onClick={() => setArchiveBid({ id: deal.purchase_bid.id, type: "purchase" })}>
                              {intl.formatMessage({ id: "DEALS.TABLE.ARCHIVE_TEXT" })}
                            </Button>
                          )}
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
    </>
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

    editLoading: state.bids.editLoading,
    editSuccess: state.bids.editSuccess,
    editError: state.bids.editError,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetch: dealsActions.fetchRequest,
    fetchCrops: crops2Actions.fetchRequest,
    fetchCropParams: crops2Actions.cropParamsRequest,
    setDeal: dealsActions.setDeal,
    fetchDealsFilters: dealsActions.fetchFiltersRequest,
    editContactViewCount: usersActions.contactViewCountRequest,
    clearEdit: bidsActions.clearEdit,
    edit: bidsActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(DealViewPage);
