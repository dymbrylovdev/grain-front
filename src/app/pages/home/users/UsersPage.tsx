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
import { useSnackbar } from "notistack";

import { actions as usersActions } from "../../../store/ducks/users.duck";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError } from "../../../components/ui/Errors";
import useStyles from "../styles";
import { IAppState } from "../../../store/rootDuck";
import { TablePaginator } from "../../../components/ui/Table/TablePaginator";

const UsersPage: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  intl,
  page,
  perPage,
  total,
  fetch,
  users,
  loading,
  error,
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

  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

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
    if (!users && !loading) {
      fetch({ page, perPage });
    }
  }, [fetch, loading, page, perPage, users]);

  if (error) return <LoadError handleClick={() => fetch({ page, perPage })} />;

  if (!users) return <Preloader />;

  return (
    <Paper className={classes.tableContainer}>
      <Button
        className={classes.topAndBottomMargin}
        variant="contained"
        color="primary"
        onClick={() => history.push("/user/create")}
      >
        {intl.formatMessage({ id: "USERLIST.BUTTON.ADD_USER" })}
      </Button>
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
              <FormattedMessage id="USERLIST.TABLE.STATUS" />
            </TopTableCell>
            <TopTableCell></TopTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map &&
            users.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.fio}</TableCell>
                <TableCell>{item.status}</TableCell>
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
    users: state.users.users,
    loading: state.users.loading,
    error: state.users.error,
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
