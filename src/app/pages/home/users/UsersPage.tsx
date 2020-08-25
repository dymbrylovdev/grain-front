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
  Grid,
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

import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";
import { Skeleton } from "@material-ui/lab";
import { ErrorPage } from "../../../components/ErrorPage";
import InfoDialog from "../../../components/ui/Dialogs/InfoDialog";
import { LayoutSubheader } from "../../../../_metronic";
import { accessByRoles } from "../../../utils/utils";
import { roles } from "./utils/profileForm";

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

  fetchMe,
  me,

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
  const [funnelStateEditId, setFunnelStateEditId] = useState(0);

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
      fetch({ page, perPage });
    }
  }, [clearEdit, editError, editSuccess, enqueueSnackbar, fetch, intl, page, perPage]);

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
      fetch({ page, perPage });
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
  ]);

  useEffect(() => {
    fetch({ page, perPage });
  }, [fetch, page, perPage]);

  useEffect(() => {
    fetchFunnelStates();
  }, [fetchFunnelStates]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (error || funnelStatesError) return <ErrorPage />;

  return (
    <Paper className={classes.paperWithTable}>
      <LayoutSubheader title={intl.formatMessage({ id: "SUBMENU.USER.LIST" })} />
      <div>
        <Button
          className={classes.topAndBottomMargin}
          variant="contained"
          color="primary"
          onClick={() => history.push("/user/create")}
          disabled={!users || !funnelStates}
        >
          {intl.formatMessage({ id: "USERLIST.BUTTON.ADD_USER" })}
        </Button>
      </div>
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
                    <TableCell>
                      <Grid container direction="column" justify="center" alignItems="flex-start">
                        <div>{`${item.fio || ""}`}</div>
                        {item.company && (
                          <div style={!!item.fio ? { marginTop: 10 } : {}}>{`${item.company
                            .short_name || ""}`}</div>
                        )}
                      </Grid>
                    </TableCell>
                    <TableCell>
                      {funnelStateEditId === item.id ? (
                        <TextField
                          autoFocus
                          select
                          margin="normal"
                          label={intl.formatMessage({
                            id: "USERLIST.TABLE.ACTIVITY",
                          })}
                          value={item.funnel_state?.id || 0}
                          onChange={e => {
                            setFunnelStateEditId(0);
                            edit({ id: item.id, data: { funnel_state_id: +e.target.value } });
                          }}
                          onBlur={() => {
                            setFunnelStateEditId(0);
                          }}
                          name="status"
                          variant="outlined"
                        >
                          <MenuItem value={0} style={{ backgroundColor: "#f2f2f2" }}>
                            {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.NO_NAME" })}
                          </MenuItem>
                          {funnelStates
                            .filter(fs => fs.role === item.roles[0])
                            .map(option => (
                              <MenuItem
                                key={option.id}
                                value={option.id}
                                style={{ backgroundColor: `${option.color || "#ededed"}` }}
                              >
                                {`${option.engagement || "0"} • ${option.name}`}
                              </MenuItem>
                            ))}
                        </TextField>
                      ) : accessByRoles(item, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) ? (
                        <div className={classes.flexRow}>
                          <div
                            className={classes.funnelStateName}
                            style={{ border: "1px solid rgba(10, 187, 135, 0.4)" }}
                          >
                            {roles.find(role => role.id === item.roles[0])?.value}
                          </div>
                          {/* <IconButton
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
                          </IconButton> */}
                        </div>
                      ) : !item.funnel_state ? (
                        <div className={classes.flexRow}>
                          <div
                            className={classes.funnelStateName}
                            style={{ backgroundColor: "#f2f2f2" }}
                            onClick={() => {
                              if (!item.is_funnel_state_automate) setFunnelStateEditId(item.id);
                            }}
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
                          <Tooltip
                            title={
                              item.is_funnel_state_automate
                                ? intl.formatMessage({ id: "FUNNEL_STATES.TOOLTIP.ON" })
                                : intl.formatMessage({ id: "FUNNEL_STATES.TOOLTIP.OFF" })
                            }
                          >
                            <SpellcheckIcon
                              color={item.is_funnel_state_automate ? "secondary" : "disabled"}
                              className={classes.leftMargin1}
                            />
                          </Tooltip>
                        </div>
                      ) : (
                        <div className={classes.flexRow}>
                          <div
                            className={classes.funnelStateName}
                            style={{ backgroundColor: `${item.funnel_state.color || "#ededed"}` }}
                            onClick={() => {
                              if (!item.is_funnel_state_automate) setFunnelStateEditId(item.id);
                            }}
                          >
                            {`${item.funnel_state.engagement || "0"} • ${item.funnel_state.name}`}
                          </div>
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={() => {
                              if (!funnelStates.find(fs => fs.id === item.funnel_state?.id)?.hint) {
                                setInfoText(
                                  intl.formatMessage({
                                    id: "FUNNEL_STATES.DIALOGS.INFO.EMPTY_TEXT",
                                  })
                                );
                              } else {
                                setInfoText(
                                  funnelStates.find(fs => fs.id === item.funnel_state?.id)
                                    ?.hint as string
                                );
                              }
                              setInfoOpen(true);
                            }}
                          >
                            <HelpOutlineIcon />
                          </IconButton>
                          <Tooltip
                            title={
                              item.is_funnel_state_automate
                                ? intl.formatMessage({ id: "FUNNEL_STATES.TOOLTIP.ON" })
                                : intl.formatMessage({ id: "FUNNEL_STATES.TOOLTIP.OFF" })
                            }
                          >
                            <SpellcheckIcon
                              color={item.is_funnel_state_automate ? "secondary" : "disabled"}
                              className={classes.leftMargin1}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {!(item.is_admin && !me?.is_admin) && (
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
                      )}

                      <Tooltip
                        title={intl.formatMessage({
                          id: "USERLIST.TOOLTIP.CREATE_BID",
                        })}
                      >
                        <IconButton
                          size="medium"
                          color="primary"
                          onClick={() =>
                            history.push(
                              `/bid/create/${item.is_buyer ? "purchase" : "sale"}/0/0/${item.id}`
                            )
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      {!(item.is_admin && !me?.is_admin) && (
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
                      )}
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
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
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
    me: state.auth.user,
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
    fetchMe: authActions.fetchRequest,
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
