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
import { getUsers, deleteUser } from "../../../crud/users.crud";
import AlertDialog from "../../../components/ui/Dialogs/AlertDialog";
import Footer from "../../../components/ui/Table/TableFooter";

import useStyles from "./styles";

function UserListPage({ setUsers, deleteUserSuccess, intl }) {
  const { users, page, total, per_page } = useSelector(
    ({ users }) => ({
      users: users.users,
      page: users.page,
      total: users.total,
      per_page: users.per_page,
    }),
    shallowEqual
  );
  const [deleteUserId, setDeleteUserId] = useState(-1);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const handleDeleteDialiog = id => {
    setDeleteUserId(id);
    setAlertOpen(true);
  };
  const getUsersAction = page =>
    getUsers({ page })
      .then(({ data }) => {
        if (data && data) {
          setUsers(data);
        }
      })
      .catch(error => {
        alert(error);
      });
  const handleChangePage = (event, page) => {
    getUsersAction(page + 1);
  };
  useEffect(() => {
    getUsersAction(1);
  }, []);
  const deleteUserAction = () => {
    setAlertOpen(false);
    deleteUser(deleteUserId)
      .then(() => {
        deleteUserSuccess(deleteUserId);
      })
      .catch(error => {
        console.log("deleteUserError", error);
      });
  };
  const classes = useStyles();
  console.log('userList', users);
  
  return (
    <Paper className={classes.tableContainer}>
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
            <TableCell>
              <FormattedMessage id="USERLIST.TABLE.ID" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="USERLIST.TABLE.EMAIL" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="USERLIST.TABLE.NAME" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="USERLIST.TABLE.STATUS" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="USERLIST.TABLE.ACTIONS" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.fio}</TableCell>
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
                        <IconButton size="small">
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
                          <IconButton size="small">
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
                      <IconButton size="small" onClick={() => handleDeleteDialiog(user.id)}>
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
