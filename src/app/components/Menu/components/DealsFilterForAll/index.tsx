import React, { useEffect, useState } from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { Divider, makeStyles, TextField, FormControlLabel, Checkbox, MenuItem, Modal } from "@material-ui/core";
import ClearIcon from "@mui/icons-material/Clear";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { actions as dealsActions } from "../../../../store/ducks/deals.duck";
import { actions as usersActions } from "../../../../store/ducks/users.duck";
import { actions as tariffActions } from "../../../../store/ducks/tariffs.duck";
import { actions as funnelStatesActions } from "../../../../store/ducks/funnelStates.duck";

import { IAppState } from "../../../../store/rootDuck";
import NumberFormatCustom from "../../../NumberFormatCustom/NumberFormatCustom";
import MadalBids from "../../../ui/Modal";
import DealsUsers from "../DealsUsers";
import UsersPageList from "../../../../pages/home/bids/BitsPageList";
import { useUsersForRole } from "./hooks/useUsersForRole";

const useStyles = makeStyles(theme => ({
  nester: {
    justifyContent: "space-between",
  },
  nested: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    fontSize: 12,
  },
}));

const DealsFilterForAll: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  setWeeks,
  setTerm,
  setPrepayment,
  crops,
  fetch,
  page,
  perPage,
  setCurrentRoles,
  setUsersFilterTariff,
  setFunnelState,
  userIdSelected,
  users,
  managerIdSelected,
  setManagerIdSelected,
  bidSelected,
  setUserActive,
  fetchUser,
  user,
  setUserIdSelected,
  userActive,
  currentRoles,
  cropSelected,
  setCropSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [fetchUsersRole, loadingUsers, usersRole] = useUsersForRole();
  const { weeks, term, min_prepayment_amount } = useSelector(
    ({ deals: { weeks, term, min_prepayment_amount } }: IAppState) => ({
      weeks,
      term,
      min_prepayment_amount,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (min_prepayment_amount === 100) setTerm(undefined);
  }, [min_prepayment_amount, setTerm]);

  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    handleClose();
    if (userIdSelected !== 0) {
      fetchUser({
        id: userIdSelected,
      });
    }
  }, [userIdSelected]);

  useEffect(() => {
    fetchUsersRole(1, 999, "ROLE_MANAGER");
  }, []);

  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      {/* this logic will be needed in the upcoming tasks  */}
      {/* <div className={classes.nested}>
        {intl.formatMessage({ id: "DEALS.WEEKS.TEXT" })}
        <TextField
          margin="normal"
          label={intl.formatMessage({
            id: "DEALS.WEEKS.WEEKS",
          })}
          value={weeks}
          onChange={e => {
            let newValue = e.target.value;
            if (+newValue < 1) {
              newValue = "1";
            }
            if (+newValue > 100) {
              newValue = "100";
            }
            setWeeks(+newValue);
          }}
          InputProps={{ inputComponent: NumberFormatCustom as any }}
          variant="outlined"
          autoComplete="off"
        />
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MAX_PAYMENT_TERM1" })}
        <TextField
          type="text"
          label={intl.formatMessage({
            id: "FILTER.FORM.MAX_PAYMENT_TERM2",
          })}
          margin="normal"
          name="term"
          value={term || ""}
          variant="outlined"
          onChange={e => {
            let newValue = e.target.value;
            if (+newValue < 0) {
              newValue = "0";
            }
            if (+newValue > 999) {
              newValue = "999";
            }
            setTerm(+newValue);
          }}
          InputProps={{ inputComponent: NumberFormatCustom as any }}
          autoComplete="off"
          disabled={min_prepayment_amount === 100}
        />
      </div>
      <div className={classes.nested}>
        <FormControlLabel
          control={
            <Checkbox
              checked={min_prepayment_amount === 100}
              onChange={() => {
                setPrepayment(min_prepayment_amount === 100 ? 0 : 100);
              }}
            />
          }
          label={"Только с предоплатой"}
          name="fullPrepayment"
        />
      </div> */}
      <MadalBids
        open={open}
        onClose={() => setOpen(false)}
        title={"Выбор объявления"}
        actions={[
          {
            title: intl.formatMessage({ id: "ALL.BUTTONS.PREV" }),
            onClick: () => setOpen(false),
          },
        ]}
        content={
          <div>
            {/*@ts-ignore*/}
            <UsersPageList onClose={() => setOpen(false)} />
          </div>
        }
      />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.WORK_WITH_USER" })}
        <TextField
          select
          margin="normal"
          variant="outlined"
          defaultValue={ "null"}
          onChange={e => {
            setUserActive(JSON.parse(e.target.value));
            fetch(
              page,
              perPage,
              weeks,
              !term ? 999 : +term,
              min_prepayment_amount ? min_prepayment_amount : undefined,
              userIdSelected,
              cropSelected,
              bidSelected?.id || 0,
              managerIdSelected,
              JSON.parse(e.target.value),
              currentRoles
            );
          }}
        >
          <MenuItem value={"null"} key={0}>
            Не важно
          </MenuItem>
          <MenuItem value={"true"} key={1}>
            Да
          </MenuItem>
          <MenuItem value={"false"} key={2}>
            Нет
          </MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MANAGER" })}
        <TextField
          select
          margin="normal"
          variant="outlined"
          defaultValue={0}
          disabled={loadingUsers}
          onChange={e => {
            setManagerIdSelected(Number(e.target.value));
            fetch(
              page,
              perPage,
              weeks,
              !term ? 999 : +term,
              min_prepayment_amount ? min_prepayment_amount : undefined,
              userIdSelected,
              cropSelected,
              bidSelected?.id || 0,
              Number(e.target.value),
              userActive,
              currentRoles
            );
          }}
        >
          <MenuItem value={0} key={0}>
            Все
          </MenuItem>
          {usersRole &&
            usersRole.map(
              item =>
                item.roles[1] !== "ROLE_MANAGER" && (
                  <MenuItem key={item.id} value={item.id}>
                    {(item.firstname ? item.firstname : "") +
                      " " +
                      (item.surname ? item.surname : "") +
                      " " +
                      (!item.firstname && !item.surname ? item.email || item.phone : "")}
                  </MenuItem>
                )
            )}
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.ROLE" })}
        <TextField
          select
          margin="normal"
          defaultValue={"ROLE_VENDOR,ROLE_BUYER"}
          onChange={e => {
            setCurrentRoles(e.target.value);
            setUsersFilterTariff("Все");
            setFunnelState("Все");
            fetch(
              page,
              perPage,
              weeks,
              !term ? 999 : +term,
              min_prepayment_amount ? min_prepayment_amount : undefined,
              userIdSelected,
              cropSelected,
              bidSelected?.id || 0,
              managerIdSelected,
              userActive,
              e.target.value
            );
          }}
          name="roles"
          variant="outlined"
        >
          <MenuItem key={1} value={"ROLE_VENDOR,ROLE_BUYER"}>
            Все
          </MenuItem>
          <MenuItem key={2} value={"ROLE_VENDOR"}>
            Продавец
          </MenuItem>
          <MenuItem key={3} value={"ROLE_BUYER"}>
            Покупатель
          </MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        <MenuItem
          onClick={() => setOpenModal(true)}
          style={{
            marginLeft: -16,
          }}
        >
          Список пользователей
        </MenuItem>
        {user && userIdSelected ? (
          <div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {(user.firstname ? user.firstname : "") +
                " " +
                (user.surname ? user.surname : "") +
                " " +
                (!user.firstname && !user.surname ? user.email || user.phone : "")}
              <MenuItem
                style={{
                  marginLeft: -16,
                  display: "inline",
                }}
              >
                <ClearIcon
                  onClick={() => {
                    setUserIdSelected(0);
                    fetch(
                      page,
                      perPage,
                      weeks,
                      !term ? 999 : +term,
                      min_prepayment_amount ? min_prepayment_amount : undefined,
                      0,
                      cropSelected,
                      bidSelected?.id || 0,
                      managerIdSelected,
                      userActive,
                      currentRoles
                    );
                  }}
                  style={{
                    marginTop: -3,
                  }}
                />
              </MenuItem>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>

      <Divider style={{ margin: "6px 0" }} />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.CULTURE" })}
        {crops && (
          <TextField
            select
            margin="normal"
            label={intl.formatMessage({
              id: "DEALS.CROPS.TITLE",
            })}
            onChange={e => {
              setCropSelected(Number(e.target.value));
              fetch(
                page,
                perPage,
                weeks,
                !term ? 999 : +term,
                min_prepayment_amount ? min_prepayment_amount : undefined,
                userIdSelected,
                Number(e.target.value),
                bidSelected?.id || 0,
                managerIdSelected,
                userActive,
                currentRoles
              );
            }}
            variant="outlined"
          >
            <MenuItem key={1} value={0}>
              Все культуры
            </MenuItem>
            {crops!.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>
      <div className={classes.nested}>
        <MenuItem onClick={() => setOpen(true)} disabled={userIdSelected === 0}>
          {intl.formatMessage({ id: "USER.EDIT_FORM.BIDS" })}
        </MenuItem>
      </div>

      <Divider style={{ margin: "6px 0" }} />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.BEST_WEEK_DEALS" })}
        <TextField
          type="text"
          margin="normal"
          value={weeks}
          onChange={e => {
            let newValue = e.target.value;
            if (+newValue < 1) {
              newValue = "1";
            }
            if (+newValue > 100) {
              newValue = "100";
            }
            setWeeks(+newValue);
          }}
          InputProps={{ inputComponent: NumberFormatCustom as any }}
          variant="outlined"
          autoComplete="off"
        />
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MAX_CALC_DATES" })}
        <TextField
          type="text"
          margin="normal"
          name="term"
          value={term || ""}
          variant="outlined"
          onChange={e => {
            let newValue = e.target.value;
            if (+newValue < 0) {
              newValue = "0";
            }
            if (+newValue > 999) {
              newValue = "999";
            }
            setTerm(+newValue);
          }}
          InputProps={{ inputComponent: NumberFormatCustom as any }}
          autoComplete="off"
          disabled={min_prepayment_amount === 100}
        />
      </div>
      <div className={classes.nested}>
        <FormControlLabel
          control={
            <Checkbox
              checked={min_prepayment_amount === 100}
              onChange={() => {
                setPrepayment(min_prepayment_amount === 100 ? 0 : 100);
              }}
            />
          }
          label={"Только с предоплатой"}
          name="fullPrepayment"
        />
      </div>

      <Divider style={{ margin: "6px 0" }} />

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          position: "fixed",
          top: "11%",
          left: "5%",
          overflow: "auto",
          minWidth: "90%",
          minHeight: "85%",
          width: "90%",
          height: "85%",
          display: "block",
        }}
      >
        <DealsUsers />
      </Modal>
    </>
  );
};

const connector = connect(
  (state: IAppState) => ({
    crops: state.crops2.crops,
    page: state.deals.page,
    perPage: state.deals.per_page,
    userIdSelected: state.users.userIdSelected,
    users: state.users.users,
    user: state.users.user,
    managerIdSelected: state.users.managerIdSelected,
    bidSelected: state.bids.bidSelected,
    userActive: state.users.userActive,
    currentRoles: state.users.currentRoles,
    cropSelected: state.users.cropSelected,
  }),
  {
    ...dealsActions,
    fetch: dealsActions.fetchRequest,
    fetchUsers: usersActions.fetchRequest,
    fetchUser: usersActions.fetchByIdRequest,
    setCurrentRoles: usersActions.setCurrentRoles,
    setUsersFilterTariff: tariffActions.setUsersFilterTariff,
    setFunnelState: funnelStatesActions.setFunnelState,
    setManagerIdSelected: usersActions.setManagerIdSelected,
    setUserActive: usersActions.setUserActive,
    setUserIdSelected: usersActions.setUserIdSelected,
    setCropSelected: usersActions.setCropSelected,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsFilterForAll));
