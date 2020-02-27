import React, { useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import BidForm from "./components/BidForm";
import useStyles from "../styles";
import { setUser } from "../../../crud/auth.crud";
import { createAd, editAd } from "../../../crud/ads.crud";
import userSelector from "../../../store/selectors/user";
import bidSelector from "../../../store/selectors/bid";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import * as ads from "../../../store/ducks/ads.duck";
import * as locations from "../../../store/ducks/locations.duck";
import * as auth from "../../../store/ducks/auth.duck";
import Preloader from "../../../components/ui/Loaders/Preloader";
import LocationDialog from "./components/location/LocationDialog";

function BidCreatePage({
  intl,
  createAdSuccess,
  match,
  editAdSuccess,
  fetchLocationsRequest,
  clearLocations,
  getAdById,
  fulfillUser,
}) {
  const classes = useStyles();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { crops, user, preloading } = useSelector(
    ({ crops, auth, ads }) => ({
      crops: crops.crops,
      user: auth.user,
      preloading: ads.currentAd && ads.currentAd.loading,
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
  const isEditable = user.is_admin || (bid && bid.vendor && bid.vendor.id === user.id) || !bidId;
  const vendor_id = vendorId || (bid && bid.vendor && bid.vendor.id) || user.id;
  const isNoModerate = !vendorId && !bidId && user.is_vendor && user.status === "На модерации";
  const history = useHistory();

  const createAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      createAd({ ...values, vendor_id: Number(vendor_id) })
        .then(({ data }) => {
          setLoading(false);
          if (data.data) {
            setStatus({
              error: false,
              message: intl.formatMessage({
                id: "BID.STATUS.CREATE_SUCCESS",
              }),
            });
            createAdSuccess();
            history.goBack();
            //setBackRedirect(true);
          }
        })
        .catch(error => {
          setLoading(false);
          setSubmitting(false);
          setStatus({
            error: true,
            message: intl.formatMessage({
              id: "BID.STATUS.ERROR",
            }),
          });
        });
    }, 1000);
  };

  const editAction = (values, setStatus, setSubmitting) => {
    console.log("editValues", values);
    setTimeout(() => {
      setLoading(true);
      editAd(bidId, {
        ...values,
        vendor_id,
        price: Number.parseInt(values.price),
        volume: Number.parseInt(values.volume),
      })
        .then(({ data }) => {
          setLoading(false);
          if (data.data) {
            setStatus({
              error: false,
              message: intl.formatMessage({
                id: "BID.STATUS.EDIT_SUCCESS",
              }),
            });
            editAdSuccess(data.data);
          }
        })
        .catch(error => {
          setLoading(false);
          setSubmitting(false);
          setStatus({
            error: true,
            message: intl.formatMessage({
              id: "BID.STATUS.ERROR",
            }),
          });
        });
    }, 1000);
  };

  useEffect(() => {
    getAdById(bidId, bid);
  }, [user]);

  const locationSubmit = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setStatus({ loading: true });
      setUser(values)
        .then(({ data }) => {
          setStatus({ loading: false });
          if (data.data) {
            setLocationModalOpen(false);
            fulfillUser(data.data);
          }
        })
        .catch(error => {
          console.log("loginError", error);
          setStatus({
            error: true,
            message: intl.formatMessage({
              id: "LOCATION.STATUS.ERROR",
            }),
          });
          setSubmitting(false);
        });
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
          openLocation={() => setLocationModalOpen(true)}
          user={user}
        />
      )}
    </>
  );
}

export default injectIntl(
  connect(null, { ...ads.actions, ...locations.actions, ...auth.actions })(BidCreatePage)
);
