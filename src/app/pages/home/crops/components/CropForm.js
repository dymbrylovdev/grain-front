import React from "react";
import { Paper } from "@material-ui/core";
import CropTitleForm from "./CropTitleForm";
import CropParamForm from "./CropParamForm";
import { FormattedMessage, injectIntl } from "react-intl";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";

function CropForm({
  crop,
  classes,
  editCropAction,
  cropId,
  cropParams,
  setCropParams,
  editCropParamAction,
  delCrop,
  isCropAlertOpen,
  setCropAlertOpen,
  setCropParamForDelId,
  setCropParamAlertOpen,
}) {
  const addEmptyCropParams = () => {
    setCropParams([...cropParams, ...[{ id: null }]]);
  };
  return (
    <Paper className={classes.paperWithForm}>
      <div className={classes.form}>
        <CropTitleForm
          crop={crop}
          classes={classes}
          editCropAction={editCropAction}
          cropId={cropId}
          delCrop={delCrop}
          isCropAlertOpen={isCropAlertOpen}
          setCropAlertOpen={setCropAlertOpen}
        />
        {cropParams &&
          cropParams.map((cropParam, index) => (
            <CropParamForm
              key={`i${index}`}
              classes={classes}
              cropParam={cropParam}
              editCropParamAction={editCropParamAction}
              setCropParamForDelId={setCropParamForDelId}
              setCropParamAlertOpen={setCropParamAlertOpen}
            />
          ))}
        {cropId && (
          <div className={classes.buttonAddContainer}>
            <ButtonWithLoader onPress={addEmptyCropParams}>
              <FormattedMessage id="CROP.FORM.PARAM_ADD" />
            </ButtonWithLoader>
          </div>
        )}
      </div>
    </Paper>
  );
}

export default injectIntl(CropForm);
