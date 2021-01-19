import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Paper } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { actions as bidsActions } from "../../../store/ducks/bids.duck";
import { actions as prompterActions } from "../../../store/ducks/prompter.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";
import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as yaLocationsActions } from "../../../store/ducks/yaLocations.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as myFiltersActions } from '../../../store/ducks/myFilters.duck';

import { IAppState } from "../../../store/rootDuck";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";
import BidForm from "./components/BidForm";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import Prompter from "../prompter/Prompter";
import useStyles from "../styles";
import { accessByRoles } from "../../../utils/utils";
import { IPointPriceForGet } from "../../../interfaces/bids";

const BidEditPage: React.FC<TPropsFromRedux &
  WrappedComponentProps &
  RouteComponentProps<{
    editMode: string;
    salePurchaseMode: string;
    bidId: string;
    cropId: string;
    vendorId: string;
  }>> = ({
  match: {
    params: { editMode, salePurchaseMode, bidId, cropId, vendorId },
  },
  match,

  intl,

  fetchMe,
  me,

  fetchUser,
  user,
  userLoading,
  userError,

  setActiveStep,

  clearFetch,
  fetch,
  bid,
  loading,
  error,

  clearBidsPair,
  fetchBidsPair,
  bidsPair,
  bidsPairLoading,
  bidsPairSuccess,
  bidsPairError,

  fetchCrops,
  crops,
  cropsLoading,
  cropsError,

  clearCropParams,
  fetchCropParams,
  cropParams,
  cropParamsLoading,
  cropParamsError,

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

  clearPost,
  post,
  postLoading,
  postSuccess,
  postError,

  editContactViewCount,

  fetchLocations,
  clearLocations,
  locations,
  loadingLocations,

  profit,

  currentSaleFilters,
  currentPurchaseFilters,

  openInfoAlert,
  setOpenInfoAlert,
}) => {
  const isNoModerate = !vendorId && !+bidId && me?.status === "На модерации";
  const classes = useStyles();
  const history = useHistory();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [pointPrices, setPointPrices] = useState<IPointPriceForGet[]>([]);

  useEffect(() => {
    const currentFilters =
      salePurchaseMode === "sale" ? currentSaleFilters : currentPurchaseFilters;
    let currentFilter: { [crop: string]: { [x: string]: any } } | undefined = undefined;
    if (editMode === "view") {
      for (let k in currentFilters) {
        if (k === cropId) {
          currentFilter = currentFilters[k];
        }
      }
    }
    const pointPrices: IPointPriceForGet[] = [];
    if (currentFilter?.point_prices && currentFilter.point_prices.length) {
      currentFilter.point_prices.forEach((item: any) => {
        pointPrices.push(item);
      });
    }
    setPointPrices(pointPrices);
  }, [salePurchaseMode, currentSaleFilters, currentPurchaseFilters, editMode, cropId]);

  const { enqueueSnackbar } = useSnackbar();

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
      if (delSuccess) history.goBack();
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.EDIT" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEdit();
      if (editSuccess) history.goBack();
    }
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    if (+bidId) fetch(+bidId, { filter: { point_prices: pointPrices } });
    return () => {
      clearFetch();
    };
  }, [bidId, clearFetch, fetch, pointPrices]);

  useEffect(() => {
    if (!bid) {
      if (vendorId) {
        fetchUser({ id: +vendorId });
      }
    } else {
      fetchUser({ id: bid.vendor.id });
    }
  }, [bid, fetchUser, vendorId]);

  useEffect(() => {
    setActiveStep(4);
  }, [setActiveStep]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  let title = "string";
  if (editMode === "create" && !vendorId) title = intl.formatMessage({ id: "BID.TITLE.CREATE" });
  if (editMode === "create" && !!vendorId && !!user && user.id === +vendorId)
    title = `${intl.formatMessage({ id: "BID.TITLE.BY_VENDOR" })} [ ${user.login} ]`;
  if (editMode === "view") title = intl.formatMessage({ id: "BID.TITLE.VIEW" });
  if (editMode === "edit") title = intl.formatMessage({ id: "BID.TITLE.EDIT" });

  if (!+bidId && (editMode === "edit" || editMode === "view")) return <ErrorPage />;
  if (!(editMode === "create" || editMode === "edit" || editMode === "view")) return <ErrorPage />;
  if (!(salePurchaseMode === "sale" || salePurchaseMode === "purchase")) return <ErrorPage />;
  if (editMode === "create" && me?.is_buyer && salePurchaseMode === "sale") return <ErrorPage />;
  if (editMode === "create" && me?.is_vendor && salePurchaseMode === "purchase")
    return <ErrorPage />;
  if (
    editMode === "edit" &&
    me &&
    !accessByRoles(me, ["ROLE_ADMIN", "ROLE_MANAGER"]) &&
    !!bid &&
    bid.vendor.id !== me?.id
  )
    return <ErrorPage />;
  if (
    !!user &&
    !!vendorId &&
    user.id === +vendorId &&
    editMode === "create" &&
    user.is_buyer &&
    salePurchaseMode !== "purchase"
  )
    return <ErrorPage />;
  if (
    !!user &&
    !!vendorId &&
    user.id === +vendorId &&
    editMode === "create" &&
    user.is_vendor &&
    salePurchaseMode !== "sale"
  )
    return <ErrorPage />;

  if (error || userError || cropsError || cropParamsError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <>
      <Prompter />
      <Paper className={classes.paperWithForm}>
        {title && <LayoutSubheader title={title} />}
        {isNoModerate ? (
          <div className={classes.titleText}>
            {intl.formatMessage({ id: "BID.STATUS.NO_MODERATE" })}
          </div>
        ) : (
          <BidForm
            intl={intl}
            vendorId={+vendorId}
            user={user}
            editMode={editMode}
            salePurchaseMode={salePurchaseMode}
            cropId={+cropId}
            crops={crops}
            bid={editMode === "create" ? undefined : bid}
            bidsPair={bidsPair}
            me={me}
            fetchLocations={fetchLocations}
            locations={locations}
            clearBidsPair={clearBidsPair}
            fetchBidsPair={fetchBidsPair}
            bidsPairError={bidsPairError}
            loadingLocations={loadingLocations}
            clearLocations={clearLocations}
            clearCropParams={clearCropParams}
            fetchCropParams={fetchCropParams}
            cropParams={cropParams}
            cropParamsLoading={cropParamsLoading}
            setAlertOpen={setAlertOpen}
            buttonLoading={createLoading || editLoading || postLoading}
            create={create}
            createSuccess={createSuccess}
            createError={createError}
            clearCreate={clearCreate}
            post={post}
            postSuccess={postSuccess}
            postError={postError}
            clearPost={clearPost}
            edit={edit}
            profit={profit}
            openInfoAlert={openInfoAlert}
            setOpenInfoAlert={setOpenInfoAlert}
            editContactViewCount={editContactViewCount}
          />
        )}
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
          handleAgree={() => del(+bidId)}
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

    user: state.users.user,
    userLoading: state.users.byIdLoading,
    userError: state.users.byIdError,

    bid: state.bids.bid,
    loading: state.bids.byIdLoading,
    error: state.bids.byIdError,

    bidsPair: state.bids.bidsPair,
    bidsPairLoading: state.bids.bidsPairLoading,
    bidsPairSuccess: state.bids.bidsPairSuccess,
    bidsPairError: state.bids.bidsPairError,

    profit: state.bids.profit,

    currentSaleFilters: state.myFilters.currentSaleFilters,
    currentPurchaseFilters: state.myFilters.currentPurchaseFilters,

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

    delLoading: state.bids.delLoading,
    delSuccess: state.bids.delSuccess,
    delError: state.bids.delError,

    postLoading: state.myFilters.postLoading,
    postSuccess: state.myFilters.postSuccess,
    postError: state.myFilters.postError,

    contactViewCountLoading: state.users.contactViewCountLoading,
    contactViewCountSuccess: state.users.contactViewCountSuccess,
    contactViewCountError: state.users.contactViewCountError,

    locations: state.yaLocations.yaLocations,
    loadingLocations: state.yaLocations.loading,

    openInfoAlert: state.bids.openInfoAlert,
  }),
  {
    fetchUser: usersActions.fetchByIdRequest,

    editContactViewCount: usersActions.contactViewCountRequest,

    fetchMe: authActions.fetchRequest,

    clearFetch: bidsActions.clearFetchById,
    fetch: bidsActions.fetchByIdRequest,

    clearBidsPair: bidsActions.clearBidsPair,
    fetchBidsPair: bidsActions.fetchBidsPair,

    clearCreate: bidsActions.clearCreate,
    create: bidsActions.createRequest,

    clearEdit: bidsActions.clearEdit,
    edit: bidsActions.editRequest,

    clearDel: bidsActions.clearDel,
    del: bidsActions.delRequest,

    clearPost: myFiltersActions.clearPost,
    post: myFiltersActions.postFilter,

    setActiveStep: prompterActions.setActiveStep,
    fetchCrops: crops2Actions.fetchRequest,
    clearCropParams: crops2Actions.clearCropParams,
    fetchCropParams: crops2Actions.cropParamsRequest,

    fetchLocations: yaLocationsActions.fetchRequest,
    clearLocations: yaLocationsActions.clear,

    setOpenInfoAlert: bidsActions.setOpenInfoAlert,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(BidEditPage);
