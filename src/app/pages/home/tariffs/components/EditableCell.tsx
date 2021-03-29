import React, { useEffect } from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect, ConnectedProps } from "react-redux";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";

import { IAppState } from "../../../../store/rootDuck";
import { TTariffField, ITariff } from "../../../../interfaces/tariffs";
import NumberFormatInt from "../../../../components/NumberFormatCustom/NumberFormatInt";
import { id } from "date-fns/esm/locale";

type TProps = {
  useInnerStyles: any;
  realCell: {
    id: number;
    field: TTariffField;
  };
  cell: {
    id: number;
    field: TTariffField | undefined;
  };
  setCell: React.Dispatch<
    React.SetStateAction<{
      id: number;
      field: TTariffField | undefined;
    }>
  >;
  tariff: ITariff;
};

const EditableCell: React.FC<TProps & TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  useInnerStyles,
  realCell,
  cell,
  setCell,

  tariff,
  loading,
  error,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,

  clearEditPeriod,
  editPeriod,
  editPeriodLoading,
  editPeriodSuccess,
  editPeriodError,

  clearEditLimits,
  editLimits,
  editLimitsLoading,
  editLimitsSuccess,
  editLimitsError,
}) => {
  const innerClasses = useInnerStyles();

  console.log("tariff: ", tariff);

  const { values, handleSubmit, handleChange, resetForm } = useFormik({
    initialValues: { value: tariff[realCell.field], idForLimit: tariff.id },
    onSubmit: values => {
      let realValue = +values.value;
      if (+values.value <= 0) {
        realValue = 0;
      }
      if (realCell.field === "priority_places_bids_count" && +values.value > 10) {
        realValue = 10;
      }
      if (realCell.field === "priority_places_bids_on_mailing_count" && +values.value > 5) {
        realValue = 5;
      }
      if (+values.value !== tariff[realCell.field]) {
        realCell.field === "period"
          ? editPeriod(realCell.id, { [realCell.field]: realValue })
          : realCell.field === "price"
            ? edit(realCell.id, { [realCell.field]: realValue })
            : editLimits(values.idForLimit, { [realCell.field]: realValue });
      } else {
        setCell({ id: 0, field: undefined });
      }
    },
  });

  useEffect(() => {
    resetForm({ values: { value: tariff[realCell.field], idForLimit: tariff.id } });
  }, [realCell.field, resetForm, tariff]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (cell.id === realCell.id && cell.field === realCell.field) {
      if (editPeriodSuccess || editPeriodError) {
        enqueueSnackbar(
          editPeriodSuccess
            ? intl.formatMessage({ id: "NOTISTACK.TARIFF.EDIT" })
            : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editPeriodError}`,
          {
            variant: editPeriodSuccess ? "success" : "error",
          }
        );
        clearEditPeriod();
        setCell({ id: 0, field: undefined });
      }
    }
  }, [
    cell,
    clearEditPeriod,
    editPeriodError,
    editPeriodSuccess,
    enqueueSnackbar,
    intl,
    realCell,
    setCell,
  ]);

  useEffect(() => {
    if (cell.id === realCell.id && cell.field === realCell.field) {
      if (editSuccess || editError) {
        enqueueSnackbar(
          editSuccess
            ? intl.formatMessage({ id: "NOTISTACK.TARIFF.EDIT" })
            : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
          {
            variant: editSuccess ? "success" : "error",
          }
        );
        clearEdit();
        setCell({ id: 0, field: undefined });
      }
    }
  }, [cell, clearEdit, editError, editSuccess, enqueueSnackbar, intl, realCell, setCell]);

  useEffect(() => {
    if (cell.id === realCell.id && cell.field === realCell.field) {
      if (editLimitsSuccess || editLimitsError) {
        enqueueSnackbar(
          editLimitsSuccess
            ? intl.formatMessage({ id: "NOTISTACK.TARIFF.EDIT" })
            : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editLimitsError}`,
          {
            variant: editLimitsSuccess ? "success" : "error",
          }
        );
        clearEditLimits();
        setCell({ id: 0, field: undefined });
      }
    }
  }, [
    cell,
    clearEditLimits,
    editLimitsError,
    editLimitsSuccess,
    enqueueSnackbar,
    intl,
    realCell,
    setCell,
  ]);

  return (
    <div className={innerClasses.tabCell}>
      {editLoading &&
      editPeriodLoading &&
      editLimitsLoading &&
      cell.id === realCell.id &&
      cell.field === realCell.field ? (
        <CircularProgress color="inherit" size={30} />
      ) : cell.id === realCell.id && cell.field === realCell.field ? (
        <TextField
          autoFocus
          margin="normal"
          value={values.value}
          onChange={handleChange}
          onBlur={() => handleSubmit()}
          onKeyPress={e => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          name="value"
          variant="outlined"
          className={innerClasses.textField}
          autoComplete="off"
          InputProps={{
            inputComponent: NumberFormatInt as any,
          }}
        />
      ) : (
        <div
          className={innerClasses.tabCellText}
          onClick={() => {
            if (cell.id === 0) setCell(realCell);
          }}
        >
          <b>{tariff[realCell.field]}</b>
        </div>
      )}
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    loading: state.tariffs.loading,
    error: state.tariffs.error,

    editLoading: state.tariffs.editLoading,
    editSuccess: state.tariffs.editSuccess,
    editError: state.tariffs.editError,

    editPeriodLoading: state.tariffs.editPeriodLoading,
    editPeriodSuccess: state.tariffs.editPeriodSuccess,
    editPeriodError: state.tariffs.editPeriodError,

    editLimitsLoading: state.tariffs.editLimitsLoading,
    editLimitsSuccess: state.tariffs.editLimitsSuccess,
    editLimitsError: state.tariffs.editLimitsError,
  }),
  {
    clearEdit: tariffsActions.clearEdit,
    edit: tariffsActions.editRequest,
    clearEditPeriod: tariffsActions.clearEditPeriod,
    editPeriod: tariffsActions.editPeriodRequest,
    clearEditLimits: tariffsActions.clearEditLimits,
    editLimits: tariffsActions.editLimitsRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(EditableCell));
