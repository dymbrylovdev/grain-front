import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableFooter, Button } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as tariffActions } from "../../../store/ducks/tariffs.duck";
import { actions as dealsActions } from "../../../store/ducks/deals.duck";

import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../../../pages/home/styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import { roles } from "../../../pages/home/users/utils/profileForm";

const DealsUsers: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  page,
  perPage,
  total,
  fetch,
  prevUsersCount,
  users,
  error,

  fetchMe,
  meError,

  fetchFunnelStates,
  funnelStates,
  funnelStateSuccess,
  funnelStatesError,
  currentFunnelState,

  clearDel,
  delSuccess,
  delError,

  clearEdit,
  editSuccess,
  editError,

  fetchTariffTypes,
  tariffsTypes,
  tariffsTypesSuccess,
  tariffsTypesError,

  usersFilterTariff,

  fetchUserRoles,
  userRoles,
  userRolesSuccess,

  currentUserRoles,

  boughtTariff,

  setUserIdSelected,
  fetchDeals,
  pageDeals,
  perPageDeals,
  weeks,
  term,
  min_prepayment_amount,
  userActive,
  managerIdSelected,
  currentRoles,
  cropSelected,
  bidSelected,
}) => {
  const classes = useStyles();
  const prevUsers = Array.apply(null, Array(prevUsersCount));

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [tariffId, setTariffId] = useState<number | undefined>();
  const [funnelStateId, setFunnelStateId] = useState<number | undefined>();
  const [userRolesId, setUserRolesId] = useState<string | undefined>("ROLE_VENDOR,ROLE_BUYER");

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (editSuccess || editError) {
      enqueueSnackbar(
        editSuccess
          ? intl.formatMessage({ id: "NOTISTACK.USERS.SAVE_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${editError}`,
        {
          variant: editSuccess ? "success" : "error",
        }
      );
      clearEdit();
    }
    if (editSuccess) {
      fetch({ page, perPage, tariffId, funnelStateId, boughtTariff, userActive });
    }
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, fetch, intl, page, perPage, tariffId, funnelStateId, boughtTariff]);

  useEffect(() => {
    if (delSuccess || delError) {
      enqueueSnackbar(
        delSuccess
          ? intl.formatMessage({ id: "NOTISTACK.ERRORS.DEL_USER" })
          : `${intl.formatMessage({ id: "NOTISTACK.ERRORS.ERROR" })} ${delError}`,
        {
          variant: delSuccess ? "success" : "error",
        }
      );
      setAlertOpen(false);
      clearDel();
      fetch({ page, perPage, tariffId, funnelStateId, userRolesId: currentRoles, boughtTariff, userActive, managerId: managerIdSelected });
      fetchFunnelStates();
    }
  }, [
    clearDel,
    delError,
    delSuccess,
    enqueueSnackbar,
    fetch,
    fetchFunnelStates,
    intl,
    page,
    perPage,
    tariffId,
    funnelStateId,
    userRolesId,
    boughtTariff,
  ]);

  useEffect(() => {
    fetch({ page, perPage, tariffId, funnelStateId, userRolesId: currentRoles, boughtTariff, userActive, managerId: managerIdSelected });
  }, [fetch, page, perPage, tariffId, funnelStateId, userRolesId, boughtTariff, userActive]);

  useEffect(() => {
    fetchFunnelStates(currentUserRoles);
  }, [fetchFunnelStates, currentUserRoles]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    fetchTariffTypes(currentUserRoles);
  }, [fetchTariffTypes, currentUserRoles]);

  //TODO: Убрать сравнение по строкам

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  useEffect(() => {
    if (tariffsTypesSuccess)
      tariffsTypes.forEach(item => {
        if (usersFilterTariff === "Все") setTariffId(undefined);
        if (item.id === usersFilterTariff) setTariffId(item.id);
      });
  }, [tariffsTypes, tariffsTypesSuccess, usersFilterTariff]);

  useEffect(() => {
    if (funnelStateSuccess)
      funnelStates?.forEach(item => {
        if (currentFunnelState === "Все") setFunnelStateId(undefined);
        // @ts-ignore
        if (item.id === +currentFunnelState) setFunnelStateId(item.id);
      });
  }, [funnelStateSuccess, currentFunnelState, funnelStates]);

  useEffect(() => {
    if (userRolesSuccess)
      userRoles?.find(item => {
        if (currentUserRoles === "Все") setUserRolesId(undefined);
        if (item.name === currentUserRoles) setUserRolesId(item.name);
      });
  }, [currentUserRoles, userRoles, userRolesSuccess]);

  if (error || meError || funnelStatesError || tariffsTypesError) {
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  return (
    <Paper className={classes.paperWithTable}>
      {!users || !funnelStates ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          {prevUsers.map((item, index) => (
            <Skeleton width="100%" height={77} key={index} animation="wave" />
          ))}
          <Skeleton width="100%" height={53} animation="wave" />
        </>
      ) : (
        <div className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell>
                  <FormattedMessage id="USERLIST.TABLE.ID" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="USERLIST.TABLE.CONTANCTS" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="USERLIST.TABLE.NAME" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="USERLIST.TABLE.REGDATE" />
                </TopTableCell>
                <TopTableCell>
                  <FormattedMessage id="USERLIST.TABLE.ROLE" />
                </TopTableCell>
                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>

                    <TableCell>
                      <div>
                        <div className={classes.topAndBottomMargin1}>{item.email}</div>
                        {!!item.phone && <div className={classes.topAndBottomMargin1}>{item.phone}</div>}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className={classes.topAndBottomMargin1}>{`${item.fio || ""}`}</div>
                        {item.company && <div className={classes.topAndBottomMargin1}>{`${item.company.short_name || ""}`}</div>}
                      </div>
                    </TableCell>

                    <TableCell>{intl.formatDate(item?.created_at) === '01.01.1970' ? '-' :
                      intl.formatDate(item?.created_at)}</TableCell>
                    <TableCell>{roles.find(role => role.id === item.roles[0])?.value}</TableCell>
                    <TableCell>
                      <Button
                        style={{ color: "#3c5fe8" }}
                        onClick={() => {
                          setUserIdSelected(item.id);
                          fetchDeals(
                            pageDeals,
                            perPageDeals,
                            weeks,
                            !term ? 999 : +term,
                            min_prepayment_amount ? min_prepayment_amount : undefined,
                            item.id,
                            cropSelected,
                            bidSelected?.id || 0,
                            managerIdSelected,
                            userActive,
                            currentRoles
                          );
                        }}
                      >
                        <FormattedMessage id="TARIFFS.PAYMENT.PAY" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePaginator
                  page={page}
                  realPerPage={users.length}
                  perPage={perPage}
                  total={total}
                  fetchRows={(page, perPage) =>
                    fetch({
                      page,
                      perPage,
                      tariffId,
                      funnelStateId,
                      userRolesId: currentRoles,
                      boughtTariff,
                      userActive,
                      managerId: managerIdSelected,
                    })
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    userActive: state.users.userActive,
    meError: state.auth.error,
    page: state.users.page,
    perPage: state.users.per_page,
    total: state.users.total,
    prevUsersCount: state.users.prevUsersCount,
    users: state.users.users,
    error: state.users.error,

    funnelStates: state.funnelStates.funnelStates,
    funnelStateSuccess: state.funnelStates.success,
    funnelStatesError: state.funnelStates.error,
    currentFunnelState: state.funnelStates.currentFunnelState,

    editSuccess: state.users.editSuccess,
    editError: state.users.editError,

    delSuccess: state.users.delSuccess,
    delError: state.users.delError,

    tariffsTypes: state.tariffs.tariffsTypes,
    tariffsTypesSuccess: state.tariffs.tariffsTypesSuccess,
    tariffsTypesError: state.tariffs.tariffsTypesError,

    usersFilterTariff: state.tariffs.usersFilterTariff,

    userRoles: state.users.roles,
    userRolesSuccess: state.users.userRolesSuccess,

    currentUserRoles: state.users.currentRoles,

    boughtTariff: state.users.boughtTariff,

    pageDeals: state.deals.page,
    perPageDeals: state.deals.per_page,
    weeks: state.deals.weeks,
    term: state.deals.term,
    min_prepayment_amount: state.deals.min_prepayment_amount,
    managerIdSelected: state.users.managerIdSelected,
    currentRoles: state.users.currentRoles,
    cropSelected: state.users.cropSelected,
    bidSelected: state.bids.bidSelected,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetch: usersActions.fetchRequest,
    fetchDeals: dealsActions.fetchRequest,

    fetchFunnelStates: funnelStatesActions.fetchRequest,

    clearEdit: usersActions.clearEdit,

    clearDel: usersActions.clearDel,
    fetchTariffTypes: tariffActions.tariffsTypesRequest,
    fetchUserRoles: usersActions.userRolesRequest,
    setUserIdSelected: usersActions.setUserIdSelected,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsUsers));
