import React, { useEffect, useState, useCallback, useMemo } from "react";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { WrappedComponentProps, injectIntl } from "react-intl";
import {
    TextField,
    Theme,
    IconButton,
} from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

import CloseIcon from "@material-ui/icons/Close";
import { actions as optionsActions } from "../../../../store/ducks/options.duck";
import { actions as googleLocationsActions } from "../../../../store/ducks/yaLocations.duck";
import { actions as locationsActions } from "../../../../store/ducks/locations.duck";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import useStyles from "../../styles";
import { IAppState } from "../../../../store/rootDuck";
import { IUser, IUserForEdit } from "../../../../interfaces/users";
import NumberFormatForProfile from "../../../../components/NumberFormatCustom/NumberFormatForProfile";
import NumberFormat from "react-number-format";
import { Formik } from "formik";
import { thousands } from "../../deals/utils/utils";
import { Placemark, YMaps, Map } from "react-yandex-maps";
import { API_DOMAIN, REACT_APP_GOOGLE_API_KEY } from "../../../../constants";

import { ITransport } from "../../../../interfaces/options";
import AutocompleteLocations from '../../../../components/AutocompleteLocations'
import { ILocationToRequest } from "../../../../interfaces/locations";


const innerStyles = makeStyles((theme: Theme) => ({
    companyContainer: {
        flexDirection: "row",
        display: "flex",
    },
    companyText: {
        flex: 1,
    },
    buttonConfirm: {
        paddingBottom: theme.spacing(2),
    },
    pulseRoot: {
        "& fieldset": {
            animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
        },
    },
}));

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

}) => {
    const innerClasses = innerStyles();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();


    const [isMe, setItsMe] = useState<boolean>()

    const userType = useMemo(() => {
        if (editMode === "view") {
            setItsMe(false)
            return user
        } else {
            if (me?.roles.includes("ROLE_ADMIN") && user) {
                setItsMe(false)
                return user
            } else {
                setItsMe(true)
                return me
            }
        }
    }, [me, user])




    const getInitialValues = (options: ITransport | undefined) => ({
        technicalDetails: userType?.transport ? userType.transport.technical_details : '',
        weight: userType?.transport ? userType.transport.weight : '',
        amount: userType?.transport ? userType.transport.amount : '',
        location: userType?.transport ? userType.transport.location : '',
    });

    const validationSchema = Yup.object().shape(
        {
            technicalDetails: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
            weight: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
            amount: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
            location: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
        },
        []
    );

    const [ymaps, setYmaps] = useState<any>();
    const [map, setMap] = useState<any>();



    const [autoLocation, setAutoLocation] = useState({ text: "" });

    React.useEffect(() => {
        dispatch(clearSelectedLocation())
    }, [])

    React.useEffect(() => {
        userType?.transport?.location?.text && setAutoLocation({ text: userType?.transport?.location?.text })
    }, [userType])


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


    const { values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, touched, errors } = useFormik({
        initialValues: getInitialValues(undefined),
        onSubmit: values => {

            edit({
                id: userType?.id,
                data: {
                    ...values,
                    location: selectedLocation || userType?.transport.location,
                },
                self: isMe,
            })
        },
        validationSchema: validationSchema,
    });



    const { enqueueSnackbar } = useSnackbar();

    const onChangeHandler = useCallback((val) => {
        setFieldValue("weight", val);
    }, [])
    const onChangeHandlerAmount = useCallback((val) => {
        setFieldValue("amount", val);
    }, [])

    const fetchLoc = useCallback((val) => {
        dispatch(fetchGoogleLocations(val))
    }, [])

    


    return (
        <>
            <div className={classes.null} >
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
                                id: "OPTIONS.DETAILS",
                            })}
                            margin="normal"
                            name="technicalDetails"
                            value={values.technicalDetails}
                            variant="outlined"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            rows="6"
                            multiline
                            fullWidth
                            disabled={editMode === "view"}
                            helperText={touched.technicalDetails && errors.technicalDetails}
                            error={Boolean(touched.technicalDetails && errors.technicalDetails)}
                        />
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
                                    <IconButton onClick={() => setFieldValue("weight", "")}>
                                        <CloseIcon />
                                    </IconButton>)
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
                                    <IconButton onClick={() => setFieldValue("amount", "")}>
                                        <CloseIcon />
                                    </IconButton>)
                            }}
                            autoComplete="off"
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
                                        dispatch(setSelectedLocation(location))
                                        setFieldValue("location", location)
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


                        {mapState && (
                            <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
                                <div className={classes.yaMap} style={{ marginTop: "15px" }}>
                                    <Map
                                        state={mapState}
                                        instanceRef={ref => setMap(ref)}
                                        width={"100%"}
                                        height={400}
                                        onLoad={ymaps => {
                                            setYmaps(ymaps);
                                        }}
                                        modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
                                    >
                                        {/* {(me?.transport?.location || selectedLocation) && ( */}
                                        {(userType?.transport?.location || selectedLocation) && (
                                            <Placemark
                                                geometry={mapState.center}
                                                properties={{
                                                    iconCaption: selectedLocation
                                                        ? selectedLocation.text
                                                        : userType?.transport?.location?.text
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


                {me && editMode != "view" && (
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


        edit: optionsActions.editRequest,
    }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(OptionsForm));



