import React, { useState, useEffect } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import {
  createCrop,
  editCrop,
  editCropParam,
  getCropParams,
  createCropParam,
} from "../../../crud/crops.crud";
import useStyles from "../styles";
import * as crops from "../../../store/ducks/crops.duck";
import CropForm from "./components/CropForm";

function CropPage({ match, editCropSuccess, createCropSuccess, intl }) {
  const cropIdFromUrl = match.params && match.params.id;
  const [cropId, setCropId] = useState(cropIdFromUrl);
  const [cropParams, setCropParams] = useState([]);
  const classes = useStyles();
  const { crop } = useSelector(({ crops }) => {
    const filterCrops = crops.crops.filter(item => item.id === Number.parseInt(cropIdFromUrl));
    if (filterCrops && filterCrops.length > 0) {
      return { crop: filterCrops[0] };
    }
    return { crop: {} };
  }, shallowEqual);
  const getCropParamsAction = () => {
    if (cropId) {
      getCropParams(cropId).then(({ data }) => {
        if (data && data.data) {
          setCropParams(data.data);
        }
      });
    }
  };
  const editCropAction = (values, setStatus, setSubmitting) => {
    const cropAction = cropId ? editCrop : createCrop;
    setStatus({
      loading: true,
    });
    cropAction(values, cropId)
      .then(({ data }) => {
        if (data && data.data) {
          setStatus({
            loading: false,
            error: false,
            message: intl.formatMessage({
              id: "CROP.STATUS.CROP_CREATE",
            }),
          });
          cropId ? editCropSuccess(cropId) : createCropSuccess();
          setCropId(data.data.id);
        }
      })
      .catch(error => {
        setSubmitting(false);
        setStatus({
          loading: false,
          error: true,
          message: intl.formatMessage({
            id: "CROP.STATUS.CROP_CREATE_ERROR",
          }),
        });
      });
  };
  const editCropParamAction = (values, setStatus, setSubmitting, status) => {
    const paramId = values.id || (status && status.id);
    const cropAction = paramId ? editCropParam : createCropParam;
    setStatus({
      loading: true,
    });
    cropAction(values, paramId || cropId)
      .then(({ data }) => {
        if (data && data.data) {
          setStatus({
            loading: false,
            error: false,
            message: intl.formatMessage({
              id: "CROP.STATUS.CROP_PARAM_CREATE",
            }),
            id: data.data.id,
          });
        }
      })
      .catch(error => {
        setSubmitting(false);
        setStatus({
          loading: false,
          error: true,
          message: intl.formatMessage({
            id: "CROP.STATUS.CROP_PARAM_CREATE_ERROR",
          }),
        });
      });
  };
  useEffect(() => {
    getCropParamsAction();
  }, []);
  return (
    <CropForm
      classes={classes}
      crop={crop}
      editCropAction={editCropAction}
      cropId={cropId}
      cropParams={cropParams}
      editCropParamAction={editCropParamAction}
      setCropParams={setCropParams}
    />
  );
}

export default injectIntl(connect(null, crops.actions)(CropPage));
