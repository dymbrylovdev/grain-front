import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import useStyles from "../styles";
import * as crops from "../../../store/ducks/crops.duck";
import CropForm from "./components/CropForm";

function CropPage({
  match,
  getCropParams,
  editCrop,
  createCrop,
  editCropParam,
  createCropParam,
  intl,
}) {
  const cropIdFromUrl = match.params && match.params.id;
  const [cropId, setCropId] = useState(cropIdFromUrl);
  const [cropParams, setCropParams] = useState([]);

  const classes = useStyles();
  const { crop, user } = useSelector(({ crops: { crops }, auth: { user } }) => {
    const filterCrops =
      crops && crops.data && crops.data.filter(item => item.id === Number.parseInt(cropIdFromUrl));
    if (filterCrops && filterCrops.length > 0) {
      return { crop: filterCrops[0] };
    }
    return { crop: {} };
  }, shallowEqual);

  const getCropParamsAction = useCallback(() => {
    if (cropId) {
      const successCallback = data => {
        setCropParams(data);
      };
      const failCallback = () => {};
      getCropParams(cropId, successCallback, failCallback);
    }
  }, [cropId, getCropParams]);

  const editCropAction = (values, setStatus, setSubmitting) => {
    const params = values;
    setStatus({ loading: true });
    const successCallback = data => {
      setStatus({
        loading: false,
        error: false,
        message: intl.formatMessage({
          id: "CROP.STATUS.CROP_CREATE",
        }),
      });
      setCropId(data.id);
    };
    const failCallback = () => {
      setSubmitting(false);
      setStatus({
        loading: false,
        error: true,
        message: intl.formatMessage({
          id: "CROP.STATUS.CROP_CREATE_ERROR",
        }),
      });
    };
    cropId
      ? editCrop(cropId, params, user, successCallback, failCallback)
      : createCrop(params, user, successCallback, failCallback);
  };

  const editCropParamAction = (values, setStatus, setSubmitting, setIdValue) => {
    const paramId = values.id;
    const params = values;
    setStatus({ loading: true });
    const successCallback = data => {
      setIdValue(data.id);
      setStatus({
        loading: false,
        error: false,
        message: intl.formatMessage({
          id: "CROP.STATUS.CROP_PARAM_CREATE",
        }),
      });
    };
    const failCallback = () => {
      setSubmitting(false);
      setStatus({
        loading: false,
        error: true,
        message: intl.formatMessage({
          id: "CROP.STATUS.CROP_PARAM_CREATE_ERROR",
        }),
      });
    };
    paramId
      ? editCropParam(paramId, params, successCallback, failCallback)
      : createCropParam(cropId, params, successCallback, failCallback);
  };

  useEffect(() => {
    getCropParamsAction();
  }, [getCropParamsAction]);

  return (
    <CropForm
      classes={classes}
      crop={!!cropId ? crop : undefined}
      editCropAction={editCropAction}
      cropId={cropId}
      cropParams={cropParams}
      editCropParamAction={editCropParamAction}
      setCropParams={setCropParams}
    />
  );
}

export default injectIntl(connect(null, crops.actions)(CropPage));
