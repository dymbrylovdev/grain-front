import React from "react";
import { Dialog, DialogContent, DialogProps, IconButton, makeStyles } from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowNext from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles(theme => ({
  img: {
    // maxWidth: 1000,
    // // maxHeight: 800,
    // [theme.breakpoints.down("xs")]: {
    //   maxWidth: 250,
    // },
    // [theme.breakpoints.only("sm")]: {
    //   maxWidth: 500,
    // },
    width: "100%",
    objectFit: "contain",
  },
  backdrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(0,0,30,0.4)",
  },
  arrows: {
    position: "absolute",
    width: "98%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    overflow: "hidden",
  },
}));

interface IProps extends DialogProps {
  handleClose: any;
  url: string;
  handleArrow?: any;
  noneArrows?: boolean;
}

const ImageDialog: React.FC<IProps> = ({ open, handleClose, url, handleArrow, noneArrows }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      BackdropProps={{
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <DialogContent style={{ padding: 0, overflow: "hidden" }}>
        {!noneArrows && handleArrow && (
          <div className={classes.arrows}>
            <IconButton
              onClick={() => handleArrow("prev")}
              style={{ top: "50%", transform: "translateY(-50%)", zIndex: 2, color: "#fff", left: 15, height: 50, width: 50 }}
            >
              <ArrowBack style={{ fontSize: 40 }} />
            </IconButton>
            <IconButton
              onClick={() => handleArrow("next")}
              style={{ top: "50%", transform: "translateY(-50%)", zIndex: 2, color: "#fff", left: 0, height: 50, width: 50 }}
            >
              <ArrowNext style={{ fontSize: 40 }} />
            </IconButton>
          </div>
        )}
        <img className={classes.img} src={url} alt="imageDialog" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
