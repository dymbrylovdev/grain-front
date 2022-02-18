/* eslint-disable no-restricted-imports */
import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions, { DialogActionsProps } from "@material-ui/core/DialogActions";
import DialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import DialogContentText, { DialogContentTextProps } from "@material-ui/core/DialogContentText";
import DialogTitle, { DialogTitleProps } from "@material-ui/core/DialogTitle";
import { LinearProgress } from "@material-ui/core";

interface IActionProps extends ButtonProps {
  title: string;
}

interface IProps {
  open: boolean;
  onClose: () => {} | void;
  loading?: boolean;
  content?: any;
  children?: any;
  title?: string;
  actions?: IActionProps[];
  DialogProps?: DialogProps;
  DialogTitleProps?: DialogTitleProps;
  DialogContentProps?: DialogContentProps;
  DialogContentTextProps?: DialogContentTextProps;
  DialogActionsProps?: DialogActionsProps;
}

const Modal: React.FC<IProps> = ({
  open,
  onClose,
  title,
  loading,
  content,
  actions,
  DialogProps,
  DialogTitleProps,
  DialogContentProps,
  DialogContentTextProps,
  DialogActionsProps,
}) => {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" {...DialogProps}>
      {title && (
        <DialogTitle id="alert-dialog-title" {...DialogTitleProps}>
          {title}
        </DialogTitle>
      )}
      {content && (
        <DialogContent {...DialogContentProps}>
          <DialogContentText id="alert-dialog-description" {...DialogContentTextProps}>
            {content}
          </DialogContentText>
        </DialogContent>
      )}
      {loading && (
        <DialogContent {...DialogContentProps}>
          <LinearProgress />
        </DialogContent>
      )}
      {actions && (
        <DialogActions {...DialogActionsProps}>
          {actions.map(({ title: actionTitle, ...props }: IActionProps, idx: number) => (
            <Button {...props} key={idx} color="primary">
              {actionTitle}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
