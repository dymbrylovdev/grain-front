import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../components/ui/Messages/StatusAlert";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField, Button } from "@material-ui/core";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import PhotosForm from "../../bids/components/photosForm/PhotosForm";
import { toBase64 } from "../../../../utils/file";
import { useDelCropPhoto } from "../hooks/useDelCropPhoto";

const getInitialValues = crop => ({
  name: !!crop && crop.name ? crop.name : "",
  vat: !!crop && crop.vat ? crop.vat : 10,
  delivery_price_coefficient: !!crop && crop.delivery_price_coefficient ? crop.delivery_price_coefficient : 1,
  deliveryPriceOverload: !!crop && crop.deliveryPriceOverload ? crop.deliveryPriceOverload : 1,
});
function CropTitleForm({
  user,
  crop,
  editCropAction,
  intl,
  classes,
  delCrop,
  delCropLoading,
  isCropAlertOpen,
  setCropAlertOpen,
  tabValue,
}) {
  const history = useHistory();
  const [photo, setPhoto] = useState([]);
  const [delCropPhoto] = useDelCropPhoto(user);

  const delPhoto = useCallback(() => {
    if (crop) {
      delCropPhoto(crop.id);
    }
  }, [crop, delCropPhoto]);
  console.log('crop', crop)
  return (

    <Formik
      autoComplete="off"
      initialValues={getInitialValues(crop)}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />)
          .trim(),
        vat: Yup.number()
          .required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />)
          .min(0, intl.formatMessage({ id: "YUP.NUMBERS.MIN" }, { min: 0 }))
          .max(100, intl.formatMessage({ id: "YUP.NUMBERS.MAX" }, { max: 100 }))
          .typeError(<FormattedMessage id="YUP.NUMBERS" />),
        delivery_price_coefficient: Yup.number()
          .required(<FormattedMessage id="PROFILE.VALIDATION.REQUIRED_FIELD" />)
          .min(0.1, intl.formatMessage({ id: "YUP.NUMBERS.MIN" }, { min: 0.1 }))
          .max(100, intl.formatMessage({ id: "YUP.NUMBERS.MAX" }, { max: 100 }))
          .typeError(<FormattedMessage id="YUP.NUMBERS" />),
      })}
      onSubmit={async (values, { setStatus, setSubmitting, resetForm }) => {
        let arrayFiles = null;
        if (photo.length > 0) {
          for (const file of photo) {
            const base64file = await toBase64(file);
            arrayFiles = base64file;
          }
          setPhoto([]);
        }
        editCropAction(
          {
            name: values.name.trim(),
            vat: +values.vat,
            delivery_price_coefficient: +values.delivery_price_coefficient,
            deliveryPriceOverload: +values.deliveryPriceOverload,
            photo_base64: arrayFiles || undefined,
          },
          setStatus,
          setSubmitting
        );
      }}
    >
      {({ values, status, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <div>
          <div className={classes.form} style={{ display: tabValue === 1 ? "block" : "none" }}>
            <PhotosForm
              data={{ photos: crop?.photo ? [crop.photo] : [] }}
              delPhoto={delPhoto}
              setPhotos={setPhoto}
              photos={photo}
              localDelPhoto={() => setPhoto([])}
              titleSaveBtn={<FormattedMessage id="CROP.BUTTON.CROP_SAVE" />}
              saveFunc={handleSubmit}
              isOnePhoto
              loadingSave={status && status.loading}
            />
          </div>
          <form
            noValidate
            autoComplete="off"
            className="kt-form"
            onSubmit={handleSubmit}
            style={{ display: tabValue === 0 ? "block" : "none" }}
          >
            <div className={classes.topButtonsContainer}>
              <div className={classes.button}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    history.push("/cropList");
                  }}
                >
                  {intl.formatMessage({ id: "ALL.BUTTONS.PREV" })}
                </Button>
              </div>
            </div>
            <StatusAlert status={status} />
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "CROP.FORM.NAME",
              })}
              margin="normal"
              name="name"
              value={values.name}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.name && errors.name}
              error={Boolean(touched.name && errors.name)}
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "CROP.FORM.VAT",
              })}
              margin="normal"
              name="vat"
              value={values.vat}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.vat && errors.vat}
              error={Boolean(touched.vat && errors.vat)}
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "CROP.FORM.COEFFICIENT.DELIVERY",
              })}
              margin="normal"
              name="delivery_price_coefficient"
              value={values.delivery_price_coefficient}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.delivery_price_coefficient && errors.delivery_price_coefficient}
              error={Boolean(touched.delivery_price_coefficient && errors.delivery_price_coefficient)}
            />
            <div className={classes.helperText}>{intl.formatMessage({ id: "CROP.FORM.FORMULA" })}</div>

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "CROP.FORM.COEFFICIENT.OVERLOAD",
              })}
              margin="normal"
              name="deliveryPriceOverload"
              value={values.deliveryPriceOverload}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={touched.deliveryPriceOverload && errors.deliveryPriceOverload}
              error={Boolean(touched.deliveryPriceOverload && errors.deliveryPriceOverload)}
            />


            <div className={`${classes.bottomButtonsContainer} ${classes.bottomMargin2}`}>
              <div className={classes.button}>
                <ButtonWithLoader loading={status && status.loading} disabled={status && status.loading} onPress={handleSubmit}>
                  <FormattedMessage id="CROP.BUTTON.CROP_SAVE" />
                </ButtonWithLoader>
              </div>
              {!!crop && crop.id !== 1 && (
                <div className={classes.button}>
                  <OutlinedRedButton variant="outlined" onClick={() => setCropAlertOpen(true)} disabled={status && status.loading}>
                    {intl.formatMessage({ id: "CROP.BUTTON.CROP_DEL" })}
                  </OutlinedRedButton>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
}

export default injectIntl(CropTitleForm);
