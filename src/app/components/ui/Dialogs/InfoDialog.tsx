import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useInnerStyles = makeStyles(theme => ({
  title: {
    "& h2": {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
}));

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  text: string;
}

const InfoDialog: React.FC<IProps> = ({ isOpen, handleClose, text, title }) => {
  const innerClasses = useInnerStyles();
  return (
    <Dialog maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle className={innerClasses.title}>
        {title}
        <IconButton onClick={handleClose}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{ textAlign: "justify" }}
          dangerouslySetInnerHTML={{ __html: text }}
        ></DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
