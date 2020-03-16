import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText} from "@material-ui/core";
import { injectIntl } from "react-intl";


const agreementStyle = {
    color: "black",
  };


function TermDialog({isOpen, handleClose, response, intl}){
    return(
        <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {intl.formatMessage({id:"AUTH.GENERAL.LEGAL"})}
        </DialogTitle>
        <DialogContent>
            {response && response.data ? (
              <div
                dangerouslySetInnerHTML={{ __html: response.data.text }}
                style={agreementStyle}
              />
            ) : (
                <>
              {intl.formatMessage({id: "AUTH.TERM.LOADING"})}
              </>
            )}
        </DialogContent>
      </Dialog>
    )

}

export default injectIntl(TermDialog);