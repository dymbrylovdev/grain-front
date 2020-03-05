import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Redirect } from "react-router-dom";

import BidForm from "./components/BidForm";
import useStyles from "../styles";
import userSelector from "../../../store/selectors/user";
import bidSelector from "../../../store/selectors/bid";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import * as bids from "../../../store/ducks/bids.duck";
import * as locations from "../../../store/ducks/locations.duck";
import * as auth from "../../../store/ducks/auth.duck";
import * as crops from "../../../store/ducks/crops.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import LocationDialog from "./components/location/LocationDialog";
import { LoadError } from "../../../components/ui/Erros";


function BidCreatePage({
  intl,
  match,
  editBid,
  createBid,
  fetchLocationsRequest,
  clearLocations,
  getBidById,
  editUser,
  getCropParams,
}) {
  const classes = useStyles();
  const [isRedirectTo, setRedirect] = useState(-1);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { crops, user, preloading, errors } = useSelector(
    ({ crops: {crops}, auth, bids: {currentBid, errors} }) => ({
      crops: (crops && crops.data) || [],
      user: auth.user,
      preloading: currentBid && currentBid.loading,
      errors: errors || {}
    }),
    shallowEqual
  );

  const by =
    (match.url.indexOf("fromMy") !== -1 && "fromMy") ||
    (match.url.indexOf("fromAdmin") !== -1 && "fromAdmin");
  const vendorId = match.params.vendorId;
  const bidId = match.params.bidId;
  const { user: vendor } = userSelector(vendorId);
  const { bid } = bidSelector(bidId, by);
  const isEditable = match.url.indexOf("view") === -1;
  const vendor_id = vendorId || (bid && bid.vendor && bid.vendor.id) || user.id;
  const isNoModerate = !vendorId && !bidId && user.is_vendor && user.status === "На модерации";


  const createAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      const params = { ...values, vendor_id: Number(vendor_id) }
      const successCallback = () => {
        setLoading(false);
        setStatus({
          error: false,
          message: intl.formatMessage({
            id: "BID.STATUS.CREATE_SUCCESS",
          }),
        });
        setRedirect(values.crop && values.crop.id);
      }
      const failCallback = () => {
        setLoading(false);
        setSubmitting(false);
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "BID.STATUS.ERROR",
          }),
        });
      }
      createBid(params, successCallback, failCallback)
    }, 1000);
  };

  const editAction = (values, setStatus, setSubmitting) => {
    console.log("editValues", values);
    setTimeout(() => {
      setLoading(true);
      const params = {
        ...values,
        vendor_id,
        price: Number.parseInt(values.price),
        volume: Number.parseInt(values.volume),
      };
      const successCallback = () =>{ 
        setLoading(false);
        setStatus({
        error: false,
        message: intl.formatMessage({
          id: "BID.STATUS.EDIT_SUCCESS",
        }),
      });}
      const failCallback = () => {
        setLoading(false);
        setSubmitting(false);
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "BID.STATUS.ERROR",
          }),
        });
      }
      editBid(bidId, params, successCallback, failCallback);
    }, 1000);
  };

  useEffect(() => {
    getBidById(bidId, bid);
  }, [user, bidId]);// eslint-disable-line

  const locationSubmit = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setStatus({ loading: true });
      const params = values;
      const successCallback = () => {
        setStatus({ loading: false });
        setLocationModalOpen(false);
      }
      const failCallback = () => {
        setStatus({
          error: true,
          message: intl.formatMessage({
            id: "LOCATION.STATUS.ERROR",
          }),
        });
        setSubmitting(false);
      }
      editUser(params,successCallback, failCallback);
    }, 1000);
  };

  const submitAction = bid && bid.id ? editAction : createAction;

  let title = null;
  if (vendorId) title = `${intl.formatMessage({ id: "BID.TITLE.BY_VENDOR" })} [${vendor.login}]`;
  if (!isEditable) {
    title = intl.formatMessage({ id: "BID.TITLE.VIEW" });
  } else if (bidId) {
    title = intl.formatMessage({ id: "BID.TITLE.EDIT" });
  }

  if (preloading) return <Preloader />;
  if (errors.get) return <LoadError handleClick={() => getBidById(bidId, bid)} />;
  if ( isRedirectTo && isRedirectTo !== -1) return <Redirect to={`/bidsList/${isRedirectTo}`}/>;
  return (
    <>
      <LocationDialog
        isOpen={locationModalOpen}
        handleClose={() => setLocationModalOpen(false)}
        submitAction={locationSubmit}
        user={user}
        classes={classes}
      />
      {title && <LayoutSubheader title={title} />}
      {isNoModerate ? (
        <div className={classes.titleText}>
          {intl.formatMessage({ id: "BID.STATUS.NO_MODERATE" })}
        </div>
      ) : (
        <BidForm
          classes={classes}
          loading={loading}
          submitAction={submitAction}
          crops={crops}
          bid={bid}
          isEditable={isEditable}
          fetchLocations={fetchLocationsRequest}
          clearLocations={clearLocations}
          getCropParams={getCropParams}
          openLocation={() => setLocationModalOpen(true)}
          user={user}
          bidId={bidId}
        />
      )}
    </>
  );
}

export default injectIntl(
  connect(null, { ...bids.actions, ...locations.actions, ...auth.actions, ...crops.actions })(BidCreatePage)
);
