import React, { useState } from "react";
import { Formik } from "formik";
import { useSelector, connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { injectIntl } from "react-intl";

import AutocompleteLocations from "../../../../../components/AutocompleteLocations";
import * as locations from "../../../../../store/ducks/locations.duck";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";
import StatusAlert from "../../../../../components/ui/Messages/StatusAlert";

const getInitialValues = user => ({
  location: user.location || {},
});

function LocationForm({
  intl,
  classes,
  submitAction,
  user,
  fetchLocationsRequest,
  clearLocations,
}) {
  const { locations, isLoadingLocations } = useSelector(state => state.locations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  return (
    <Paper className={classes.container}>
      <Formik
        autoComplete="off"
        initialValues={getInitialValues(user)}
        onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
          if (selectedLocation) {
            values.location = { ...selectedLocation };
          } else {
            delete values.location;
          }
          submitAction(values, setStatus, setSubmitting);
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <div className={classes.form}>
            <StatusAlert status={status} />
            <AutocompleteLocations
              options={locations}
              loading={isLoadingLocations}
              defaultValue={{
                text: user.location && user.location.text ? user.location.text : "",
              }}
              label={intl.formatMessage({
                id: "PROFILE.INPUT.LOCATION",
              })}
              editable={!(user.location && user.location.text)}
              inputClassName={classes.textField}
              inputError={Boolean(touched.location && errors.location)}
              inputHelperText={touched.location && errors.location}
              fetchLocations={fetchLocationsRequest}
              clearLocations={clearLocations}
              setSelectedLocation={setSelectedLocation}
            />
            <div className={classes.buttonContainer}>
              <ButtonWithLoader
                onPress={handleSubmit}
                loading={status && status.loading}
                disabled={!values.location || values.location === "" || !selectedLocation}
              >
                {intl.formatMessage({ id: "PROFILE.BUTTON.SAVE" })}
              </ButtonWithLoader>
            </div>
          </div>
        )}
      </Formik>
    </Paper>
  );
}

export default injectIntl(connect(null, locations.actions)(LocationForm));
