import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import BidForm from "./components/BidForm";
import useStyles from "../styles";
import { createAd, editAd } from "../../../crud/ads.crud";
import userSelector from "../../../store/selectors/user";
import bidSelector from "../../../store/selectors/bid";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import * as ads from "../../../store/ducks/ads.duck";
import * as locations from "../../../store/ducks/locations.duck";

function BidCreatePage({
  intl,
  createAdSuccess,
  match,
  editAdSuccess,
  fetchLocationsRequest,
  clearLocations,
}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { crops, user } = useSelector(
    ({ crops, auth }) => ({ crops: crops.crops, user: auth.user }),
    shallowEqual
  );
  const by = (match.url.indexOf("fromMy")!==-1  && "fromMy") || (match.url.indexOf("fromAdmin")!==-1  && "fromAdmin");
  const vendorId = match.params.vendorId;
  const bidId = match.params.bidId;
  const { user: vendor } = userSelector(vendorId);
  const { bid } = bidSelector(bidId, by);
  const isEditable = user.is_admin || (bid && bid.vendor && bid.vendor.id === user.id) || !bidId;
  const vendor_id = vendorId || (bid && bid.vendor && bid.vendor.id) || user.id;
  const history = useHistory();
  const createAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      createAd({ ...values, vendor_id })
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
  const submitAction = bid && bid.id ? editAction : createAction;
  let title = null;
  if (vendorId) title = `${intl.formatMessage({ id: "BID.TITLE.BY_VENDOR" })} [${vendor.login}]`;
  if (bidId) title = intl.formatMessage({ id: "BID.TITLE.EDIT" });

  return (
    <>
      {title && <LayoutSubheader title={title} />}
      <BidForm
        classes={classes}
        loading={loading}
        submitAction={submitAction}
        crops={crops}
        bid={bid}
        isEditable={isEditable}
        fetchLocations={fetchLocationsRequest}
        clearLocations={clearLocations}
      />
    </>
  );
}

export default injectIntl(connect(null, { ...ads.actions, ...locations.actions })(BidCreatePage));
