import React, { useState } from "react";
import { Paper, Tab, Tabs } from "@material-ui/core";
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
  user,
}) {
  const [tabValue, setTabValue] = useState(0);
  const addEmptyCropParams = () => {
    setCropParams([...cropParams, ...[{ id: null }]]);
  };

  const activeCropParams = [];
  if (cropParams) {
    cropParams.forEach(item => {
      if (!item.is_deleted) {
        activeCropParams.push(item);
      }
    });
  }

  return (
    <Paper className={classes.paperWithForm}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Tabs value={tabValue} onChange={(_, n) => setTabValue(n)} indicatorColor="primary" textColor="primary">
          <Tab label="Основное" />
          <Tab label="Фотографии" />
        </Tabs>
      </div>
      <div className={classes.form}>
        <CropTitleForm
          crop={crop}
          classes={classes}
          editCropAction={editCropAction}
          cropId={cropId}
          delCrop={delCrop}
          isCropAlertOpen={isCropAlertOpen}
          setCropAlertOpen={setCropAlertOpen}
          tabValue={tabValue}
          user={user}
        />
        <div style={{ display: tabValue === 0 ? "block" : "none" }}>
          {!!activeCropParams.length &&
            !!cropId &&
            !crop?.is_deleted &&
            activeCropParams.map((cropParam, index) => (
              <CropParamForm
                key={`i${index}`}
                classes={classes}
                cropParam={cropParam}
                editCropParamAction={editCropParamAction}
                setCropParamForDelId={setCropParamForDelId}
                setCropParamAlertOpen={setCropParamAlertOpen}
              />
            ))}
          {cropId && !crop?.is_deleted && (
            <div className={classes.buttonAddContainer}>
              <ButtonWithLoader onPress={addEmptyCropParams}>
                <FormattedMessage id="CROP.FORM.PARAM_ADD" />
              </ButtonWithLoader>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
}

export default injectIntl(CropForm);
