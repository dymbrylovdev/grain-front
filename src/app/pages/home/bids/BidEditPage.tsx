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

import { IAppState } from "../../../store/rootDuck";
import { ErrorPage } from "../../../components/ErrorPage";
import { LayoutSubheader } from "../../../../_metronic";
import BidForm from "./components/BidForm";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import Prompter from "../prompter/Prompter";
import useStyles from "../styles";

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

  me,

  fetchUser,
  user,
  userLoading,
  userError,

  setActiveStep,

  fetch,
  bid,
  loading,
  error,

  fetchCrops,
  crops,
  cropsLoading,
  cropsError,

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

  fetchLocations,
  clearLocations,
  locations,
  loadingLocations,
}) => {
  const isNoModerate = !vendorId && !+bidId && me?.status === "На модерации";
  const classes = useStyles();
  const history = useHistory();
  const [isAlertOpen, setAlertOpen] = useState(false);

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
    if (createSuccess || createError) {
      enqueueSnackbar(
        createSuccess
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.ADD" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createError}`,
        {
          variant: createSuccess ? "success" : "error",
        }
      );
      clearCreate();
      if (createSuccess) {
        if (!!+vendorId) {
          history.push("/user-list");
        } else {
          history.push(`/${salePurchaseMode}/my-bids`);
        }
      }
    }
  }, [
    clearCreate,
    createError,
    createSuccess,
    enqueueSnackbar,
    history,
    intl,
    salePurchaseMode,
    vendorId,
  ]);

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
    if (+bidId) fetch(+bidId);
  }, [bidId, fetch]);

  useEffect(() => {
    if (!!vendorId) fetchUser({ id: +vendorId });
  }, [fetchUser, vendorId]);

  useEffect(() => {
    setActiveStep(5);
  }, [setActiveStep]);

  let title = null;
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
  if (editMode === "edit" && !me?.is_admin && !!bid && bid.vendor.id !== me?.id)
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

  if (error || userError || cropsError || cropParamsError) return <ErrorPage />;

  return (
    <>
      <Prompter />
      <Paper className={classes.container}>
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
            me={me}
            fetchLocations={fetchLocations}
            locations={locations}
            loadingLocations={loadingLocations}
            clearLocations={clearLocations}
            fetchCropParams={fetchCropParams}
            cropParams={cropParams}
            cropParamsLoading={cropParamsLoading}
            setAlertOpen={setAlertOpen}
            buttonLoading={createLoading || editLoading}
            create={create}
            edit={edit}
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

    locations: state.yaLocations.yaLocations,
    loadingLocations: state.yaLocations.loading,
  }),
  {
    fetchUser: usersActions.fetchByIdRequest,

    fetch: bidsActions.fetchByIdRequest,

    clearCreate: bidsActions.clearCreate,
    create: bidsActions.createRequest,

    clearEdit: bidsActions.clearEdit,
    edit: bidsActions.editRequest,

    clearDel: bidsActions.clearDel,
    del: bidsActions.delRequest,

    setActiveStep: prompterActions.setActiveStep,
    fetchCrops: crops2Actions.fetchRequest,
    fetchCropParams: crops2Actions.cropParamsRequest,

    fetchLocations: yaLocationsActions.fetchRequest,
    clearLocations: yaLocationsActions.clear,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(BidEditPage);
