import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import CloseIcon from "@material-ui/icons/Close";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";

import { actions as myFiltersActions } from "../../../../store/ducks/myFilters.duck";
import { IAppState } from "../../../../store/rootDuck";
import useStyles from "../../styles";
import { IUser } from "../../../../interfaces/users";
import { IMyFilterItem, IPointPriceForEdit } from "../../../../interfaces/filters";
import ButtonWithLoader from "../../../../components/ui/Buttons/ButtonWithLoader";

const getInitialValues = (me: IUser | undefined, currentFilter: IMyFilterItem) => {
  let initialValues: { [x: string]: any } = {};
  me?.points.forEach(item => {
    initialValues[`price${item.id}`] =
      currentFilter.point_prices.find(point => point.point.id === item.id)?.price || "";
  });
  return initialValues;
};

const getValidationObject = (me: IUser | undefined, intl: any) => {
  let validationObject: { [x: string]: any } = {};
  me?.points.forEach(item => {
    validationObject[`price${item.id}`] = Yup.number().typeError(
      intl.formatMessage({ id: "AUTH.VALIDATION.INVALID_FIELD" })
    );
  });
  return validationObject;
};

const getFilterEditArray = (values: { [x: string]: any }) => {
  let filterEditArray: IPointPriceForEdit[] = [];
  for (let key in values) {
    if (values[key]) filterEditArray.push({ point_id: +key.slice(5), price: +values[key] });
  }
  return filterEditArray;
};

interface IProps {
  currentFilter: IMyFilterItem;
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
}) => {
  const classes = useStyles();

  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    touched,
    errors,
  } = useFormik({
    initialValues: getInitialValues(me, currentFilter),
    onSubmit: values => {
      editFilter({
        id: currentFilter.id,
        data: { crop_id: currentFilter.crop.id, point_prices: getFilterEditArray(values) },
      });
    },
    validationSchema: Yup.object().shape(getValidationObject(me, intl)),
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.SAVE_FILTER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEditFilter();
    }
  }, [clearEditFilter, editError, editSuccess, enqueueSnackbar, intl]);

  useEffect(() => {
    resetForm({ values: getInitialValues(me, currentFilter) });
  }, [currentFilter, me, myFilters, resetForm]);

  return (
    <>
      {me?.points.map((item, index) => (
        <div key={index}>
          <div className={classes.textFieldContainer}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item>{item.name}</Grid>
              <Grid item>
                <TextField
                  type="text"
                  autoComplete="off"
                  label={intl.formatMessage({
                    id: "FILTERS.PRICE",
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
                />
              </Grid>
            </Grid>
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
            onPress={handleSubmit}
          >
            {intl.formatMessage({ id: "ALL.BUTTONS.SAVE" })}
          </ButtonWithLoader>
        </div>
      </div>
    </>
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
  }),
  {
    fetchFilters: myFiltersActions.fetchRequest,
    clearCreateFilter: myFiltersActions.clearCreate,
    createFilter: myFiltersActions.createRequest,
    clearDelFilter: myFiltersActions.clearDel,
    delFilter: myFiltersActions.delRequest,
    clearEditFilter: myFiltersActions.clearEdit,
    editFilter: myFiltersActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(PointsPrices));
