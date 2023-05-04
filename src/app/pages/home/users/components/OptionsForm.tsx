import React, { useEffect, useState, useCallback, useMemo } from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import { TextField, IconButton, MenuItem, FormControlLabel, Checkbox } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import CloseIcon from "@material-ui/icons/Close";
import { actions as optionsActions } from "../../../../store/ducks/options.duck";
import { actions as googleLocationsActions } from "../../../../store/ducks/yaLocations.duck";
import { actions as locationsActions } from "../../../../store/ducks/locations.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import useStyles from "../../styles";
import { IAppState } from "../../../../store/rootDuck";
import NumberFormat from "react-number-format";
import { thousands } from "../../deals/utils/utils";
import { Placemark, YMaps, Map } from "react-yandex-maps";
import { REACT_APP_GOOGLE_API_KEY } from "../../../../constants";

import { ITransport } from "../../../../interfaces/options";
import AutocompleteLocations from "../../../../components/AutocompleteLocations";
import { ILocationToRequest } from "../../../../interfaces/locations";

// const innerStyles = makeStyles((theme: Theme) => ({
//     companyContainer: {
//         flexDirection: "row",
//         display: "flex",
//     },
//     companyText: {
//         flex: 1,
//     },
//     buttonConfirm: {
//         paddingBottom: theme.spacing(2),
//     },
//     pulseRoot: {
//         "& fieldset": {
//             animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
//         },
//     },
// }));

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange(values.value);
      }}
      decimalScale={2}
    />
  );
}
interface IProps {
  editMode?: "profile" | "create" | "edit" | "view";
  isTransporter?: boolean;
  submitSaveOptions: (callBack: () => void) => void;
}

const OptionsForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  edit,
  me,
  meLoading,
  editLoading,
  create,
  fetchGoogleLocations,
  googleLocations,
  errorGoogleLocations,
  clearGoogleLocations,
  prompterRunning,
  prompterStep,
  selectedLocation,
  setSelectedLocation,
  clearSelectedLocation,
  editMode,
  user,
  editOptionsSuccess,
  editLoadingErr,
  clearCreateOptions,
  isTransporter,
  fetchUser,
  fetchMe,
  submitSaveOptions
}) => {
  // const innerClasses = innerStyles();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // const history = useHistory();

  const [isMe, setItsMe] = useState<boolean>();

  const userType = useMemo(() => {
    if (editMode === "view") {
      setItsMe(false);
      return user;
    } else {
      if (me?.roles.includes("ROLE_ADMIN") || me?.roles.includes("ROLE_MANAGER") && user) {
        setItsMe(false);
        return user;
      }
      if (isTransporter) {
        setItsMe(me?.id === user?.id);
        return user;
      } else {
        setItsMe(true);
        return me;
      }
    }
  }, [me, user, editMode, isTransporter]);
  const getInitialValues = (options: ITransport | undefined) => ({
    weight: userType?.transport ? userType.transport.weight : "",
    loading: userType?.transport ? userType.transport.loading : "",
    overload: userType?.transport ? userType.transport.overload : "",
    nds: userType?.transport ? userType.transport.nds : "",
    sidewall_height: userType?.transport ? userType.transport.sidewall_height : null,
    cabin_height: userType?.transport ? userType.transport.cabin_height : null,
    length: userType?.transport ? userType.transport.length : null,
    name: userType?.transport ? userType.transport.name : "",
    available: userType?.transport ? userType.transport.available : "",
    amount: userType?.transport ? userType.transport.amount : "",
    location: userType?.transport ? userType.transport.location : "",
    comment: userType?.transport ? userType.transport.comment : "",
  });

  const validationSchema = Yup.object().shape(
    {
      weight: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      amount: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
      location: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
    },
    []
  );

  // const [ymaps, setYmaps] = useState<any>();
  // const [map, setMap] = useState<any>();

  useEffect(() => {
    if (editOptionsSuccess || editLoadingErr) {
      enqueueSnackbar(
        editOptionsSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editLoadingErr}`,
        {
          variant: editOptionsSuccess ? "success" : "error",
        }
      );
      clearCreateOptions();
    }
    if (editOptionsSuccess) {
      if (isMe) {
        fetchMe();
      } else if (user?.id) {
        fetchUser({ id: user.id });
      } else {
        fetchUser({ id: userType!.id });
      }
    }
  }, [editOptionsSuccess, editLoadingErr, clearCreateOptions, fetchUser, enqueueSnackbar, intl]);

  const [autoLocation, setAutoLocation] = useState({ text: "" });

  useEffect(() => {
    dispatch(clearSelectedLocation());
  }, [clearSelectedLocation, dispatch]);

  React.useEffect(() => {
    userType?.transport?.location?.text && setAutoLocation({ text: userType?.transport?.location?.text });
  }, [userType]);

  const mapState = useMemo(() => {
    if (selectedLocation) {
      return { center: [selectedLocation.lat, selectedLocation.lng], zoom: 7, margin: [10, 10, 10, 10] };
    } else {
      if (userType?.transport?.location) {
        return { center: [userType?.transport.location.lat, userType?.transport.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
      } else {
        return null;
      }
    }
  }, [selectedLocation, userType]);

  useEffect(() => {
    submitSaveOptions(handleSubmit);
  },[])

  const { values, handleSubmit, handleChange, handleBlur, setFieldValue, touched, errors } = useFormik({
    initialValues: getInitialValues(undefined),
    onSubmit: values => {
      console.log(isTransporter ? user?.id : userType?.id)
      edit({
        id: isTransporter ? user?.id : userType?.id,
        data: {
          ...values,
          location: selectedLocation || userType?.transport.location,
        },
        self: isMe,
      });
    },
    validationSchema: validationSchema,
  });

  const onChangeHandler = useCallback(
    val => {
      setFieldValue("weight", val);
    },
    [setFieldValue]
  );

  const onChangeHandlerAmount = useCallback(
    val => {
      setFieldValue("amount", val);
    },
    [setFieldValue]
  );

  const fetchLoc = useCallback(
    val => {
      dispatch(fetchGoogleLocations(val));
    },
    [fetchGoogleLocations, dispatch]
  );

  return (
    <>
      <div className={classes.null}>
        {meLoading ? (
          <>
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
            <Skeleton width="100%" height={70} animation="wave" />
          </>
        ) : (
          <>
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "OPTIONS.WEIGHT",
              })}
              margin="normal"
              name="weight"
              value={thousands(values.weight.toString())}
              variant="outlined"
              onBlur={handleBlur}
              onChange={onChangeHandler}
              disabled={editMode === "view"}
              helperText={touched.weight && errors.weight}
              error={Boolean(touched.weight && errors.weight)}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                endAdornment: (
                  <IconButton onClick={() => setFieldValue("weight", "0")}>{editMode === "view" ? null : <CloseIcon />}</IconButton>
                ),
              }}
              autoComplete="off"
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "OPTIONS.AMOUNT",
              })}
              margin="normal"
              name="amount"
              value={thousands(values.amount.toString())}
              variant="outlined"
              onBlur={handleBlur}
              onChange={onChangeHandlerAmount}
              helperText={touched.amount && errors.amount}
              error={Boolean(touched.amount && errors.amount)}
              disabled={editMode === "view"}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                endAdornment: (
                  <IconButton onClick={() => setFieldValue("amount", "0")}>{editMode === "view" ? null : <CloseIcon />}</IconButton>
                ),
              }}
              autoComplete="off"
            />

            <TextField
              type="text"
              select
              label={intl.formatMessage({
                id: "OPTIONS.LOADING",
              })}
              margin="normal"
              name="loading"
              value={values.loading}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={editMode === "view"}
              helperText={touched.loading && errors.loading}
              error={Boolean(touched.loading && errors.loading)}
              autoComplete="off"
            >
              <MenuItem key={1} value="side">
                Боковая
              </MenuItem>
              <MenuItem key={2} value="back">
                Задняя
              </MenuItem>
            </TextField>

            <TextField
              type="text"
              select
              label={intl.formatMessage({
                id: "OPTIONS.OVERLOAD",
              })}
              margin="normal"
              name="overload"
              value={values.overload}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={editMode === "view"}
              helperText={touched.overload && errors.overload}
              error={Boolean(touched.overload && errors.overload)}
              autoComplete="off"
            >
              <MenuItem key={1} value="norm">
                Норма
              </MenuItem>
              <MenuItem key={2} value="overload">
                Перегруз
              </MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={values.nds === true}
                  disabled={editMode === "view"}
                  onChange={() => setFieldValue("nds", !values.nds)}
                  color="primary"
                />
              }
              label={intl.formatMessage({ id: "OPTIONS.NDS" })}
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "OPTIONS.SIDEWALL.HEIGHT",
              })}
              margin="normal"
              name="sidewall_height"
              value={values.sidewall_height}
              variant="outlined"
              onBlur={handleBlur}
              onChange={value => setFieldValue("sidewall_height", value ? value : null)}
              helperText={touched.sidewall_height && errors.sidewall_height}
              error={Boolean(touched.sidewall_height && errors.sidewall_height)}
              disabled={editMode === "view"}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                endAdornment: (
                  <IconButton onClick={() => setFieldValue("sidewall_height", "0")}>
                    {editMode === "view" ? null : <CloseIcon />}
                  </IconButton>
                ),
              }}
              autoComplete="off"
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "OPTIONS.CABIN.HEIGHT",
              })}
              margin="normal"
              name="cabin_height"
              value={values.cabin_height}
              variant="outlined"
              onBlur={handleBlur}
              onChange={value => setFieldValue("cabin_height", value ? value : null)}
              helperText={touched.cabin_height && errors.cabin_height}
              error={Boolean(touched.cabin_height && errors.cabin_height)}
              disabled={editMode === "view"}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                endAdornment: (
                  <IconButton onClick={() => setFieldValue("cabin_height", "0")}>{editMode === "view" ? null : <CloseIcon />}</IconButton>
                ),
              }}
              autoComplete="off"
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "OPTIONS.LENGTH",
              })}
              margin="normal"
              name="length"
              value={values.length}
              variant="outlined"
              onBlur={handleBlur}
              onChange={value => setFieldValue("length", value ? value : null)}
              helperText={touched.length && errors.length}
              error={Boolean(touched.length && errors.length)}
              disabled={editMode === "view"}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                endAdornment: (
                  <IconButton onClick={() => setFieldValue("length", "0")}>{editMode === "view" ? null : <CloseIcon />}</IconButton>
                ),
              }}
              autoComplete="off"
            />

            <TextField
              type="text"
              label={intl.formatMessage({
                id: "OPTIONS.NAME",
              })}
              margin="normal"
              name="name"
              value={values.name}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              fullWidth
              disabled={editMode === "view"}
              helperText={touched.name && errors.name}
              error={Boolean(touched.name && errors.name)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setFieldValue("name", "")}>{editMode === "view" ? null : <CloseIcon />}</IconButton>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  disabled={editMode === "view"}
                  checked={values.available === true}
                  onChange={() => setFieldValue("available", !values.available)}
                  color="primary"
                />
              }
              label={intl.formatMessage({ id: "OPTIONS.AVAILABLE" })}
            />

            <div className={classes.textField}>
              <AutocompleteLocations
                options={googleLocations || []}
                inputValue={autoLocation}
                // inputValue={loc}
                label={intl.formatMessage({ id: "PROFILE.INPUT.LOCATION.LOCATION" })}
                editable={true}
                inputClassName={classes.textField}
                inputError={Boolean(touched?.location && errors?.location)}
                inputHelperText={errorGoogleLocations}
                fetchLocations={fetchLoc}
                clearLocations={clearGoogleLocations}
                setSelectedLocation={(location: ILocationToRequest) => {
                  if (location.text !== "") {
                    dispatch(setSelectedLocation(location));
                    setFieldValue("location", location);
                  }
                }}
                // disable={false}
                // disabled={Boolean(editMode === "view")}
                disable={Boolean(editMode === "view")}
                // prompterRunning={me?.points.length === 0 ? prompterRunning : false}
                prompterRunning={userType?.points.length === 0 ? prompterRunning : false}
                prompterStep={prompterStep}
              />
            </div>
            <TextField
              type="text"
              label={intl.formatMessage({
                id: "BIDSLIST.TABLE.DESCRIPTION",
              })}
              margin="normal"
              name="comment"
              value={values.comment}
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              multiline
              disabled={editMode === "view"}
            />

            {mapState && (
              <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
                <div className={classes.yaMap} style={{ marginTop: "15px" }}>
                  <Map
                    state={mapState}
                    // instanceRef={ref => setMap(ref)}
                    width={"100%"}
                    height={400}
                    // onLoad={ymaps => {
                    //     setYmaps(ymaps);
                    // }}
                    modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
                  >
                    {/* {(me?.transport?.location || selectedLocation) && ( */}
                    {(userType?.transport?.location || selectedLocation) && (
                      <Placemark
                        geometry={mapState.center}
                        properties={{
                          iconCaption: selectedLocation ? selectedLocation.text : userType?.transport?.location?.text,
                          // : me?.transport?.location?.text
                        }}
                        modules={["geoObject.addon.balloon"]}
                      />
                    )}
                  </Map>
                </div>
              </YMaps>
            )}
          </>
        )}

        {me && editMode !== "view" && (
          <div className={classes.button} style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <ButtonWithLoader
              loading={editLoading}
              disabled={editLoading}
              onPress={() => {
                handleSubmit();
              }}
            >
              {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
            </ButtonWithLoader>
          </div>
        )}
      </div>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    user: state.users.user,
    meLoading: state.auth.loading,
    editLoading: state.options.editLoading,
    selectedLocation: state.options.selectedLocation,
    editOptionsSuccess: state.options.editOptionsSuccess,
    editLoadingErr: state.options.editLoadingErr,
    googleLocations: state.yaLocations.yaLocations,
    errorGoogleLocations: state.yaLocations.error,
    prompterRunning: state.prompter.running,
    prompterStep: state.prompter.activeStep,
    // create: locationsActions.createRequest,
    // fetchGoogleLocations: googleLocationsActions.fetchRequest,
    // clearGoogleLocations: googleLocationsActions.clear,
    // setSelectedLocation: optionsActions.setSelectedLocation,
    // clearSelectedLocation: optionsActions.clearSelectedLocation,
  }),
  {
    create: locationsActions.createRequest,
    fetchGoogleLocations: googleLocationsActions.fetchRequest,
    clearGoogleLocations: googleLocationsActions.clear,
    setSelectedLocation: optionsActions.setSelectedLocation,
    clearSelectedLocation: optionsActions.clearSelectedLocation,
    clearCreateOptions: optionsActions.clearCreateOptions,
    fetchUser: usersActions.fetchByIdRequest,
    fetchMe: authActions.fetchRequest,
    edit: optionsActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(OptionsForm));
