import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl";
import { TextField, Tabs, Tab, MenuItem } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { actions as authActions } from "../../store/ducks/auth.duck";

import ButtonWithLoader from "../../components/ui/Buttons/ButtonWithLoader";
import { TabPanel, a11yProps } from "../../components/ui/Table/TabPanel";
import { phoneCountryCodes, countries } from "./phoneCountryCodes";
import { IAppState } from "../../store/rootDuck";

const CheckInSystem: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  fetchLoading,

  findInSystem,
  findInSystemLoading,
  findInSystemSuccess,
  findInSystemError,
}) => {
  const [valueTabs, setValueTabs] = useState(0);
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [countryName, setCountryName] = useState(phoneCountryCodes[0]);

  const history = useHistory();

  const handleTabsChange = (e: any, newValue: number) => {
    setValueTabs(newValue);
  };

  const handleCountryNameChange = (e: any) => {
    setCountryName(e.target.value);
  };

  const handleCountryCodeChange = (e: any) => {
    const countryName = e.target.value;

    countries.forEach(country => {
      if (country.country === countryName) {
        setCountryCode(country.code);
      }
    });
  };

  let validationSchema = {};

  if (valueTabs === 0) {
    validationSchema = {
      email: Yup.string()
        .email(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }))
        .required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
    };
  }
  if (valueTabs === 1) {
    validationSchema = {
      phone: Yup.string().required(intl.formatMessage({ id: "AUTH.VALIDATION.REQUIRED_FIELD" })),
    };
  }

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      phone: `${countryCode}`,
      codeConfirm: "",
    },
    onSubmit: values => {
      if (valueTabs === 0) {
        findInSystem({ value: values.email, type: "email" });
      }
      if (valueTabs === 1) {
        findInSystem({ value: values.phone, type: "phone" });
      }
    },
    validationSchema: Yup.object().shape(validationSchema),
  });

  useEffect(() => {
    if (findInSystemSuccess) {
      history.push("/auth/login");
    }
  }, [findInSystemSuccess, history]);

  useEffect(() => {
    if (findInSystemError) {
      history.push("/auth/registration");
    }
  }, [findInSystemError, history]);

  return (
    <>
      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <h3>Войдите или зарегистрируйтесь</h3>
          </div>

          <form noValidate={true} autoComplete="off" className="kt-form" onSubmit={handleSubmit}>
            <Tabs
              value={valueTabs}
              onChange={handleTabsChange}
              variant="scrollable"
              indicatorColor="primary"
              textColor="primary"
              aria-label="tabs"
            >
              <Tab label="По email" {...a11yProps(0)} />
              <Tab label="По телефону" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={valueTabs} index={0}>
              <div className="form-group">
                <TextField
                  type="email"
                  label={intl.formatMessage({
                    id: "AUTH.INPUT.EMAIL",
                  })}
                  margin="normal"
                  className="kt-width-full"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </div>

              <div className="kt-login__actions">
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ marginRight: 16 }}>
                      <ButtonWithLoader
                        onPress={handleSubmit}
                        disabled={fetchLoading || findInSystemLoading}
                        loading={fetchLoading || findInSystemLoading}
                      >
                        <FormattedMessage id="AUTH.LOGIN.BUTTON" />
                      </ButtonWithLoader>
                    </div>
                    <div
                      onClick={() => history.push("/")}
                      className="kt-link kt-login__link-forgot"
                      style={{ fontSize: 16, cursor: "pointer" }}
                    >
                      Вернуться к объявлениям
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Link to="/auth/forgot-password" className="kt-link kt-login__link-forgot">
                      <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                    </Link>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value={valueTabs} index={1}>
              <div className="form-group">
                <>
                  <TextField
                    select
                    type="country"
                    label={intl.formatMessage({
                      id: "AUTH.INPUT.COUNTRIES",
                    })}
                    margin="normal"
                    className="kt-width-full"
                    name="country"
                    onBlur={handleBlur}
                    //@ts-ignore
                    onChange={e => {
                      handleCountryNameChange(e);
                      handleCountryCodeChange(e);
                    }}
                    value={countryName}
                  >
                    {countries.map(item => (
                      <MenuItem key={item.id} value={item.country}>
                        {item.country}
                      </MenuItem>
                    ))}
                  </TextField>

                  <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        marginTop: "16px",
                        marginRight: "3px",
                        color: "#000",
                      }}
                    >
                      +
                    </div>
                    <TextField
                      type="phone"
                      label={intl.formatMessage({
                        id: "AUTH.INPUT.PHONE",
                      })}
                      margin="normal"
                      className="kt-width-full"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      helperText={touched.phone && errors.phone}
                      error={Boolean(touched.phone && errors.phone)}
                    />
                  </div>

                  <div className="kt-login__actions">
                    <ButtonWithLoader
                      onPress={handleSubmit}
                      disabled={fetchLoading || findInSystemLoading}
                      loading={fetchLoading || findInSystemLoading}
                    >
                      <FormattedMessage id="AUTH.LOGIN.PHONE" />
                    </ButtonWithLoader>
                  </div>
                </>
              </div>
            </TabPanel>
          </form>
        </div>
      </div>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    fetchLoading: state.auth.loading,
    fetchError: state.auth.error,

    findInSystemLoading: state.auth.findInSystemLoading,
    findInSystemSuccess: state.auth.findInSystemSuccess,
    findInSystemError: state.auth.findInSystemError,
  }),
  {
    fetch: authActions.fetchRequest,

    findInSystem: authActions.findInSystemRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(CheckInSystem);
