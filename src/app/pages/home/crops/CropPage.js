import React, { useState, useEffect } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { injectIntl } from "react-intl";
import { useSnackbar } from "notistack";
import useStyles from "../styles";
import * as crops from "../../../store/ducks/crops.duck";
import * as crops2 from "../../../store/ducks/crops2.duck";
import CropForm from "./components/CropForm";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import { useHistory } from "react-router-dom";

function CropPage({
  match,
  editCrop,
  createCrop,
  editCropParam,
  createCropParam,
  clearDel,
  delRequest,
  clearDelCropParam,
  delCropParamRequest,
  cropParamsRequest,
  intl,
}) {
  const history = useHistory();
  const cropIdFromUrl = match.params && match.params.id;
  const [cropId, setCropId] = useState(cropIdFromUrl);
  const [cropParams, setCropParams] = useState([]);

  const [cropParamForDelId, setCropParamForDelId] = useState(0);
  const [isCropAlertOpen, setCropAlertOpen] = useState(false);
  const [isCropParamAlertOpen, setCropParamAlertOpen] = useState(false);

  const classes = useStyles();

  const { crop, user } = useSelector(({ crops: { crops }, auth: { user } }) => {
    const filterCrops =
      crops && crops.data && crops.data.filter(item => item.id === Number.parseInt(cropIdFromUrl));
    if (filterCrops && filterCrops.length > 0) {
      return { crop: filterCrops[0] };
    }
    return { crop: {} };
  }, shallowEqual);

  const {
    delSuccess,
    delError,
    delLoading,
    cropParams2,
    delCropParamSuccess,
    delCropParamError,
    delCropParamLoading,
  } = useSelector(
    ({
      crops2: {
        delSuccess,
        delError,
        delLoading,
        cropParams,
        delCropParamSuccess,
        delCropParamError,
        delCropParamLoading,
      },
    }) => ({
      delSuccess,
      delError,
      delLoading,
      cropParams2: cropParams,
      delCropParamSuccess,
      delCropParamError,
      delCropParamLoading,
    }),
    shallowEqual
  );

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.CROP.DEL" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      if (delSuccess) {
        history.push("/cropList");
      }
      setCropAlertOpen(false);
      clearDel();
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, history, intl]);

  useEffect(() => {
    if (delCropParamSuccess || delCropParamError) {
      enqueueSnackbar(
        delCropParamSuccess
          ? intl.formatMessage({ id: "NOTISTACK.CROP_PARAM.DEL" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delCropParamError}`,
        {
          variant: delCropParamSuccess ? "success" : "error",
        }
      );
      if (delCropParamSuccess) {
        cropParamsRequest(cropId);
      }
      clearDelCropParam();
      setCropParamAlertOpen(false);
    }
  }, [
    clearDelCropParam,
    cropParamsRequest,
    delCropParamError,
    delCropParamSuccess,
    cropId,
    enqueueSnackbar,
    intl,
  ]);

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
      if (!cropId) {
        history.push(`/crop/edit/${data.id}`);
      }
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
      cropParamsRequest(cropId);
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
    if (cropId) {
      cropParamsRequest(cropId);
    }
  }, [cropParamsRequest, cropId]);

  useEffect(() => {
    setCropParams(cropParams2);
  }, [cropParams2]);

  return (
    <>
      <CropForm
        classes={classes}
        crop={!!cropId ? crop : undefined}
        editCropAction={editCropAction}
        cropId={cropId}
        cropParams={cropParams}
        editCropParamAction={editCropParamAction}
        setCropParams={setCropParams}
        delCrop={delRequest}
        isCropAlertOpen={isCropAlertOpen}
        setCropAlertOpen={setCropAlertOpen}
        setCropParamForDelId={setCropParamForDelId}
        setCropParamAlertOpen={setCropParamAlertOpen}
      />
      <AlertDialog
        isOpen={isCropParamAlertOpen}
        text={intl.formatMessage({
          id: "CROP.PARAM.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "CROP.PARAM.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "CROP.PARAM.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setCropParamAlertOpen(false)}
        handleAgree={() => {
          delCropParamRequest(cropParamForDelId);
        }}
        loadingText={intl.formatMessage({
          id: "CROP.PARAM.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delCropParamLoading}
      />
      <AlertDialog
        isOpen={isCropAlertOpen}
        text={intl.formatMessage({
          id: "CROP.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "CROP.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "CROP.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setCropAlertOpen(false)}
        handleAgree={() => delRequest(cropId)}
        loadingText={intl.formatMessage({
          id: "CROP.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </>
  );
}

export default injectIntl(connect(null, { ...crops.actions, ...crops2.actions })(CropPage));
