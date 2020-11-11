import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { TextField, CircularProgress } from "@material-ui/core";

import { ITariff } from "../../../../interfaces/tariffs";
import { IAppState } from "../../../../store/rootDuck";
import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";

type TProps = {
  useInnerStyles: any,
  tariff: ITariff,
}

const EditableTariffParams: React.FC<TPropsFromRedux & TProps> = ({
  useInnerStyles,

  tariff,
  loading,
  error,

  editLoading,
  editSuccess,
  editError,

  clearEdit,
  edit,
}) => {
  const innerClasses = useInnerStyles();

  const test = tariff.tariff_parameters;
  console.log(test);

  return (
    <div>
      
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

export default connector(EditableTariffParams);
