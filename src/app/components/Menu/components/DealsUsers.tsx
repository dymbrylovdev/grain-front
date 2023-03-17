import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TableFooter,
  Button,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";
import { actions as authActions } from "../../../store/ducks/auth.duck";
import { actions as tariffActions } from "../../../store/ducks/tariffs.duck";
import { actions as dealsActions } from "../../../store/ducks/deals.duck";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../../../pages/home/styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import InfoDialog from "../../../components/ui/Dialogs/InfoDialog";
import { LayoutSubheader } from "../../../../_metronic";
import { accessByRoles } from "../../../utils/utils";
import { roles } from "../../../pages/home/users/utils/profileForm";

const DealsUsers: React.FC<PropsFromRedux & WrappedComponentProps> = ({
  intl,
  page,
  perPage,
  total,
  fetch,
  prevUsersCount,
  users,
  loading,
  error,

  fetchMe,
  me,
  meError,

  fetchFunnelStates,
  funnelStates,
  funnelStateSuccess,
  funnelStatesLoading,
  funnelStatesError,
  currentFunnelState,

  clearCreate,
  create,
  createLoading,
  createSuccess,
  createError,

  clearDel,
  del,
  delLoading,
  delSuccess,
  delError,

  clearEdit,
  edit,
  editLoading,
  editSuccess,
  editError,

  fetchTariffTypes,
  tariffsTypes,
  tariffsTypesLoading,
  tariffsTypesSuccess,
  tariffsTypesError,

  usersFilterTariff,

  clearUserRoles,
  fetchUserRoles,
  userRoles,
  userRolesLoading,
  userRolesSuccess,
  userRolesError,

  currentUserRoles,

  boughtTariff,

  setUsersFilterTariff,
  setFunnelState,
  setUserIdSelected,
  userIdSelected,
  fetchDeals,
  pageDeals,
  perPageDeals,
  totalDeals,
  weeks,
  term,
  min_prepayment_amount,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const prevUsers = Array.apply(null, Array(prevUsersCount));

  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [funnelStateEditId, setFunnelStateEditId] = useState(0);
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
      fetch({ page, perPage, tariffId, funnelStateId, boughtTariff });
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
      fetch({ page, perPage, tariffId, funnelStateId, userRolesId, boughtTariff });
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
    fetch({ page, perPage, tariffId, funnelStateId, userRolesId, boughtTariff });
  }, [fetch, page, perPage, tariffId, funnelStateId, userRolesId, boughtTariff]);

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

                    <TableCell>{intl.formatDate(item?.created_at)}</TableCell>
                    <TableCell>{roles.find(role => role.id === item.roles[0])?.value}</TableCell>
                    <TableCell>
                      <Button style={{ color: '#3c5fe8' }}
                        onClick={() => {
                          setUserIdSelected(item.id);
                          fetchDeals(pageDeals, perPageDeals, weeks, !term ? 999 : +term, min_prepayment_amount ? min_prepayment_amount : undefined, item.id);
                        }}
                      >
                        <FormattedMessage id="TARIFFS.PAYMENT.PAY" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
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
    me: state.auth.user,
    meError: state.auth.error,
    page: state.users.page,
    perPage: state.users.per_page,
    total: state.users.total,
    prevUsersCount: state.users.prevUsersCount,
    users: state.users.users,
    loading: state.users.loading,
    error: state.users.error,
    userIdSelected: state.users.userIdSelected,

    funnelStates: state.funnelStates.funnelStates,
    funnelStatesLoading: state.funnelStates.loading,
    funnelStateSuccess: state.funnelStates.success,
    funnelStatesError: state.funnelStates.error,
    currentFunnelState: state.funnelStates.currentFunnelState,

    createLoading: state.users.createLoading,
    createSuccess: state.users.createSuccess,
    createError: state.users.createError,

    editLoading: state.users.editLoading,
    editSuccess: state.users.editSuccess,
    editError: state.users.editError,

    delLoading: state.users.delLoading,
    delSuccess: state.users.delSuccess,
    delError: state.users.delError,

    tariffsTypes: state.tariffs.tariffsTypes,
    tariffsTypesLoading: state.tariffs.tariffsTypesLoading,
    tariffsTypesSuccess: state.tariffs.tariffsTypesSuccess,
    tariffsTypesError: state.tariffs.tariffsTypesError,

    usersFilterTariff: state.tariffs.usersFilterTariff,

    userRoles: state.users.roles,
    userRolesLoading: state.users.userRolesLoading,
    userRolesSuccess: state.users.userRolesSuccess,
    userRolesError: state.users.userRolesError,

    currentUserRoles: state.users.currentRoles,

    boughtTariff: state.users.boughtTariff,
    
    pageDeals: state.deals.page,
    perPageDeals: state.deals.per_page,
    totalDeals: state.deals.total,
    weeks: state.deals.weeks,
    term: state.deals.term,
    min_prepayment_amount: state.deals.min_prepayment_amount,
  }),
  {
    fetchMe: authActions.fetchRequest,
    fetch: usersActions.fetchRequest,
    fetchDeals: dealsActions.fetchRequest,

    fetchFunnelStates: funnelStatesActions.fetchRequest,

    clearCreate: usersActions.clearCreate,
    create: usersActions.createRequest,

    clearEdit: usersActions.clearEdit,
    edit: usersActions.editRequest,

    clearDel: usersActions.clearDel,
    del: usersActions.delRequest,
    fetchTariffTypes: tariffActions.tariffsTypesRequest,
    clearUserRoles: usersActions.clearUserRoles,
    fetchUserRoles: usersActions.userRolesRequest,
    setUserIdSelected: usersActions.setUserIdSelected,

    setUsersFilterTariff: tariffActions.setUsersFilterTariff,
    setFunnelState: funnelStatesActions.setFunnelState,
  }
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(DealsUsers));
