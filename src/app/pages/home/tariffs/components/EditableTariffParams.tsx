import React from "react";
import { connect, ConnectedProps } from "react-redux";

import { IAppState } from "../../../../store/rootDuck";
import { actions as tariffsActions } from "../../../../store/ducks/tariffs.duck";

const EditableTariffParams: React.FC<TPropsFromRedux> = ({
  loading,
  error,

  editLoading,
  editSuccess,
  editError,

  clearEdit,
  edit,
}) => {
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
