import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { connect, useSelector, shallowEqual } from "react-redux";
import { Redirect } from "react-router-dom";
import BidForm from "./components/BidForm";
import useStyles from "../styles";
import { createAd, editAd } from "../../../crud/ads.crud";
import userSelector from "../../../store/selectors/user";
import bidSelector from "../../../store/selectors/bid";
import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import * as ads from "../../../store/ducks/ads.duck";

function BidCreatePage({ intl, createAdSuccess, match, editAdSuccess }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [backRedirect, setBackRedirect] = useState(false);
  const { crops, user } = useSelector(
    ({ crops, auth }) => ({ crops: crops.crops, user: auth.user }),
    shallowEqual
  );
  const vendorId = match.params.vendorId;
  const bidId = match.params.bidId;
  const { user: vendor } = userSelector(vendorId);
  const { bid } = bidSelector(bidId);
  const isEditable = user.is_admin || (bid &&  bid.vendor && bid.vendor.id === user.id) || !bidId;
  const vendor_id = vendorId || (bid && bid.vendor && bid.vendor.id) || user.id;
  const createAction = (values, setStatus, setSubmitting) => {
    setTimeout(() => {
      setLoading(true);
      createAd({...values, vendor_id})
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
            setBackRedirect(true);
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
    console.log('editValues', values);
    
    setTimeout(() => {
      setLoading(true);
      editAd(bidId, {...values, vendor_id})
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
  if (backRedirect) {
    return <Redirect to="/bidsList" />;
  }

  return (
    <>
      {vendor && vendor.id && (
        <LayoutSubheader
          title={`${intl.formatMessage({ id: "BID.TITLE.BY_VENDOR" })} [${vendor.login}]`}
        />
      )}
      <BidForm
        classes={classes}
        loading={loading}
        submitAction={submitAction}
        crops={crops}
        bid={bid}
        isEditable={isEditable}
      />
    </>
  );
}

export default injectIntl(connect(null, ads.actions)(BidCreatePage));
