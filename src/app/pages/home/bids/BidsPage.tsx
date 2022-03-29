import React, { useEffect, useState, useCallback, useMemo } from "react";
import { compose } from "redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Button, CardMedia } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import fileSaver from "file-saver";

import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { actions as prompterActions } from "../../../store/ducks/prompter.duck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
// import FilterModal from "./components/filter/FilterModal";
import LocationBlock from "./components/location/LocationBlock";
import PricesDialog from "./components/prices/PricesDialog";
import LocationDialog from "./components/location/LocationDialog";
// import Prompter from "../prompter/Prompter";
// import BidTable from "./components/BidTable";
import { IUser } from "../../../interfaces/users";
import { filterForBids } from "../myFilters/utils";
import { LayoutSubheader, toAbsoluteUrl } from "../../../../_metronic";
import { accessByRoles } from "../../../utils/utils";
import { IBid } from "../../../interfaces/bids";
import { useShowErrors } from "../../../hooks/useShowErrors";
import BidsList from "./components/BidsList";
import { IFilterForBids } from "../../../interfaces/filters";
import { useBidsPageStyles } from "./components/hooks/useStyles";
import BidTable from "./components/BidTable";
import { getPoint } from "../../../utils/localPoint";
import { useArchivedBid } from "./components/hooks/useArchivedBid";

