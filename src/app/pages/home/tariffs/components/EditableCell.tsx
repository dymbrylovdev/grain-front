import React, { useEffect } from "react";
import { makeStyles, createStyles, TextField, CircularProgress } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect, ConnectedProps } from "react-redux";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";

import { IAppState } from "../../../../store/rootDuck";
import { TTariffField, ITariff } from "../../../../interfaces/tariffs";
import NumberFormatInt from "../../../../components/NumberFormatCustom/NumberFormatInt";

const useInnerStyles = makeStyles(theme =>
  createStyles({
    tabCell: {
      height: 53,
      minWidth: 63,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    tabCellText: {
      cursor: "pointer",
      width: "max-content",
      padding: 10,
    },
    textField: {
      margin: 0,
      width: 63,
      height: 53,
    },
  })
);

type TProps = {
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
}) => {
  const innerClasses = useInnerStyles();

  const { values, handleSubmit, handleChange, resetForm } = useFormik({
    initialValues: { value: tariff[realCell.field] },
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
      if (+values.value > 1000) {
        realValue = 1000;
      }
      if (+values.value !== tariff[realCell.field]) {
        edit(realCell.id, { [realCell.field]: realValue });
      } else {
        setCell({ id: 0, field: undefined });
      }
    },
  });

  useEffect(() => {
    resetForm({ values: { value: tariff[realCell.field] } });
  }, [realCell.field, resetForm, tariff]);

  const { enqueueSnackbar } = useSnackbar();

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

  return (
    <div className={innerClasses.tabCell}>
      {editLoading && cell.id === realCell.id && cell.field === realCell.field ? (
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
  }),
  {
    clearEdit: tariffsActions.clearEdit,
    edit: tariffsActions.editRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(EditableCell));
