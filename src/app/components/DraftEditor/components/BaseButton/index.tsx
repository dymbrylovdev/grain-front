import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';

import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme: any) => ({
  button: {
    padding: 0,
    width: 32,
    height: 32,
    minWidth: 32,
    color: theme.palette.icon,
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
  activeButton: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

interface IButtonBaseProps {
  active: boolean;
  tooltip: string;
  ButtonProps?: ButtonProps;
}

const ButtonBase: React.FC<IButtonBaseProps> = ({ active, tooltip, children, ButtonProps }) => {
  const classes = useStyles();

  return (
    <Tooltip title={tooltip}>
      <Button
        {...ButtonProps}
        className={clsx(classes.button, {
          [classes.activeButton]: active,
        })}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default ButtonBase;
