import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { TextField, Grid as div, IconButton, Divider } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import { useFormik } from "formik";
import * as Yup from "yup";

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import { IAppState } from "../../../../store/rootDuck";
import useStyles from "../../styles";
import { IUser } from "../../../../interfaces/users";
import { IMyFilterItem, IPointPriceForEdit, IParamValue } from "../../../../interfaces/filters";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";

const getInitialValues = (me: IUser | undefined, currentFilter: IMyFilterItem) => {
  let initialValues: { [x: string]: any } = {};
  me?.points.forEach(item => {
    initialValues[`price${item.id}`] = currentFilter.point_prices.find(point => point.point.id === item.id)?.price || "";
  });
  return initialValues;
};

const getValidationObject = (me: IUser | undefined, intl: any) => {
  let validationObject: { [x: string]: any } = {};
  me?.points.forEach(item => {
    validationObject[`price${item.id}`] = Yup.number()
      .min(1000, intl.formatMessage({ id: "YUP.PRICE_OF_1000" }))
      .typeError(intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" }));
  });
  return validationObject;
};

const getFilterEditArray = (values: { [x: string]: any }) => {
  let filterEditArray: IPointPriceForEdit[] = [];
  // console.log("values:", values);
  for (let key in values) {
    if (values[key]) filterEditArray.push({ point_id: +key.slice(5), price: +values[key] });
  }
  // console.log("filterEditArray:", filterEditArray);
  return filterEditArray;
};
interface IProps {
  currentFilter: IMyFilterItem;
  setFilterId: React.Dispatch<React.SetStateAction<string>>;
  newFilter: any;
  filterSubmit: any;
}

const PointsPrices: React.FC<IProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,

  me,

  currentFilter,
  fetchFilters,
  myFilters,
  myFiltersLoading,

  clearCreateFilter,
  createFilter,
  createLoading,
  createSuccess,
  createError,

  clearDelFilter,
  delFilter,
  delLoading,
  delSuccess,
  delError,

  clearEditFilter,
  editFilter,
  editLoading,
  editSuccess,
  editError,

  setFilterId,

  pointPrices,
  setPointPrices,
  clearPointPrices,

  newFilter,
  filterSubmit,
}) => {
  const classes = useStyles();

  let pointData: any[] = [];

  const pointDataForRequest = () => {
    currentFilter.point_prices.map(item => {
      pointData.push({
        point_id: item.point.id,
        price: item.price,
      });
    });
  };

  const { values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, touched, errors } = useFormik({
    initialValues: getInitialValues(me, currentFilter),
    onSubmit: values => {
      let parameter_values: IParamValue[] = [];
      currentFilter.parameter_values.forEach(item => {
        parameter_values.push({ parameter_id: item.parameter.id, value: item.value });
      });
      editFilter({
        id: currentFilter.id || 0,
        data: {
          cropId: currentFilter.crop.id,
          point_prices: getFilterEditArray(values),
          parameter_values,
        },
      });
      clearPointPrices();
      pointDataForRequest();
      setPointPrices(pointData);
    },
    validationSchema: Yup.object().shape(getValidationObject(me, intl)),
  });

  useEffect(() => {
    resetForm({ values: getInitialValues(me, currentFilter) });
  }, [currentFilter, me, myFilters, resetForm]);

  return (
    <div>
      {me?.points.map((item, index) => (
        <div key={index}>
          <div className={classes.textFieldContainer}>
            <div style={{ flex: "auto" }}>{item.name}</div>
            <div>
              <TextField
                type="text"
                autoComplete="off"
                label={intl.formatMessage({
                  id: "ALL.PRICE_OF_TON",
                })}
                margin="normal"
                name={`price${item.id}`}
                value={values[`price${item.id}`]}
                variant="outlined"
                onBlur={handleBlur}
                onChange={e => {
                  //console.log(values);
                  handleChange(e);
                }}
                helperText={touched[`price${item.id}`] && errors[`price${item.id}`]}
                error={Boolean(touched[`price${item.id}`] && errors[`price${item.id}`])}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setFieldValue(`price${item.id}`, "")}>
                      <CloseIcon />
                    </IconButton>
                  ),
                }}
                style={{ width: 200 }}
                className={classes.leftMargin2}
              />
            </div>
          </div>
          {index !== me?.points.length - 1 && <Divider />}
        </div>
      ))}
      <div className={classes.bottomButtonsContainer}>
        <div className={classes.button}>
          <ButtonWithLoader
            variant="contained"
            color="primary"
            disabled={editLoading}
            loading={editLoading}
            onPress={() => {
              handleSubmit();
              filterSubmit();
            }}
          >
            {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
          </ButtonWithLoader>
        </div>
      </div>
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    me: state.auth.user,
    myFilters: state.myFilters.myFilters,
    myFiltersLoading: state.myFilters.loading,
    createLoading: state.myFilters.createLoading,
    createSuccess: state.myFilters.createSuccess,
    createError: state.myFilters.createError,
    delLoading: state.myFilters.delLoading,
    delSuccess: state.myFilters.delSuccess,
    delError: state.myFilters.delError,
    editLoading: state.myFilters.editLoading,
    editSuccess: state.myFilters.editSuccess,
    editError: state.myFilters.editError,
    pointPrices: state.myFilters.pointPrices,
  }),
  {
    fetchFilters: myFiltersActions.fetchRequest,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
    setPointPrices: myFiltersActions.setPointPrices,
    clearPointPrices: myFiltersActions.clearPointPrices,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(PointsPrices));
