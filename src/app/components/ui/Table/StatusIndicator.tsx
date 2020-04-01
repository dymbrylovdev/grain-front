import React from 'react';
import { makeStyles, createStyles, Box } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    box: {
      height: 10,
      width: 10,
      borderRadius: '50%',
    },
  })
);

interface IProps {
  isActive: boolean;
}

const StatusIndicator: React.FC<IProps> = ({ isActive }) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.box}
      boxShadow={isActive ? 3 : 0}
      bgcolor={isActive ? '#0abb87' : 'lightgrey'}
    ></Box>
  );
};

export default StatusIndicator;
