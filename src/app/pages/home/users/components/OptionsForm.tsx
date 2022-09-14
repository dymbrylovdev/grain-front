import React, { useEffect, useState, useCallback, useMemo } from "react";
import { connect, ConnectedProps } from "react-redux";
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
import isEqual from "lodash.isequal";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import CloseIcon from "@material-ui/icons/Close";

import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as authActions } from "../../../../store/ducks/auth.duck";
import { actions as funnelStatesActions } from "../../../../store/ducks/funnelStates.duck";
import { actions as optionsActions } from "../../../../store/ducks/options.duck";

import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";
import useStyles from "../../styles";
import { OutlinedRedButton } from "../../../../components/ui/Buttons/RedButtons";
import { roles } from "../utils/profileForm";
import { setMeValues, setCreateValues, setEditValues } from "../utils/submitValues";
import { IAppState } from "../../../../store/rootDuck";
import { IUser, IUserForEdit } from "../../../../interfaces/users";
import NumberFormatForProfile from "../../../../components/NumberFormatCustom/NumberFormatForProfile";
import { accessByRoles } from "../../../../utils/utils";
import AlertDialog from "../../../../components/ui/Dialogs/AlertDialog";
import { TrafficLight } from ".";
import CompanyConfirmBlock from "../../companies/components/CompanyConfirmBlock";
import CompanySearchForm from "../../companies/components/CompanySearchForm";
import CompanyConfirmDialog from "./CompanyConfirmDialog";
import { phoneCountryCodes, countries } from "../../../auth/phoneCountryCodes";
import PhoneButton from "../../../../components/PhoneButton";


import NumberFormat from "react-number-format";
import { Formik } from "formik";
import { thousands } from "../../deals/utils/utils";
import { Placemark, YMaps, Map } from "react-yandex-maps";
import { API_DOMAIN, REACT_APP_GOOGLE_API_KEY } from "../../../../constants";

import { ITransport } from "../../../../interfaces/options";


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
    //   editMode: "profile" | "create" | "edit" | "view";
    //   setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
    //   userId?: number;
    //   setLocTabPulse: React.Dispatch<React.SetStateAction<boolean>>;
}

const OptionsForm: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({

    intl,
    edit,
    me,
    meLoading,
    editLoading,

}) => {
    const innerClasses = innerStyles();
    const classes = useStyles();
    const history = useHistory();



    const getInitialValues = (options: ITransport | undefined) => ({
        technicalDetails: me?.transport ? me.transport.technical_details : '',
        weight: me?.transport ? me.transport.weight : '',
        amount: me?.transport ? me.transport.amount : '',
    });

    const validationSchema = Yup.object().shape(
        {
            technicalDetails: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
            weight: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
            amount: Yup.string().required(intl.formatMessage({ id: "PROFILE.VALIDATION.REQUIRED_FIELD" })),
        },
        [["email", "phone"]]
    );

    const [ymaps, setYmaps] = useState<any>();
    const [map, setMap] = useState<any>();
    const [showPlacemark, setShowPlacemark] = useState(false);


    const mapState = {"center":[-25.694768,133.795384],"zoom":7,"margin":[10,10,10,10]};
    // const mapState = useMemo(() => {
    //     if (false) {
    //         //   return { center: [currentDeal.sale_bid.location.lat, currentDeal.sale_bid.location.lng], zoom: 7, margin: [10, 10, 10, 10] };
    //         return { center: [3, 4], zoom: 7, margin: [10, 10, 10, 10] };
    //     } else {
    //         return null;
    //     }
    // }, []);





    const { values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, touched, errors } = useFormik({
        initialValues: getInitialValues(undefined),
        onSubmit: values => {
            edit({
                id: me?.id,
                data: {
                    ...values,
                    "location": {
                        "lat": 1,
                        "lng": 1,
                        "country": "Россия",
                        "province": "Ростовская Область",
                        "city": "Ростов-на-Дону",
                        "street": "Садовая",
                        "text": "ул. Садовая дом 55 строение 122",
                        "house": "1/1"
                    }
                }
            })
            console.log('values', values);
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







    return (
        <>



            <div className={classes.null}>
                {meLoading ? (
                    <Skeleton width="100%" height={70} animation="wave" />
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
                            helperText={touched.technicalDetails && errors.technicalDetails}
                            error={Boolean(touched.technicalDetails && errors.technicalDetails)}
                        // disabled={!isEditable}
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
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                                endAdornment: (
                                    <IconButton onClick={() => setFieldValue("amount", "")}>
                                        <CloseIcon />
                                    </IconButton>)
                            }}
                            autoComplete="off"
                        />
                        {/* <div style={{ display: "none" }}>
                            {true && (
                                <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
                                    <Map
                                        state={mapState}
                                        instanceRef={ref => setMap(ref)}
                                        width={"100%"}
                                        height={600}
                                        onLoad={ymaps => {
                                          setYmaps(ymaps);
                                        }}
                                        modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
                                    />
                                </YMaps>
                            )}
                        </div> */}

                        {mapState && me?.transport  && (
                            <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
                                <div className={classes.yaMap}>
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
                                        {showPlacemark && (
                                            <Placemark
                                                geometry={mapState.center}
                                                properties={{ iconCaption: me?.transport?.location?.text }}
                                                modules={["geoObject.addon.balloon"]}
                                            />
                                        )}
                                    </Map>
                                </div>
                            </YMaps>
                        )}
                    </>


                )}


                {me && (
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
        meLoading: state.auth.loading,
        editLoading: state.options.editLoading,
    }),
    {
        edit: optionsActions.editRequest,
    }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(OptionsForm));







{/* <TextField
type="text"
label={intl.formatMessage({
  id: "BIDSLIST.TABLE.DESCRIPTION",
})}
margin="normal"
name="description"
value={values.description}
variant="outlined"
onBlur={handleBlur}
onChange={handleChange}
rows="6"
multiline
disabled={!isEditable}
/> */}