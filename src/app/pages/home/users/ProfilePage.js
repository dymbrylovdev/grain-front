import React from 'react';
import { shallowEqual, useSelector, connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TextField } from '@material-ui/core';
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme
} from "@material-ui/core/styles";
import * as auth from '../../../store/ducks/auth.duck';


const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    background: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)'
  },
  form: {
    maxWidth: '800px',
    width: '100%',
    padding: theme.spacing(3),
  },
  textField: {
  },
  dense: {
    marginTop: 19
  },
}));

function ProfilePage({ intl }) {
  const user = useSelector(({ auth: { user } }) => user, shallowEqual);
  const classes = useStyles();
  return (
      <div className={classes.container}>
        <div className={classes.form}>
          <form noValidate={true} autoComplete="off" className="kt-form">
            <div className="kt-section">
              <div className="form-group">
                <TextField
                  type="email"
                  label={intl.formatMessage({
                    id: 'AUTH.INPUT.EMAIL',
                  })}
                  margin="normal"
                  className={classes.textField}
                  name="email"
                  value={user.email}
                  helperText={''}
                  variant="outlined"
                  error={false}
                />
                                <TextField
                  type="email"
                  label={intl.formatMessage({
                    id: 'AUTH.INPUT.EMAIL',
                  })}
                  margin="normal"
                  className={classes.textField}
                  name="email"
                  value={user.email}
                  helperText={''}
                  variant="outlined"
                  error={false}
                />
                                <TextField
                  type="email"
                  label={intl.formatMessage({
                    id: 'AUTH.INPUT.EMAIL',
                  })}
                  margin="normal"
                  className={classes.textField}
                  name="email"
                  value={user.email}
                  helperText={''}
                  variant="outlined"
                  error={false}
                />
                                <TextField
                  type="email"
                  label={intl.formatMessage({
                    id: 'AUTH.INPUT.EMAIL',
                  })}
                  margin="normal"
                  className={classes.textField}
                  name="email"
                  value={user.email}
                  helperText={''}
                  variant="outlined"
                  error={false}
                />
                                <TextField
                  type="email"
                  label={intl.formatMessage({
                    id: 'AUTH.INPUT.EMAIL',
                  })}
                  margin="normal"
                  className={classes.textField}
                  name="email"
                  value={user.email}
                  helperText={''}
                  variant="outlined"
                  error={false}
                />                <TextField
                type="email"
                label={intl.formatMessage({
                  id: 'AUTH.INPUT.EMAIL',
                })}
                margin="normal"
                className={classes.textField}
                name="email"
                value={user.email}
                helperText={''}
                variant="outlined"
                error={false}
              />                <TextField
              type="email"
              label={intl.formatMessage({
                id: 'AUTH.INPUT.EMAIL',
              })}
              margin="normal"
              className={classes.textField}
              name="email"
              value={user.email}
              helperText={''}
              variant="outlined"
              error={false}
            />                <TextField
            type="email"
            label={intl.formatMessage({
              id: 'AUTH.INPUT.EMAIL',
            })}
            margin="normal"
            className={classes.textField}
            name="email"
            value={user.email}
            helperText={''}
            variant="outlined"
            error={false}
          />                <TextField
          type="email"
          label={intl.formatMessage({
            id: 'AUTH.INPUT.EMAIL',
          })}
          margin="normal"
          className={classes.textField}
          name="email"
          value={user.email}
          helperText={''}
          variant="outlined"
          error={false}
        />                <TextField
        type="email"
        label={intl.formatMessage({
          id: 'AUTH.INPUT.EMAIL',
        })}
        margin="normal"
        className={classes.textField}
        name="email"
        value={user.email}
        helperText={''}
        variant="outlined"
        error={false}
      />
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}

export default injectIntl(connect(null, auth.actions)(ProfilePage));
