import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { injectIntl, IntlShape, WrappedComponentProps } from "react-intl";
import { useSnackbar } from "notistack";

import { IAppState } from "../../../store/rootDuck";
import { actions as locationsActions } from "../../../store/ducks/locations.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";

import LocationDialog from "../../../pages/home/bids/components/location/LocationDialog";

interface IProps {
  me: any;
  intl: IntlShape;
  classes: any;
}

const LocationBlockMenu: React.FC<IProps & PropsFromRedux & WrappedComponentProps> = ({
  me,
  intl,
  classes,

  fetchMe,

  clearEdit,
  edit,

  editLoading,
  editSuccess,
  editError,
}) => {
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const toggleLocationsModal = () => {
    setLocationModalOpen(!locationModalOpen);
  };

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.POINTS.EDIT" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEdit();
      fetchMe();
    }
  }, [
    fetchMe,
    edit,
    clearEdit,
    editError,
    // editMode,
    editSuccess,
    enqueueSnackbar,
    intl,
  ]);

  return (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      {me && !me.points.length && <h6>У вас ещё нет точек отгрузки / погрузки</h6>}

      {me &&
        me.points.map(point => (
          <React.Fragment key={point.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={point.active}
                  onChange={() => {
                    edit({ id: point.id, data: { active: !point.active, user_id: me.id } });
                  }}
                />
              }
              label={point.name}
              name="active"
            />
            {/* <h6>{point.name}</h6> */}
          </React.Fragment>
        ))}

      <Button onClick={toggleLocationsModal} variant="contained" color="primary" style={{ width: "100%", marginTop: 10 }}>
        {["ROLE_BUYER"].includes(me.roles[0])
          ? intl.formatMessage({ id: "LOCATIONS.PRICES.BUYER" })
          : ["ROLE_VENDOR"].includes(me.roles[0])
          ? intl.formatMessage({ id: "LOCATIONS.PRICES.VENDOR" })
          : intl.formatMessage({ id: "LOCATIONS.PRICES.MODAL_NAME" })}
      </Button>

      <LocationDialog isOpen={locationModalOpen} handleClose={() => setLocationModalOpen(false)} user={me} classes={classes} intl={intl} />
    </div>
  );
};

const connector = connect(
  (state: IAppState) => ({
    editLoading: state.locations.editLoading,
    editSuccess: state.locations.editSuccess,
    editError: state.locations.editError,
  }),
  {
    fetchMe: authActions.fetchRequest,
    clearEdit: locationsActions.clearEdit,
    edit: locationsActions.editRequest,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(LocationBlockMenu));
