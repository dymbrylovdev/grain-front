import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper, Button, makeStyles } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import CustomIcon from "../../../components/ui/Images/CustomIcon";
import { useSnackbar } from "notistack";

import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { actions as prompterActions } from "../../../store/ducks/prompter.duck";
import { actions as myFiltersActions } from "../../../store/ducks/myFilters.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { ErrorPage } from "../../../components/ErrorPage";
import FilterModal from "./components/filter/FilterModal";
import LocationBlock from "./components/location/LocationBlock";
import PricesDialog from "./components/prices/PricesDialog";
import LocationDialog from "./components/location/LocationDialog";
import Prompter from "../prompter/Prompter";
import BidTable from "./components/BidTable";
import { IUser } from "../../../interfaces/users";
import { filterForBids } from "../myFilters/utils";
import { LayoutSubheader } from "../../../../_metronic";

const useInnerStyles = makeStyles(theme => ({
  topContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginTop: theme.spacing(2),
  },
  leftButtonBlock: {
    flex: 1,
  },
  filterText: {
    width: 300,
    textAlign: "right",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  topSpaceContainer: {
    marginBottom: theme.spacing(2),
  },
  text: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  iconButton: {
    animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
  },
}));

const BidsPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{ cropId: string }>> = ({
  match: {
    params: { cropId },
  },
  match,

  intl,

  me,
  activeStep,
  setActiveStep,
  currentSaleFilters,
  setCurrentSaleFilter,
  currentPurchaseFilters,
  setCurrentPurchaseFilter,

  page,
  perPage,
  total,

  fetch,
  bids,
  loading,
  error,

  fetchBestBids,
  bestBids,
  bestLoading,
  bestError,

  fetchMyBids,
  myBids,
  myLoading,
  myError,

  fetchCrops,
  crops,
  cropsLoading,
  cropsError,

  fetchCropParams,
  cropParams,
  cropParamsLoading,
  cropParamsError,

  fetchFilters,
  clearEditFilters,
  editFilterLoading,
  editFilterSuccess,
  editFilterError,

  clearCreate,
  create,
  createLoading,
  createSuccess,
  createError,
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
}) => {
  let bestAllMyMode: "best-bids" | "all-bids" | "my-bids" = "best-bids";
  if (match.url.indexOf("best-bids") !== -1) bestAllMyMode = "best-bids";
  if (match.url.indexOf("all-bids") !== -1) bestAllMyMode = "all-bids";
  if (match.url.indexOf("my-bids") !== -1) bestAllMyMode = "my-bids";

  let salePurchaseMode: "sale" | "purchase" = "sale";
  if (match.url.indexOf("sale") !== -1) salePurchaseMode = "sale";
  if (match.url.indexOf("purchase") !== -1) salePurchaseMode = "purchase";

  let pageTitle = "";
  if (!!crops) {
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
        if (salePurchaseMode === "sale")
          pageTitle = intl.formatMessage({ id: "SUBHEADER.BIDS.MY.SALE" });
        if (salePurchaseMode === "purchase")
          pageTitle = intl.formatMessage({ id: "SUBHEADER.BIDS.MY.PURCHASE" });
        break;
    }
  }

  const classes = useStyles();
  const history = useHistory();
  const innerClasses = useInnerStyles();

  const [deleteBidId, setDeleteBidId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [pricesModalOpen, setPricesModalOpen] = useState(false);

  const filterTitle =
    salePurchaseMode === "sale"
      ? !currentSaleFilters[cropId]
        ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.EMPTY" })
        : !currentSaleFilters[cropId]?.id
        ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.FULL" })
        : `${intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.WITH_NAME" })}`
      : salePurchaseMode === "purchase"
      ? !currentPurchaseFilters[cropId]
        ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.EMPTY" })
        : !currentPurchaseFilters[cropId]?.id
        ? intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.FULL" })
        : `${intl.formatMessage({ id: "BIDLIST.FILTER.STATUS.WITH_NAME" })}`
      : "";

  const filterName =
    salePurchaseMode === "sale"
      ? currentSaleFilters[cropId] &&
        currentSaleFilters[cropId]?.id &&
        currentSaleFilters[cropId]?.name
        ? currentSaleFilters[cropId]?.name
        : ""
      : salePurchaseMode === "purchase"
      ? currentPurchaseFilters[cropId] &&
        currentPurchaseFilters[cropId]?.id &&
        currentPurchaseFilters[cropId]?.name
        ? currentPurchaseFilters[cropId]?.name
        : ""
      : "";

  const filterIconPath =
    salePurchaseMode === "sale"
      ? !currentSaleFilters[cropId]
        ? "/media/filter/filter.svg"
        : "/media/filter/filter_full.svg"
      : salePurchaseMode === "purchase"
      ? !currentPurchaseFilters[cropId]
        ? "/media/filter/filter.svg"
        : "/media/filter/filter_full.svg"
      : "";

  const isHaveRules = (user: any, id: number) => {
    return user.is_admin || user.id === id;
  };

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (editFilterSuccess || editFilterError) {
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
      fetchFilters(salePurchaseMode);
    }
  }, [
    clearEditFilters,
    editFilterError,
    editFilterSuccess,
    enqueueSnackbar,
    fetchFilters,
    intl,
    me,
    salePurchaseMode,
  ]);

  useEffect(() => {
    if (delSuccess || delError) {
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
    if (delSuccess) {
      switch (bestAllMyMode) {
        case "best-bids":
          if (salePurchaseMode === "sale") {
            if (currentSaleFilters[cropId] && cropParams) {
              fetchBestBids(
                salePurchaseMode,
                filterForBids(
                  currentSaleFilters[cropId] || {},
                  cropParams.filter(item => item.type === "enum"),
                  cropParams.filter(item => item.type === "number")
                )
              );
            }
            if (cropId && !currentSaleFilters[cropId])
              fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId } });
          }
          if (salePurchaseMode === "purchase") {
            if (currentPurchaseFilters[cropId] && cropParams) {
              fetchBestBids(
                salePurchaseMode,
                filterForBids(
                  currentPurchaseFilters[cropId] || {},
                  cropParams.filter(item => item.type === "enum"),
                  cropParams.filter(item => item.type === "number")
                )
              );
            }
            if (cropId && !currentPurchaseFilters[cropId])
              fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId } });
          }
          break;
        case "my-bids":
          fetchMyBids(salePurchaseMode);
          break;
        case "all-bids":
          fetch(+cropId, salePurchaseMode, page, perPage);
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
    if (!!me) {
      switch (bestAllMyMode) {
        case "best-bids":
          if (salePurchaseMode === "sale") {
            if (currentSaleFilters[cropId] && cropParams) {
              fetchBestBids(
                salePurchaseMode,
                filterForBids(
                  currentSaleFilters[cropId] || {},
                  cropParams.filter(item => item.type === "enum"),
                  cropParams.filter(item => item.type === "number")
                )
              );
            }
            if (cropId && !currentSaleFilters[cropId])
              fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId } });
          }
          if (salePurchaseMode === "purchase") {
            if (currentPurchaseFilters[cropId] && cropParams) {
              fetchBestBids(
                salePurchaseMode,
                filterForBids(
                  currentPurchaseFilters[cropId] || {},
                  cropParams.filter(item => item.type === "enum"),
                  cropParams.filter(item => item.type === "number")
                )
              );
            }
            if (cropId && !currentPurchaseFilters[cropId])
              fetchBestBids(salePurchaseMode, { filter: { cropId: +cropId } });
          }
          break;
        case "my-bids":
          fetchMyBids(salePurchaseMode);
          break;
        case "all-bids":
          fetch(+cropId, salePurchaseMode, page, perPage);
          break;
      }
    }
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
  ]);

  if (error) return <ErrorPage />;

  return (
    <>
      <Prompter />
      <LayoutSubheader title={pageTitle} />
      <Paper className={classes.tableContainer}>
        <div className={innerClasses.topContainer}>
          <div className={innerClasses.leftButtonBlock}>
            {me && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(`/bid/create${!cropId ? "" : "/crop/" + cropId}`)}
              >
                {intl.formatMessage({ id: "BIDSLIST.BUTTON.CREATE_BID" })}
              </Button>
            )}
          </div>

          {bestAllMyMode === "best-bids" && (
            <>
              <div className={innerClasses.filterText}>
                {filterTitle}
                <br />
                {filterName}
              </div>
              <IconButton
                className={activeStep === 3 ? innerClasses.iconButton : ""}
                onClick={() => {
                  setFilterModalOpen(true);
                  setActiveStep(4);
                }}
              >
                <CustomIcon path={filterIconPath} />
              </IconButton>
            </>
          )}
        </div>

        {bestAllMyMode === "best-bids" && (
          <>
            <BidTable
              classes={classes}
              bids={bestBids?.equal}
              isHaveRules={isHaveRules}
              handleDeleteDialiog={(id: number) => {
                setDeleteBidId(id);
                setAlertOpen(true);
              }}
              user={me as IUser}
              title={intl.formatMessage({ id: "BIDLIST.TITLE.BEST" })}
              loading={!bestBids || !cropParams}
              salePurchaseMode={salePurchaseMode}
            />
            <div className={innerClasses.topSpaceContainer}>
              <BidTable
                classes={classes}
                bids={bestBids?.inexact}
                isHaveRules={isHaveRules}
                handleDeleteDialiog={(id: number) => {
                  setDeleteBidId(id);
                  setAlertOpen(true);
                }}
                user={me as IUser}
                title={intl.formatMessage({ id: "BIDLIST.TITLE.NO_FULL" })}
                loading={!bestBids || !cropParams}
                salePurchaseMode={salePurchaseMode}
              />
            </div>
            {!!bestBids && (!!bestBids.equal.length || !!bestBids.inexact.length) && (
              <div className={innerClasses.text}>
                {intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}
              </div>
            )}
            <LocationBlock
              handleClickLocation={() => {
                setLocationModalOpen(true);
              }}
              handleClickPrices={() => {
                setPricesModalOpen(true);
              }}
              locations={me && me.points}
            />
          </>
        )}

        {bestAllMyMode === "my-bids" && (
          <>
            <BidTable
              classes={classes}
              bids={myBids}
              isHaveRules={isHaveRules}
              handleDeleteDialiog={(id: number) => {
                setDeleteBidId(id);
                setAlertOpen(true);
              }}
              user={me as IUser}
              loading={!myBids}
              addUrl={"fromMy"}
            />
            {!!myBids && !!myBids.length && (
              <div className={innerClasses.text}>
                {intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}
              </div>
            )}
          </>
        )}

        {bestAllMyMode === "all-bids" && (
          <>
            <BidTable
              classes={classes}
              bids={bids}
              isHaveRules={isHaveRules}
              handleDeleteDialiog={(id: number) => {
                setDeleteBidId(id);
                setAlertOpen(true);
              }}
              user={me as IUser}
              loading={!bids || !cropParams}
              paginationData={{ page, perPage, total }}
              fetcher={(newPage: number, newPerPage: number) =>
                fetch(+cropId, salePurchaseMode, newPage, newPerPage)
              }
              addUrl={"fromAdmin"}
            />
            {!!bids && !!bids.length && (
              <div className={innerClasses.text}>
                {intl.formatMessage({ id: "BID.BOTTOM.TEXT" })}
              </div>
            )}
          </>
        )}

        <FilterModal
          isOpen={filterModalOpen}
          handleClose={() => setFilterModalOpen(false)}
          classes={classes}
          handleSubmit={(values: any) => {
            setFilterModalOpen(false);
            if (salePurchaseMode === "sale")
              setCurrentSaleFilter(+cropId, { ...values, cropId: +cropId });
            if (salePurchaseMode === "purchase")
              setCurrentPurchaseFilter(+cropId, { ...values, cropId: +cropId });
          }}
          cropId={+cropId}
          enumParams={cropParams && cropParams.filter(item => item.type === "enum")}
          numberParams={cropParams && cropParams.filter(item => item.type === "number")}
          currentFilter={
            salePurchaseMode === "sale"
              ? currentSaleFilters[cropId]
              : currentPurchaseFilters[cropId]
          }
          setCurrentFilter={
            salePurchaseMode === "sale" ? setCurrentSaleFilter : setCurrentPurchaseFilter
          }
          salePurchaseMode={salePurchaseMode}
        />
        <LocationDialog
          isOpen={locationModalOpen}
          handleClose={() => setLocationModalOpen(false)}
          user={me}
          classes={classes}
          intl={intl}
        />
        <PricesDialog
          isOpen={pricesModalOpen}
          handleClose={() => setPricesModalOpen(false)}
          intl={intl}
          cropId={+cropId}
        />
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
      </Paper>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    activeStep: state.prompter.activeStep,
    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,

    page: state.bids.page,
    perPage: state.bids.per_page,
    total: state.bids.total,

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
  }),
  {
    fetch: bidsActions.fetchRequest,
    fetchBestBids: bidsActions.fetchBestRequest,
    fetchMyBids: bidsActions.fetchMyRequest,

    clearCreate: bidsActions.clearCreate,
    create: bidsActions.createRequest,

    clearEdit: bidsActions.clearEdit,
    edit: bidsActions.editRequest,

    clearDel: bidsActions.clearDel,
    del: bidsActions.delRequest,

    setActiveStep: prompterActions.setActiveStep,
    setCurrentSaleFilter: myFiltersActions.setCurrentSaleFilter,
    setCurrentPurchaseFilter: myFiltersActions.setCurrentPurchaseFilter,
    fetchCrops: crops2Actions.fetchRequest,
    fetchCropParams: crops2Actions.cropParamsRequest,

    fetchFilters: myFiltersActions.fetchRequest,
    clearEditFilters: myFiltersActions.clearEdit,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(BidsPage);
