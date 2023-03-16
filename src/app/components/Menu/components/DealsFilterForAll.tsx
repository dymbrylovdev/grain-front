import React, { useEffect, useState } from "react";
import { connect, ConnectedProps, shallowEqual, useSelector } from "react-redux";
import { Divider, makeStyles, TextField, FormControlLabel, Checkbox, MenuItem, Modal, Button } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { actions as dealsActions } from "../../../store/ducks/deals.duck";
import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as tariffActions } from "../../../store/ducks/tariffs.duck";
import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";
import { actions as crops2Actions } from "../../../store/ducks/crops2.duck";

import { IAppState } from "../../../store/rootDuck";
import NumberFormatCustom from "../../NumberFormatCustom/NumberFormatCustom";
import  MadalBids from "../../ui/Modal";
import DealsUsers from "./DealsUsers";
import UsersPageList from "../../../pages/home/bids/BitsPageList";

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
  fetchUsers,
  managerIdSelected,
  setManagerIdSelected,
  bidSelected,
  setUserActive
}) => {
  const [open, setOpen] = useState(false);
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
  }

  useEffect(() => {
    handleClose()
  }, [userIdSelected])

  useEffect(() => {
    fetchUsers({ page: 1, perPage: 999, userRolesId: "ROLE_MANAGER" });
  }, [])

  const classes = useStyles();
  const [cropId, setCropId] = useState(0);
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
        content={<div>
          {/*@ts-ignore*/}
          <UsersPageList onClose={ () => setOpen(false)}/>
        </div>}
      />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.WORK_WITH_USER" })}
        <TextField
          select
          margin="normal"
          variant="outlined"
          defaultValue={"Не важно"}
          onChange={(e) => {
            setUserActive(JSON.parse(e.target.value))
            fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, userIdSelected, cropId, bidSelected?.id || 0, managerIdSelected, JSON.parse(e.target.value))
          }}
        >
          <MenuItem value={'true'} key={1}>Да</MenuItem>
          <MenuItem value={'false'} key={2}>Нет</MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MANAGER" })}
        <TextField
          select
          margin="normal"
          variant="outlined"
          defaultValue={"Все"}
          onChange={(e) => {
            setManagerIdSelected(Number(e.target.value))
            fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, userIdSelected, cropId, bidSelected?.id || 0, Number(e.target.value))
          }}
        >
          <MenuItem value={0} key={0}>Все</MenuItem>
          {users &&
            users.map(item => (
              item.roles[1] !== 'ROLE_MANAGER' && (
                <MenuItem key={item.id} value={item.id}>
                  {
                    (item.firstname? item.firstname : '')
                    + ' ' + 
                    (item.surname? item.surname : '')
                    + ' ' + 
                    ((!item.firstname && !item.surname)? item.email || item.phone : '')
                  }
                </MenuItem>
              )
            ))}
        </TextField>
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.ROLE" })}
        <TextField
          select
          margin="normal"
          defaultValue={"Все"}
          onChange={e => {
            setCurrentRoles(e.target.value);
            setUsersFilterTariff("Все");
            setFunnelState("Все");
          }}
          name="roles"
          variant="outlined"
        >
          <MenuItem key={1} value={"Все"}>Все</MenuItem>
          <MenuItem key={2} value={'ROLE_VENDOR'}>Продавец</MenuItem>
          <MenuItem key={3} value={'ROLE_BUYER'}>Покупатель</MenuItem>
        </TextField>
      </div>
      <div className={classes.nested}>
        <MenuItem
          onClick={() => setOpenModal(true)}
          style={{
            marginLeft: -16
          }}
        >
          Список пользователей
        </MenuItem>
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
            onChange={(e) => {
              setCropId(Number(e.target.value))
              fetch(page, perPage, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, userIdSelected, Number(e.target.value))
            }}
            variant="outlined"
          >
            {crops!.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>
      <div className={classes.nested}>
        <MenuItem
          onClick={() => setOpen(true)}
          disabled={userIdSelected === 0}
        >
          {intl.formatMessage({ id: "USER.EDIT_FORM.BIDS" })}
        </MenuItem>
      </div>

      <Divider style={{ margin: "6px 0" }} />

      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.BEST_WEEK_DEALS" })}
        <TextField
          type="text"
          margin="normal"
          variant="outlined"
        />
      </div>
      <div className={classes.nested}>
        {intl.formatMessage({ id: "FILTER.FORM.MAX_CALC_DATES" })}
        <TextField
          type="text"
          margin="normal"
          variant="outlined"
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
          position:'fixed',
          top:'11%',
          left: '5%',
          overflow:'auto',
          minWidth: '90%',
          minHeight: '85%',
          width: '90%',
          height:'85%',
          display:'block'
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
    managerIdSelected: state.users.managerIdSelected,
    bidSelected: state.bids.bidSelected,
  }),
  {
    ...dealsActions,
    fetch: dealsActions.fetchRequest,
    fetchUsers: usersActions.fetchRequest,
    setCurrentRoles: usersActions.setCurrentRoles,
    setUsersFilterTariff: tariffActions.setUsersFilterTariff,
    setFunnelState: funnelStatesActions.setFunnelState,
    setManagerIdSelected: usersActions.setManagerIdSelected,
    setUserActive: usersActions.setUserActive,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsFilterForAll));