const BidsPage: React.FC<TPropsFromRedux & WrappedComponentProps & RouteComponentProps<{ cropId: string }>> = ({
  match: {
    params: { cropId },
  },
  match,
  // location,
  intl,

  fetchMe,
  me,
  // activeStep,
  // prompterRunning,
  // setActiveStep,
  currentSaleFilters,
  setCurrentSaleFilter,
  currentPurchaseFilters,
  setCurrentPurchaseFilter,

  page,
  perPage,
  total,

  filter,

  fetch,
  bids,
  // loading,
  error,

  fetchBestBids,
  bestBids,
  // bestLoading,
  bestError,

  fetchMyBids,
  myBids,
  // myLoading,
  myError,

  fetchCrops,
  crops,
  // cropsLoading,
  cropsError,

  fetchCropParams,
  cropParams,
  // cropParamsLoading,
  cropParamsError,

  fetchFilters,
  clearEditFilters,
  // editFilterLoading,
  editFilterSuccess,
  editFilterError,

  // clearCreate,
  // create,
  // createLoading,
  // createSuccess,
  // createError,
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
  setProfit,

  pointPrices,

  // clearBidsXlsUrl,
  fetchBidsXlsUrl,

  bidsXlsUrl,
  // bidsXlsUrlLoading,
  // bidsXlsUrlSuccess,
  guestLocation,
  bidsXlsUrlError,
}) => {
  let bestAllMyMode: "best-bids" | "all-bids" | "edit" | "my-bids" = "best-bids";
  if (match.url.indexOf("best-bids") !== -1) bestAllMyMode = "best-bids";
  if (match.url.indexOf("all-bids") !== -1) bestAllMyMode = "all-bids";
  if (match.url.indexOf("my-bids") !== -1) bestAllMyMode = "my-bids";
  if (match.url.indexOf("edit") !== -1) bestAllMyMode = "edit";

  let salePurchaseMode: "sale" | "purchase" = "sale";
  if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";
  const [currentFilters, setCurrentFilters] = useState<IFilterForBids | null>(null);
  const [archivedBid, loadingArchived, successArchived] = useArchivedBid();
  const dateForExcel = format(new Date(), "dd.MM.yyyy");
  const numberParams = useMemo(() => cropParams && cropParams.filter(item => item.type === "number"), [cropParams]);
  const currentFilterOnCropId = useMemo(() => (salePurchaseMode === "sale" ? currentSaleFilters[cropId] : currentPurchaseFilters[cropId]), [
    salePurchaseMode,
    currentSaleFilters,
    cropId,
    currentPurchaseFilters,
  ]);

  const currentCropName = useMemo(() => crops?.find(item => item.id.toString() === cropId)?.name, [cropId, crops]);
  const cropParameters = useMemo(() => {
    const newParams: any[] = [];
    if (Number(cropId) === 0 || bestAllMyMode === "all-bids") return undefined;
    if (currentFilters && cropParams && currentFilters.filter.parameter_values) {
      if (currentFilters.filter.max_distance && currentFilters.filter.max_distance > 0) {
        newParams.push({
          parameter_id: "max_destination",
          text: `Макс. расстояние: ${currentFilters.filter.max_distance}`,
          value: currentFilters.filter.max_distance,
        });
      }
      if (currentFilters.filter.min_full_price && currentFilters.filter.min_full_price > 0) {
        newParams.push({
          parameter_id: "min_full_price",
          text: `Мин. цена: ${currentFilters.filter.min_full_price}`,
          value: currentFilters.filter.min_full_price,
        });
      }
      if (currentFilters.filter.max_full_price && currentFilters.filter.max_full_price > 0) {
        newParams.push({
          parameter_id: "max_full_price",
          text: `Макс. цена: ${currentFilters.filter.max_full_price}`,
          value: currentFilters.filter.max_full_price,
        });
      }
      const newArr = currentFilters.filter.parameter_values.reduce((acc: any[], param) => {
        const cropParam = cropParams.find(item => item.id === param.parameter_id);
        if (cropParam && cropParam.type === "number") {
          const text = cropParams.find(item => item.id === param.parameter_id)?.name;
          if (text && text.length > 0) {
            acc.push({
              ...param,
              text: `${text}: ${param.value}`,
              type: "number",
            });
          }
        }
        if (cropParam && cropParam.type === "enum" && Array.isArray(param.value)) {
          const cropParam = cropParams.find(item => item.id === param.parameter_id);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          param.value.forEach((item, index) =>
            newParams.unshift({
              ...param,
              text: item,
              value: param.value[index],
              index,
              type: "enum",
              enum: cropParam?.enum || [],
            })
          );
        }

        return acc;
      }, []);
      return [...newParams, ...newArr];
    }
  }, [currentFilters, cropParams, cropId, bestAllMyMode]);

  const handleBtnFilter = useCallback(
    (item: any) => {
      const newFilter = currentFilterOnCropId;
      if (item.type === "enum" && item.parameter_id && typeof item.index === "number") {
        const index = item.enum.findIndex(text => text === item.text);
        if (index > -1) {
          newFilter[`parameter${item.parameter_id}${item.type}${index}`] = false;
        }
      } else if (item.type === "number" && item.parameter_id) {
        newFilter[`${item.type}${item.parameter_id}`] = "";
      } else if (item.parameter_id) {
        newFilter[item.parameter_id] = "";
      }
      salePurchaseMode === "sale" ? setCurrentSaleFilter(Number(cropId), newFilter) : setCurrentPurchaseFilter(Number(cropId), newFilter);
    },
    [salePurchaseMode, cropId, currentFilterOnCropId, setCurrentSaleFilter, setCurrentPurchaseFilter]
  );

  let pageTitle = "";

  if (!!crops && !!me) {
    crops.push({
      id: 0,
      name: "Все культуры",
      vat: 0,
    });

    switch (bestAllMyMode) {
      case "best-bids":
        if (salePurchaseMode === "sale")
          pageTitle = `${crops.find(item => item.id === +cropId)?.name} • ${intl.formatMessage({
            id: "SUBHEADER.BIDS.BEST.SALE",
          })}`;
        if (salePurchaseMode === "purchase")
          pageTitle = `${crops.find(item => item.id === +cropId)?.name} • ${intl.formatMessage({
            id: "SUBHEADER.BIDS.BEST.PURCHASE",
          })}`;
        break;
      case "all-bids":
        if (salePurchaseMode === "sale")
          pageTitle = `${crops.find(item => item.id === +cropId)?.name} • ${intl.formatMessage({
            id: "SUBHEADER.BIDS.ALL.SALE",
          })}`;
        if (salePurchaseMode === "purchase")
          pageTitle = `${crops.find(item => item.id === +cropId)?.name} • ${intl.formatMessage({
            id: "SUBHEADER.BIDS.ALL.PURCHASE",
          })}`;
        break;
      case "my-bids":
        if (salePurchaseMode === "sale") pageTitle = intl.formatMessage({ id: "SUBHEADER.BIDS.MY.SALE" });
        if (salePurchaseMode === "purchase") pageTitle = intl.formatMessage({ id: "SUBHEADER.BIDS.MY.PURCHASE" });
        break;
    }
  }

  const classes = useStyles();
  const history = useHistory();
  const innerClasses = useBidsPageStyles();
  const guestPoint = useMemo(() => getPoint(), [guestLocation]);
  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [pricesModalOpen, setPricesModalOpen] = useState(false);

  const fetchAll = useCallback(() => {
    if (!!me) {
      if (["ROLE_ADMIN"].includes(me.roles[0]) && filter.minDate && filter.maxDate) {
        fetch(+cropId, salePurchaseMode, page, perPage, filter.minDate, filter.maxDate, filter.authorId);
      } else {
        fetch(+cropId, salePurchaseMode, page, perPage);
      }
    }
  }, [cropId, fetch, filter, me, page, perPage, salePurchaseMode]);

  const toggleLocationsModal = useCallback(() => setLocationModalOpen(!locationModalOpen), [locationModalOpen]);

  const isHaveRules = (user?: IUser, id?: number) => {
    return user ? accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER"]) || user.id === id : false;
  };

  const newInexactBid: IBid[] = [];
  if (bestBids?.equal && bestBids.equal.length < 10) {
    if (bestBids.inexact && bestBids.inexact.length > 0) {
      for (let i = 0; i < 10 - bestBids.equal.length; i++) {
        if (i < bestBids.inexact.length) {
          newInexactBid.push(bestBids.inexact[i]);
        }
      }
    }
  }

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editFilterSuccess) {
      enqueueSnackbar(
        editFilterSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.SAVE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editFilterError}`,
        {
          variant: editFilterSuccess ? "success" : "error",
        }
      );
      clearEditFilters();
    }
    if (editFilterSuccess) {
      setPricesModalOpen(false);
      fetchFilters(salePurchaseMode);
    }
  }, [clearEditFilters, editFilterError, editFilterSuccess, enqueueSnackbar, fetchFilters, intl, me, salePurchaseMode]);

  useEffect(() => {
    const localPoint = getPoint();
    const location = localPoint.active && !me ? localPoint : undefined;
    if (delSuccess) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.DEL.OK" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      setAlertOpen(false);
      clearDel();
    }
    if (delSuccess || editSuccess || successArchived) {
      switch (bestAllMyMode) {
        case "best-bids":
          if (salePurchaseMode === "sale") {
            if (currentSaleFilters[cropId] && cropParams && pointPrices) {
              const newFilter = filterForBids(
                currentSaleFilters[cropId] || {},
                cropParams.filter(item => item.type === "enum"),
                cropParams.filter(item => item.type === "number"),
                pointPrices
              );
              fetchBestBids(salePurchaseMode, { ...newFilter, filter: { ...newFilter.filter, location } });
              setCurrentFilters(newFilter);
            }
            if (cropId && !currentSaleFilters[cropId]) {
              fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId, location } });
              setCurrentFilters({ filter: { cropId: +cropId } });
            }
          }
          if (salePurchaseMode === "purchase") {
            if (currentPurchaseFilters[cropId] && cropParams && pointPrices) {
              const newFilter = filterForBids(
                currentPurchaseFilters[cropId] || {},
                cropParams.filter(item => item.type === "enum"),
                cropParams.filter(item => item.type === "number"),
                pointPrices
              );
              fetchBestBids(salePurchaseMode, { ...newFilter, filter: { ...newFilter.filter, location } });
              setCurrentFilters(newFilter);
            }
            if (cropId && !currentPurchaseFilters[cropId]) {
              fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId, location } });
              setCurrentFilters({ filter: { cropId: +cropId } });
            }
          }
          break;
        case "my-bids":
          fetchMyBids(salePurchaseMode, page, perPage);
          break;
        case "all-bids":
          fetchAll();
          break;
      }
    }
  }, [
    bestAllMyMode,
    clearDel,
    cropId,
    cropParams,
    currentPurchaseFilters,
    currentSaleFilters,
    delError,
    delSuccess,
    enqueueSnackbar,
    fetch,
    fetchBestBids,
    fetchMyBids,
    intl,
    page,
    perPage,
    salePurchaseMode,
    pointPrices,
    fetchAll,
    editSuccess,
    guestLocation,
    me,
    successArchived,
  ]);

  useEffect(() => {
    fetchFilters(salePurchaseMode);
  }, [fetch, fetchFilters, me, salePurchaseMode]);

  useEffect(() => {
    if (+cropId) fetchCropParams(+cropId);
  }, [cropId, fetchCropParams]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    // if (!!me) {
    const localPoint = getPoint();
    const location = localPoint.active && !me ? localPoint : undefined;
    switch (bestAllMyMode) {
      case "best-bids":
        if (salePurchaseMode === "sale") {
          if (currentSaleFilters[cropId] && cropParams && pointPrices) {
            const newFilter = filterForBids(
              currentSaleFilters[cropId] || {},
              cropParams.filter(item => item.type === "enum"),
              cropParams.filter(item => item.type === "number"),
              pointPrices
            );
            fetchBestBids(salePurchaseMode, { ...newFilter, filter: { ...newFilter.filter, location } });
            setCurrentFilters(newFilter);
          }
          if (cropId && !currentSaleFilters[cropId]) {
            fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId, location } });
            setCurrentFilters({ filter: { cropId: +cropId } });
          }
        }
        if (salePurchaseMode === "purchase") {
          if (currentPurchaseFilters[cropId] && cropParams && pointPrices) {
            const newFilter = filterForBids(
              currentPurchaseFilters[cropId] || {},
              cropParams.filter(item => item.type === "enum"),
              cropParams.filter(item => item.type === "number"),
              pointPrices
            );
            fetchBestBids(salePurchaseMode, { ...newFilter, filter: { ...newFilter.filter, location } });
            setCurrentFilters(newFilter);
          }
          if (cropId && !currentPurchaseFilters[cropId]) {
            fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId, location } });
            setCurrentFilters({ filter: { cropId: +cropId } });
          }
        }
        break;
      case "my-bids":
        fetchMyBids(salePurchaseMode, page, perPage);
        break;
      case "all-bids":
        fetchAll();
        break;
    }
    // }
  }, [
    bestAllMyMode,
    cropId,
    cropParams,
    currentPurchaseFilters,
    currentSaleFilters,
    fetch,
    fetchBestBids,
    fetchMyBids,
    me,
    page,
    perPage,
    salePurchaseMode,
    filter,
    pointPrices,
    fetchAll,
    guestLocation,
  ]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (cropId && me && ["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) && filter.minDate && filter.maxDate) {
      let formattedMinDate = format(filter.minDate, "yyyy-MM-dd");
      let formattedMaxDate = format(filter.maxDate, "yyyy-MM-dd");

      fetchBidsXlsUrl(+cropId, salePurchaseMode, formattedMinDate, formattedMaxDate, filter.authorId);
    }
  }, [fetchBidsXlsUrl, cropId, salePurchaseMode, me, filter]);

  const exportFileToXlsx = () => {
    if (bidsXlsUrl) {
      const blob = new Blob([bidsXlsUrl], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fileSaver.saveAs(blob, `Выгрузка объявлений ${dateForExcel}.xlsx`);
    }
  };

  useShowErrors([error, bestError, myError, cropsError, cropParamsError, bidsXlsUrlError, editError]);

  if (error || bestError || myError || cropsError || cropParamsError || bidsXlsUrlError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <>
      {/* <Prompter /> */}
      <LayoutSubheader title={pageTitle} />
      <div className={innerClasses.topContainer}>
        <div className={innerClasses.leftButtonBlock}>
          {me && (
            <div className={innerClasses.wrapperAddBid}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  history.push(
                    `/bid/create/${
                      (!!me && ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"].includes(me.roles[0])) || bestAllMyMode === "my-bids"
                        ? salePurchaseMode
                        : salePurchaseMode === "sale"
                        ? "purchase"
                        : "sale"
                    }/0${!!cropId ? "/" + cropId : ""}`
                  )
                }
                className={innerClasses.btnAddBid}
              >
                {intl.formatMessage({ id: "BIDSLIST.BUTTON.CREATE_BID" })}
              </Button>

              {["ROLE_ADMIN", "ROLE_MANAGER"].includes(me.roles[0]) && bestAllMyMode === "all-bids" && (
                <Button className={innerClasses.btnExcel} variant="contained" color="primary" onClick={() => exportFileToXlsx()}>
                  {intl.formatMessage({ id: "BID.EXPORT.EXCEL" })}
                </Button>
              )}
            </div>
          )}
          {currentCropName && (
            <div className={innerClasses.wrapperBtnFilters}>
              <b className={innerClasses.cropNameText}>
                {cropParameters && cropParameters.length > 0 ? (
                  <>
                    {currentCropName}:
                    {cropParameters.map((item, index) => (
                      <Button
                        key={index}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleBtnFilter(item)}
                        className={innerClasses.btnFilter}
                      >
                        <CardMedia
                          component="img"
                          title="image"
                          image={toAbsoluteUrl("/images/Group3.png")}
                          className={innerClasses.imgBtnFilter}
                        />
                        <div className={innerClasses.btnFilterText}>{item.text}</div>
                      </Button>
                    ))}
                  </>
                ) : (
                  <>{currentCropName}</>
                )}
              </b>
            </div>
          )}
        </div>
      </div>

      {me && ["ROLE_ADMIN"].includes(me.roles[0]) && bestAllMyMode === "all-bids" && (
        <div className={innerClasses.totalText}>
          {intl.formatMessage({ id: "BIDSLIST.TABLE.TOTAL" })}: {total}
        </div>
      )}

      {bestAllMyMode === "best-bids" && (
        <>
          <div className={innerClasses.topSpaceContainer}>
            <BidsList
              classes={classes}
              bids={bestBids?.equal}
              isHaveRules={isHaveRules}
              handleDeleteDialiog={(id: number) => {
                setDeleteBidId(id);
                setAlertOpen(true);
              }}
              user={me as IUser}
              title={intl.formatMessage({ id: "BIDLIST.TITLE.BEST" })}
              loading={editLoading || !bestBids || !cropParams}
              salePurchaseMode={salePurchaseMode}
              bestAllMyMode={bestAllMyMode}
              crops={crops}
              setProfit={setProfit}
              points={me?.points}
              numberParams={numberParams}
              toggleLocationsModal={toggleLocationsModal}
              archive={({ id, is_archived }) => (is_archived ? archivedBid(id) : edit(id, { archived_to: null }))}
              currentCropName={currentCropName}
              guestPoint={guestPoint}
            />
          </div>
          {newInexactBid.length > 0 && (
            <div className={innerClasses.topSpaceContainer}>
              <BidsList
                classes={classes}
                bids={newInexactBid}
                isHaveRules={isHaveRules}
                handleDeleteDialiog={(id: number) => {
                  setDeleteBidId(id);
                  setAlertOpen(true);
                }}
                user={me as IUser}
                title={intl.formatMessage({ id: "BIDLIST.TITLE.NO_FULL" })}
                loading={editLoading || !bestBids || !cropParams}
                salePurchaseMode={salePurchaseMode}
                bestAllMyMode={bestAllMyMode}
                crops={crops}
                setProfit={setProfit}
                points={me?.points}
                numberParams={numberParams}
                toggleLocationsModal={toggleLocationsModal}
                archive={({ id, is_archived }) => (is_archived ? archivedBid(id) : edit(id, { archived_to: null }))}
                currentCropName={currentCropName}
                guestPoint={guestPoint}
              />
            </div>
          )}
          {!!bestBids && (!!bestBids.equal.length || !!bestBids.inexact.length) && (
            <div className={innerClasses.text}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>
          )}
          <LocationBlock
            handleClickLocation={() => {
              setLocationModalOpen(true);
            }}
            handleClickPrices={() => {
              setPricesModalOpen(true);
            }}
            locations={me && me.points}
            me={me}
            salePurchaseMode={salePurchaseMode}
          />
        </>
      )}

      {bestAllMyMode === "my-bids" && (
        <>
          <BidsList
            classes={classes}
            bids={myBids}
            isHaveRules={isHaveRules}
            handleDeleteDialiog={(id: number) => {
              setDeleteBidId(id);
              setAlertOpen(true);
            }}
            paginationData={{ page, perPage, total }}
            fetcher={(newPage: number, newPerPage: number) => fetchMyBids(salePurchaseMode, newPage, newPerPage)}
            user={me as IUser}
            loading={editLoading || !myBids}
            addUrl={"fromMy"}
            salePurchaseMode={salePurchaseMode}
            bestAllMyMode={bestAllMyMode}
            crops={crops}
            setProfit={setProfit}
            points={me?.points}
            numberParams={numberParams}
            toggleLocationsModal={toggleLocationsModal}
            archive={({ id, is_archived }) => (is_archived ? archivedBid(id) : edit(id, { archived_to: null }))}
            currentCropName={currentCropName}
            guestPoint={guestPoint}
          />
          {!!myBids && !!myBids.length && <div className={innerClasses.text}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>}
        </>
      )}

      {bestAllMyMode === "all-bids" && (
        <div style={{ backgroundColor: bids && bids.length ? "#fff" : "initial" }}>
          <BidTable
            classes={classes}
            bids={bids}
            isHaveRules={isHaveRules}
            handleDeleteDialiog={(id: number) => {
              setDeleteBidId(id);
              setAlertOpen(true);
            }}
            user={me as IUser}
            loading={!bids || (!cropParams && cropId !== "0")}
            paginationData={{ page, perPage, total }}
            fetcher={(newPage: number, newPerPage: number) =>
              fetch(+cropId, salePurchaseMode, newPage, newPerPage, filter.minDate, filter.maxDate)
            }
            filter={filter}
            addUrl={"fromAdmin"}
            salePurchaseMode={salePurchaseMode}
            bestAllMyMode={bestAllMyMode}
            crops={crops}
            setProfit={setProfit}
          />
          {!!bids && !!bids.length && <div className={innerClasses.text}>{intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}</div>}
        </div>
      )}
      <LocationDialog isOpen={locationModalOpen} handleClose={() => setLocationModalOpen(false)} user={me} classes={classes} intl={intl} />
      <PricesDialog isOpen={pricesModalOpen} handleClose={() => setPricesModalOpen(false)} intl={intl} cropId={+cropId} />
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({ id: "BIDSLIST.DIALOGS.DELETE_TEXT" })}
        okText={intl.formatMessage({
          id: "USERLIST.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "USERLIST.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => del(deleteBidId)}
        loadingText={intl.formatMessage({
          id: "BIDSLIST.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    activeStep: state.prompter.activeStep,
    prompterRunning: state.prompter.running,
    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,

    page: state.bids.page,
    perPage: state.bids.per_page,
    total: state.bids.total,

    filter: state.bids.filter,

    bids: state.bids.bids,
    loading: state.bids.loading,
    error: state.bids.error,

    bestBids: state.bids.bestBids,
    bestLoading: state.bids.bestLoading,
    bestError: state.bids.bestError,

    myBids: state.bids.myBids,
    myLoading: state.bids.myLoading,
    myError: state.bids.myError,

    crops: state.crops2.crops,
    cropsLoading: state.crops2.loading,
    cropsError: state.crops2.error,

    cropParams: state.crops2.cropParams,
    cropParamsLoading: state.crops2.cropParamsLoading,
    cropParamsError: state.crops2.cropParamsError,

    createLoading: state.bids.createLoading,
    createSuccess: state.bids.createSuccess,
    createError: state.bids.createError,

    editLoading: state.bids.editLoading,
    editSuccess: state.bids.editSuccess,
    editError: state.bids.editError,

    editFilterLoading: state.myFilters.editLoading,
    editFilterSuccess: state.myFilters.editSuccess,
    editFilterError: state.myFilters.editError,

    delLoading: state.bids.delLoading,
    delSuccess: state.bids.delSuccess,
    delError: state.bids.delError,

    pointPrices: state.myFilters.pointPrices,

    bidsXlsUrl: state.bids.bidsXlsUrl,
    bidsXlsUrlLoading: state.bids.bidsXlsLoading,
    bidsXlsUrlSuccess: state.bids.bidsXlsSuccess,
    bidsXlsUrlError: state.bids.bidsXlsError,
    guestLocation: state.locations.guestLocationChange,
  }),
  {
    fetchMe: authActions.fetchRequest,

    fetch: bidsActions.fetchRequest,
    fetchBestBids: bidsActions.fetchBestRequest,
    fetchMyBids: bidsActions.fetchMyRequest,

    clearCreate: bidsActions.clearCreate,
    create: bidsActions.createRequest,

    clearEdit: bidsActions.clearEdit,
    edit: bidsActions.editRequest,

    clearDel: bidsActions.clearDel,
    del: bidsActions.delRequest,

    setProfit: bidsActions.setProfit,

    setActiveStep: prompterActions.setActiveStep,
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,
    fetchCrops: crops2Actions.fetchRequest,
    fetchCropParams: crops2Actions.cropParamsRequest,

    fetchFilters: myFiltersActions.fetchRequest,
    clearEditFilters: myFiltersActions.clearEdit,

    clearBidsXlsUrl: bidsActions.clearBidsXlsUrl,
    fetchBidsXlsUrl: bidsActions.bidsXlsUrlRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(BidsPage);
