import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import BidForm from "./components/BidForm";
import useStyles from "../styles";
import userSelector from "../../../store/selectors/user";
// import bidSelector from "../../../store/selectors/bid";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import * as bids from "../../../store/ducks/bids.duck";
import * as yaLocations from "../../../store/ducks/yaLocations.duck";
import * as auth from "../../../store/ducks/auth.duck";
import * as crops from "../../../store/ducks/crops.duck";
import * as prompter from "../../../store/ducks/prompter.duck";
import * as users from "../../../store/ducks/users.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import LocationDialog from "./components/location/LocationDialog";
import { useSnackbar } from "notistack";
import { ErrorPage } from "../../../components/ErrorPage";
function BidCreatePage({
  intl,
  match,
  editBid,
  createBid,
  fetchLocationsRequest,
  clearLocations,
  fetchBidById,
  editUser,
  getCropParams,
  setActiveStep,
  fetchUser,
  clearCreateBid,
  clearEditBid,
}) {
  const classes = useStyles();
  const history = useHistory();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const {
    crops,
    user,
    fromUser,
    preloading,
    errors,
    createBidSuccess,
    createBidError,
    createBidLoading,
    editBidSuccess,
    editBidError,
    editBidLoading,
    bid,
  } = useSelector(
    ({ crops: { crops }, auth, users, bids }) => ({
      crops: (crops && crops.data) || [],
      user: auth.user,
      preloading: bids.bid && bids.byIdLoading,
      errors: bids.byIdError || {},
      fromUser: users.user,
      createBidLoading: bids.createLoading,
      createBidSuccess: bids.createSuccess,
      createBidError: bids.createError,
      editBidLoading: bids.editLoading,
      editBidSuccess: bids.editSuccess,
      editBidError: bids.editError,
      bid: bids.bid,
    }),
    shallowEqual
  );

  const creating = match.url.indexOf("create") !== -1;
  // const by =
  //   (match.url.indexOf("fromMy") !== -1 && "fromMy") ||
  //   (match.url.indexOf("fromAdmin") !== -1 && "fromAdmin");
  const vendorId = match.params.vendorId;
  const bidId = match.params.bidId;
  const cropId = match.params.cropId;
  // console.log(match.params);
  // const { bid } = bidSelector(bidId, by);
  // console.log("bid: ", bid);
  const isEditable = match.url.indexOf("view") === -1;
  const vendor_id = vendorId || (bid && bid.vendor && bid.vendor.id) || user.id;
  const isNoModerate = !vendorId && !bidId && user.is_vendor && user.status === "На модерации";

  const userRole = () => {
    // if (!!fromUser) {
    //   if (+vendor_id === user.id) {
    if (user.is_admin) return "admin";
    if (user.is_buyer) return "buyer";
    if (user.is_vendor) return "vendor";
    //   } else {
    //     if (fromUser.is_admin) return "admin";
    //     if (fromUser.is_buyer) return "buyer";
    //     if (fromUser.is_vendor) return "vendor";
    //   }
    // }
  };

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (createBidSuccess || createBidError) {
      enqueueSnackbar(
        createBidSuccess
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.ADD" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${createBidError}`,
        {
          variant: createBidSuccess ? "success" : "error",
        }
      );
      clearCreateBid();
      if (createBidSuccess) history.goBack();
    }
  }, [clearCreateBid, createBidError, createBidSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    if (editBidSuccess || editBidError) {
      enqueueSnackbar(
        editBidSuccess
          ? intl.formatMessage({ id: "NOTISTACK.BIDS.EDIT" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editBidError}`,
        {
          variant: editBidSuccess ? "success" : "error",
        }
      );
      clearEditBid();
      if (editBidSuccess) history.goBack();
    }
  }, [clearEditBid, createBidError, editBidError, editBidSuccess, enqueueSnackbar, history, intl]);

  const createAction = values => {
    const params = { ...values, vendor_id: Number(vendor_id) };
    const bidType = params.bid_type;
    delete params.bid_type;
    createBid(bidType, params);
  };

  const editAction = (values, setStatus, setSubmitting) => {
    // console.log("editValues", values);
    const params = {
      ...values,
      vendor_id,
      price: Number.parseInt(values.price),
      volume: Number.parseInt(values.volume),
    };
    delete params.bid_type;
    editBid(bid.id, params);
  };

  useEffect(() => {
    if (!!user && !creating) fetchBidById(+bidId);
  }, [user, bidId, fetchBidById, creating]);

  useEffect(() => {
    if (+vendor_id) fetchUser({ id: +vendor_id });
  }, [fetchUser, vendor_id]);

  useEffect(() => {
    setActiveStep(4);
  }, [setActiveStep]);

  const locationSubmit = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setStatus({ loading: true });
      const params = values;
      const successCallback = () => {
        setStatus({ loading: false });
        setLocationModalOpen(false);
      };
      const failCallback = () => {
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "LOCATION.STATUS.ERROR",
          }),
        });
        setSubmitting(false);
      };
      editUser(params, successCallback, failCallback);
    }, 1000);
  };

  const submitAction = !creating ? editAction : createAction;

  let title = null;
  if (creating) title = intl.formatMessage({ id: "BID.TITLE.CREATE" });
  const { user: vendor } = userSelector(vendorId);
  if (vendorId) title = `${intl.formatMessage({ id: "BID.TITLE.BY_VENDOR" })} [ ${vendor.login} ]`;
  if (!isEditable) {
    title = intl.formatMessage({ id: "BID.TITLE.VIEW" });
  } else if (bidId) {
    title = intl.formatMessage({ id: "BID.TITLE.EDIT" });
  }

  if (preloading || !fromUser || (!bid && !creating)) return <Preloader />;
  if (errors.get) return <ErrorPage />;

  return (
    <>
      {/* <Prompter /> */}
      <LocationDialog
        isOpen={locationModalOpen}
        handleClose={() => setLocationModalOpen(false)}
        submitAction={locationSubmit}
        user={user}
        classes={classes}
        intl={intl}
      />
      {title && <LayoutSubheader title={title} />}
      {isNoModerate ? (
        <div className={classes.titleText}>
          {intl.formatMessage({ id: "BID.STATUS.NO_MODERATE" })}
        </div>
      ) : (
        <BidForm
          classes={classes}
          loading={createBidLoading || editBidLoading}
          submitAction={submitAction}
          crops={crops}
          bid={!!bidId ? bid : undefined}
          isEditable={isEditable}
          fetchLocations={fetchLocationsRequest}
          clearLocations={clearLocations}
          getCropParams={getCropParams}
          openLocation={() => setLocationModalOpen(true)}
          user={user}
          bidId={bidId}
          cropId={cropId}
          userRole={userRole()}
        />
      )}
    </>
  );
}

export default injectIntl(
  connect(null, {
    ...bids.actions,
    ...auth.actions,
    ...crops.actions,
    ...prompter.actions,
    fetchLocationsRequest: yaLocations.actions.fetchRequest,
    clearLocations: yaLocations.actions.clear,
    fetchBidById: bids.actions.fetchByIdRequest,
    clearCreateBid: bids.actions.clearCreate,
    createBid: bids.actions.createRequest,
    clearEditBid: bids.actions.clearEdit,
    editBid: bids.actions.editRequest,
    fetchUser: users.actions.fetchByIdRequest,
  })(BidCreatePage)
);
