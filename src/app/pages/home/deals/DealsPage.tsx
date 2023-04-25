import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { YMaps, Map } from "react-yandex-maps";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableHead, TableRow, Paper, TableFooter, Button } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { Skeleton } from "@material-ui/lab";
import { LayoutSubheader } from "../../../../_metronic";
import { FilterModal } from "./components";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { ILocalDeals } from "./DealViewPage";
import { IDeal } from "../../../interfaces/deals";
import { REACT_APP_GOOGLE_API_KEY } from "../../../constants";
import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { сompareRoles } from "../../../utils/utils";
import DealItem from "./components/DealItem";

const DealsPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  loadingMe,
  fetchMe,
  clearMe,
  fetchByBidId,

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
  cropParams,

  clearEditFilter,
  editFilter,
  editFilterLoading,
  editFilterSuccess,
  editFilterError,
  bidSelected,
  setBidSelected,
  userIdSelected,
  managerIdSelected,
  userActive,
  currentRoles,
  cropSelected,
}) => {
  const classes = useStyles();
  const routeRef = useRef();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<IDeal | null>(null);
  const [map, setMap] = useState<any>();
  const [ymaps, setYmaps] = useState<any>();
  const { enqueueSnackbar } = useSnackbar();
  const loadFuncRef = useRef<any>();

  // memo **************

  const numberParams = useMemo(() => cropParams && cropParams.filter(item => item.type === "number"), [cropParams]);

  const rolesBidUser = useMemo(() => bidSelected && bidSelected.vendor?.roles, [bidSelected]);

  const localDeals: ILocalDeals[] | null = useMemo(() => {
    const storageDeals = localStorage.getItem("deals");
    return storageDeals ? JSON.parse(storageDeals) : null;
  }, [currentDeal]);

  const mapState = useMemo(() => {
    if (currentDeal?.sale_bid?.location) {
      return { center: [currentDeal.sale_bid.location.lat, currentDeal.sale_bid.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
    } else {
      return null;
    }
  }, [currentDeal]);

  // handlers **************

  const addRoute = useCallback(
    async (pointA: any, pointB: any) => {
      map.geoObjects.remove(routeRef.current);
      const multiRoute = await ymaps.route([pointA.text, pointB.text], {
        multiRoute: true,
        mapStateAutoApply: true,
      });
      routeRef.current = multiRoute;
      await map.geoObjects.add(multiRoute);
      const routes = multiRoute.getRoutes();
      let newRoute: any = null;
      for (let i = 0, l = routes.getLength(); i < l; i++) {
        const route = routes.get(i);
        if (!newRoute) {
          newRoute = route;
        } else {
          const newRouteDistance = newRoute.properties.getAll().distance.value;
          const distance = route.properties.getAll().distance.value;
          if (newRouteDistance > distance) {
            newRoute = route;
          }
        }
      }
      if (newRoute) {
        multiRoute.setActiveRoute(newRoute);
        newRoute.balloon.open();
      }
      const activeProperties = multiRoute.getActiveRoute();
      if (activeProperties && currentDeal) {
        const { distance } = activeProperties.properties.getAll();
        const newCurrentDeal: ILocalDeals = {
          distance: Math.round(distance.value / 1000),
          purchase_bid: {
            lat: currentDeal.purchase_bid.location.lat,
            lng: currentDeal.purchase_bid.location.lng,
            text: currentDeal.purchase_bid.location.text,
          },
          sale_bid: {
            lat: currentDeal.sale_bid.location.lat,
            lng: currentDeal.sale_bid.location.lng,
            text: currentDeal.sale_bid.location.text,
          },
        };
        if (localDeals) {
          const existDealsIndex = localDeals.findIndex(
            item =>
              item.purchase_bid.lat === currentDeal.purchase_bid.location.lat &&
              item.purchase_bid.lng === currentDeal.purchase_bid.location.lng &&
              item.sale_bid.lat === currentDeal.sale_bid.location.lat &&
              item.sale_bid.lng === currentDeal.sale_bid.location.lng
          );
          if (existDealsIndex > -1) {
            const newArr = localDeals;
            newArr[existDealsIndex] = newCurrentDeal;
            localStorage.setItem("deals", JSON.stringify(newArr));
          } else {
            localStorage.setItem("deals", JSON.stringify([...localDeals, newCurrentDeal]));
          }
        } else {
          localStorage.setItem("deals", JSON.stringify([newCurrentDeal]));
        }
      } else {
        enqueueSnackbar(intl.formatMessage({ id: "NOTISTACK.DEALS.NO_DISTANCE" }), {
          variant: "error",
        });
      }
      if (typeof loadFuncRef?.current === "function") {
        loadFuncRef?.current(false);
        loadFuncRef.current = null;
      }
      setCurrentDeal(null);
    },
    [ymaps, map, routeRef, localDeals, currentDeal, enqueueSnackbar, intl]
  );

  const handleLoadingDist = useCallback((deal: IDeal, setLoadDistanation: (load: boolean) => void) => {
    setLoadDistanation(true);
    loadFuncRef.current = setLoadDistanation;
    setCurrentDeal(deal);
  }, []);

  const getParametrName = useCallback(
    (item: { id: number; value: string; parameter_id: number }) => {
      const nameParam = numberParams?.find(param => param.id === item.parameter_id)?.name;
      return nameParam ? `${nameParam}: ${item.value}` : `${item.value}`;
    },
    [numberParams]
  );

  // useEffects **************

  useEffect(() => {
    if (ymaps && map && currentDeal?.sale_bid?.location && currentDeal?.purchase_bid?.location)
      addRoute(currentDeal.sale_bid.location, currentDeal.purchase_bid.location);
  }, [currentDeal, addRoute, ymaps, map]);

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
      fetch(
        1,
        perPage,
        weeks,
        !term ? 999 : +term,
        min_prepayment_amount ? min_prepayment_amount : undefined,
        userIdSelected,
        cropSelected,
        bidSelected?.id || 0,
        managerIdSelected,
        userActive,
        currentRoles
      );
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
    if (bidSelected) {
      fetchByBidId(1, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, bidSelected.id);
    }
    if (bidSelected === null) {
      fetchByBidId(1, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined);
    }
  }, [bidSelected]);

  useEffect(() => {
    fetchAllCropParams("enum");
  }, [fetchAllCropParams]);

  useEffect(() => {
    fetchDealsFilters();
  }, [fetchDealsFilters]);

  useEffect(() => {
    if (!!dealsFilters)
      fetch(
        page,
        perPage,
        weeks,
        !term ? 999 : +term,
        min_prepayment_amount ? min_prepayment_amount : undefined,
        userIdSelected,
        cropSelected,
        bidSelected?.id || 0,
        managerIdSelected,
        userActive,
        currentRoles
      );
  }, [dealsFilters, fetch, page, perPage, term, weeks, min_prepayment_amount]);

  if (error || filtersError || cropsError || allCropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithTable} style={{ paddingTop: 16 }}>
      <LayoutSubheader title={intl.formatMessage({ id: "DEALS.TITLE" })} />
      {bidSelected && (
        <div style={{ marginBottom: "2em" }}>
          <div className={classes.titleTextBold}>
            <b>{intl.formatMessage({ id: "BID.TITLE.SELECTED" })}</b>
          </div>
          <div className={classes.normalText}>
            <b>{intl.formatMessage({ id: "DEALS.TABLE.CROP" })}: </b>
            {bidSelected?.crop_id && crops?.find(crop => crop?.id === bidSelected?.crop_id)?.name}
          </div>
          <div className={classes.normalText}>
            <b>Объём: </b>
            {bidSelected.parameter_values.map(item => getParametrName(item)).join(" / ") +
              `${bidSelected.parameter_values.length > 0 ? " / " : ""}${bidSelected.volume} тонн`}
          </div>
          <div className={classes.normalText}>
            <b>Цена: </b>
            {bidSelected?.price} руб
          </div>
          <div className={classes.normalText}>
            <b>Точка: </b>
            {bidSelected?.location.text}
          </div>
          <Button
            onClick={() => setBidSelected(null)}
            className="kt-subheader__btn"
            variant="contained"
            color="primary"
            style={{ margin: "20px 0" }}
          >
            {intl.formatMessage({ id: "ALL.BUTTONS.CLEAR" })}
          </Button>
          <div className={classes.titleTextBold}>
            <b>{intl.formatMessage({ id: "BID.TITLE.DEALS" })}</b>
          </div>
        </div>
      )}
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
          <Table stickyHeader style={{ position: "relative" }}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                {!bidSelected && (
                  <TopTableCell>
                    <FormattedMessage id="DEALS.TABLE.CROP" />
                  </TopTableCell>
                )}
                {rolesBidUser && сompareRoles(rolesBidUser, "ROLE_VENDOR") ? (
                  <></>
                ) : (
                  <TopTableCell>
                    <FormattedMessage id="DEALS.TABLE.SALE" />
                  </TopTableCell>
                )}
                {rolesBidUser && сompareRoles(rolesBidUser, "ROLE_BUYER") ? (
                  <></>
                ) : (
                  <TopTableCell>
                    <FormattedMessage id="DEALS.TABLE.PURCHASE" />
                  </TopTableCell>
                )}
                {bidSelected && <TopTableCell>Цена</TopTableCell>}
                {bidSelected && <TopTableCell>Объем</TopTableCell>}
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.DELIVERY" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.PRICE.WITH.DELIVERY" />
                </TopTableCell>
                <TopTableCell>Тариф</TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.PROFIT" />
                </TopTableCell>
                <TopTableCell>%</TopTableCell>
                <TopTableCell>Срок</TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="DEALS.TABLE.DISTANCE" />
                </TopTableCell>
                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!deals &&
                deals.map((item, i) => (
                  <DealItem
                    key={i}
                    item={item}
                    crops={crops}
                    rolesBidUser={rolesBidUser}
                    classes={classes}
                    intl={intl}
                    bidSelected={bidSelected}
                    handleLoadingDist={handleLoadingDist}
                    loadFuncRef={loadFuncRef.current}
                  />
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
                    fetch(
                      page,
                      perPage,
                      weeks,
                      !term ? 999 : +term,
                      min_prepayment_amount ? min_prepayment_amount : undefined,
                      userIdSelected,
                      cropSelected,
                      bidSelected?.id || 0,
                      managerIdSelected,
                      userActive,
                      currentRoles
                    )
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
      <div style={{ display: "none" }}>
        {mapState && (
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
      </div>
    </Paper>
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
    cropParams: state.crops2.cropParams,

    editFilterLoading: state.deals.editFilterLoading,
    editFilterSuccess: state.deals.editFilterSuccess,
    editFilterError: state.deals.editFilterError,

    editLoading: state.bids.editLoading,
    editSuccess: state.bids.editSuccess,
    editError: state.bids.editError,
    bidSelected: state.bids.bidSelected,
    userIdSelected: state.users.userIdSelected,
    managerIdSelected: state.users.managerIdSelected,
    userActive: state.users.userActive,
    currentRoles: state.users.currentRoles,
    cropSelected: state.users.cropSelected,
  }),
  {
    fetch: dealsActions.fetchRequest,
    fetchByBidId: dealsActions.fetchByBidId,
    fetchDealsFilters: dealsActions.fetchFiltersRequest,
    fetchCrops: crops2Actions.fetchRequest,
    fetchAllCropParams: crops2Actions.allCropParamsRequest,
    clearEditFilter: dealsActions.clearEditFilter,
    editFilter: dealsActions.editFilterRequest,

    fetchMe: authActions.fetchRequest,
    clearMe: authActions.clearFetch,

    setBidSelected: bidsActions.setBidSelected,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsPage));
