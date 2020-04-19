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
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../store/ducks/users.duck";
import { actions as funnelStatesActions } from "../../../store/ducks/funnelStates.duck";

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import InfoDialog from "../../../components/ui/Dialogs/InfoDialog";

const UsersPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  page,
  perPage,
  total,
  fetch,
  prevUsersCount,
  users,
  loading,
  error,

  fetchFunnelStates,
  funnelStates,
  funnelStatesLoading,
  funnelStatesError,

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
}) => {
  const classes = useStyles();
  const history = useHistory();
  const prevUsers = Array.apply(null, Array(prevUsersCount));

  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [infoText, setInfoText] = useState("");

  const { enqueueSnackbar } = useSnackbar();
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
    }
  }, [clearDel, delError, delSuccess, enqueueSnackbar, intl]);

  useEffect(() => {
    fetch({ page, perPage });
  }, [fetch, page, perPage]);

  useEffect(() => {
    fetchFunnelStates();
  }, [fetchFunnelStates]);

  if (error || funnelStatesError) return <ErrorPage />;

  return (
    <Paper className={classes.tableContainer}>
      <Button
        className={classes.topAndBottomMargin}
        variant="contained"
        color="primary"
        onClick={() => history.push("/user/create")}
        disabled={!users || !funnelStates}
      >
        {intl.formatMessage({ id: "USERLIST.BUTTON.ADD_USER" })}
      </Button>
      {!users || !funnelStates ? (
        <>
          <Skeleton width="100%" height={52} />
          {prevUsers.map((item, index) => (
            <Skeleton width="100%" height={77} key={index} />
          ))}
          <Skeleton width="100%" height={53} />
        </>
      ) : (
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TopTableCell>
                <FormattedMessage id="USERLIST.TABLE.ID" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="USERLIST.TABLE.EMAIL" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="USERLIST.TABLE.NAME" />
              </TopTableCell>
              <TopTableCell>
                <FormattedMessage id="USERLIST.TABLE.ACTIVITY" />
              </TopTableCell>
              <TopTableCell></TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.fio}</TableCell>
                  <TableCell>
                    {item.is_admin ? (
                      <div className={classes.flexRow}>
                        <div
                          className={classes.funnelStateName}
                          style={{ backgroundColor: "#0abb87" }}
                        >
                          {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.ADMIN" })}
                        </div>
                        <IconButton
                          size="medium"
                          color="primary"
                          onClick={() => {
                            setInfoText(
                              intl.formatMessage({ id: "FUNNEL_STATES.DIALOGS.INFO.ADMIN_TEXT" })
                            );
                            setInfoOpen(true);
                          }}
                        >
                          <HelpOutlineIcon />
                        </IconButton>
                      </div>
                    ) : !item.funnel_state ? (
                      <div className={classes.flexRow}>
                        <div
                          className={classes.funnelStateName}
                          style={{ backgroundColor: "#f2f2f2" }}
                        >
                          {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.NO_NAME" })}
                        </div>
                        <IconButton
                          size="medium"
                          color="primary"
                          onClick={() => {
                            setInfoText(
                              intl.formatMessage({ id: "FUNNEL_STATES.DIALOGS.INFO.NO_TEXT" })
                            );
                            setInfoOpen(true);
                          }}
                        >
                          <HelpOutlineIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div className={classes.flexRow}>
                        <div
                          className={classes.funnelStateName}
                          style={{ backgroundColor: `${item.funnel_state.color || "#ededed"}` }}
                        >
                          {item.funnel_state.name}
                        </div>
                        <IconButton
                          size="medium"
                          color="primary"
                          onClick={() => {
                            setInfoText(
                              intl.formatMessage({ id: "FUNNEL_STATES.DIALOGS.INFO.EMPTY_TEXT" })
                            );
                            setInfoOpen(true);
                          }}
                        >
                          <HelpOutlineIcon />
                        </IconButton>
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title={intl.formatMessage({
                        id: "USERLIST.TOOLTIP.EDIT",
                      })}
                    >
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={() => history.push(`/user/edit/${item.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {(item.is_admin || item.is_vendor) && (
                      <Tooltip
                        title={intl.formatMessage({
                          id: "USERLIST.TOOLTIP.CREATE_BID",
                        })}
                      >
                        <IconButton
                          size="medium"
                          color="primary"
                          onClick={() => history.push(`/bid/create/${item.id}`)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip
                      title={intl.formatMessage({
                        id: "USERLIST.TOOLTIP.DELETE",
                      })}
                    >
                      <IconButton
                        size="medium"
                        color="secondary"
                        onClick={() => {
                          setDeleteUserId(item.id);
                          setAlertOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
                fetchRows={fetch}
                label={intl.formatMessage({ id: "USERLIST.PAGINATOR_TEXT" })}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
      <InfoDialog
        isOpen={isInfoOpen}
        handleClose={() => setInfoOpen(false)}
        title={intl.formatMessage({ id: "FUNNEL_STATES.DIALOGS.INFO.TITLE" })}
        text={infoText}
      />
      <AlertDialog
        isOpen={isAlertOpen}
        text={intl.formatMessage({
          id: "USERLIST.DIALOGS.DELETE_TEXT",
        })}
        okText={intl.formatMessage({
          id: "USERLIST.DIALOGS.AGREE_TEXT",
        })}
        cancelText={intl.formatMessage({
          id: "USERLIST.DIALOGS.CANCEL_TEXT",
        })}
        handleClose={() => setAlertOpen(false)}
        handleAgree={() => del({ id: deleteUserId })}
        loadingText={intl.formatMessage({
          id: "USERLIST.DIALOGS.LOADING_TEXT",
        })}
        isLoading={delLoading}
      />
    </Paper>
  );
};

const connector = connect(
  (state: IAppState) => ({
    page: state.users.page,
    perPage: state.users.per_page,
    total: state.users.total,
    prevUsersCount: state.users.prevUsersCount,
    users: state.users.users,
    loading: state.users.loading,
    error: state.users.error,
    funnelStates: state.funnelStates.funnelStates,
    funnelStatesLoading: state.funnelStates.loading,
    funnelStatesError: state.funnelStates.error,
    createLoading: state.users.createLoading,
    createSuccess: state.users.createSuccess,
    createError: state.users.createError,
    editLoading: state.users.editLoading,
    editSuccess: state.users.editSuccess,
    editError: state.users.editError,
    delLoading: state.users.delLoading,
    delSuccess: state.users.delSuccess,
    delError: state.users.delError,
  }),
  {
    fetch: usersActions.fetchRequest,
    fetchFunnelStates: funnelStatesActions.fetchRequest,
    clearCreate: usersActions.clearCreate,
    create: usersActions.createRequest,
    clearEdit: usersActions.clearEdit,
    edit: usersActions.editRequest,
    clearDel: usersActions.clearDel,
    del: usersActions.delRequest,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default compose(connector, injectIntl)(UsersPage);
