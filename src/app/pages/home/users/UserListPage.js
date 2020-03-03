import React, { useEffect, useState } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { shallowEqual, useSelector, connect } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import * as users from "../../../store/ducks/users.duck";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import Footer from "../../../components/ui/Table/TableFooter";
import TopTableCell from "../../../components/ui/Table/TopTableCell";
import Preloader from "../../../components/ui/Loaders/Preloader";
import { LoadError, ErrorDialog } from "../../../components/ui/Erros";

import useStyles from "./styles";

function UserListPage({ intl, getUsers, deleteUser, clearErrors }) {
  const { users, page, per_page, total, loading, errors } = useSelector(
    ({ users: { users, errors } }) => {
      if (!users)
        return {
          users: [],
          page: 1,
          per_page: 20,
          total: 0,
          loading: false,
          errors: {},
        };
      return {
        users: users.data,
        page: users.page,
        per_page: users.per_page,
        total: users.total,
        loading: users.loading,
        errors: errors || {},
      };
    },
    shallowEqual
  );

  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleDeleteDialiog = id => {
    setDeleteUserId(id);
    setAlertOpen(true);
  };

  const getUsersAction = page => getUsers({ page });

  const handleChangePage = (event, page) => {
    getUsersAction(page + 1);
  };

  useEffect(() => {
    getUsersAction(1);
  }, []);

  const deleteUserAction = () => {
    setAlertOpen(false);
    deleteUser(deleteUserId, { page });
  };
  const classes = useStyles();

  if (errors.getUser) return <LoadError handleClick={() => getUsersAction(page)} />;
  if (loading) return <Preloader />;
  return (
    <Paper className={classes.tableContainer}>
      <ErrorDialog
        text={intl.formatMessage({ id: "Ошибка удаления пользователя" })}
        isOpen={errors.delete}
        handleClose={() => clearErrors()}
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
        handleAgree={() => deleteUserAction()}
      />
      <div className={classes.buttonContainer}>
        <Link to="/user/create">
          <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
            <FormattedMessage id="USERLIST.BUTTON.ADD_USER" />
          </button>
        </Link>
      </div>
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
              <FormattedMessage id="USERLIST.TABLE.COMPANY" />
            </TopTableCell>
            <TopTableCell>
              <FormattedMessage id="USERLIST.TABLE.STATUS" />
            </TopTableCell>
            <TopTableCell>
              <FormattedMessage id="USERLIST.TABLE.ACTIONS" />
            </TopTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map &&
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fio}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  {" "}
                  {
                    <div className={classes.actionButtonsContainer}>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "USERLIST.TOOLTIP.EDIT",
                        })}
                      >
                        <Link to={`/user/edit/${user.id}`}>
                          <IconButton size="medium" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </Tooltip>

                      {(user.is_admin || user.is_vendor) && (
                        <Tooltip
                          title={intl.formatMessage({
                            id: "USERLIST.TOOLTIP.CREATE_BID",
                          })}
                        >
                          <Link to={`/bid/create/${user.id}`}>
                            <IconButton size="medium" color="primary">
                              <AddIcon />
                            </IconButton>
                          </Link>
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
                          onClick={() => handleDeleteDialiog(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  }
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <Footer
          page={page - 1}
          perPage={per_page || 0}
          total={total || 0}
          handleChangePage={handleChangePage}
          fromLabel={intl.formatMessage({ id: "TABLE.FROM.LABEL" })}
        />
      </Table>
    </Paper>
  );
}

export default injectIntl(connect(null, users.actions)(UserListPage));
