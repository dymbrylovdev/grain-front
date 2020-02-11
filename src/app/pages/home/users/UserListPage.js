import React, { useEffect } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { shallowEqual, useSelector, connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as users from '../../../store/ducks/users.duck';
import { getUsers } from '../../../crud/users.crud';
import useStyles from './styles';

function UserListPage({ setUsers, setStatuses }) {
  const { users, page } = useSelector(
    ({ users }) => ({ users: users.users, page: users.page }),
    shallowEqual
  );
  const getUsersAction = page =>
    getUsers({ page })
      .then(({ data }) => {
        if (data && data.data) {
          setUsers(data.data, page);
        }
      })
      .catch(error => {
        alert(error);
      });   
  useEffect(() => {
    getUsersAction(1);
  }, []);
  const classes = useStyles();

  return (
    <div>
      <div className={classes.buttonContainer}>
      <Link to="/user/create"> 
        <button className={'btn btn-primary btn-elevate kt-login__btn-primary'}>
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
                {' '}
                {
                  <div className={classes.actionButtonsContainer}>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </div>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default injectIntl(connect(null, users.actions)(UserListPage));
