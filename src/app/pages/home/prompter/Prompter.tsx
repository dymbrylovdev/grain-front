import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { IAppState } from "../../../store/rootDuck";
import { actions as prompterActions } from "../../../store/ducks/prompter.duck";

// const useStyles = makeStyles(theme =>
//   createStyles({
//     card: {
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       marginBottom: theme.spacing(2),
//     },
//     container: {
//       maxWidth: "800px",
//       width: "100%",
//       padding: theme.spacing(2),
//     },
//     backButton: {
//       marginRight: theme.spacing(2),
//     },
//     instructions: {
//       textAlign: "justify",
//       marginTop: theme.spacing(1),
//       marginBottom: theme.spacing(2),
//     },
//   })
// );

const Prompter: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  dullRole,
  running,
  activeStep,
  stopPrompter,
  setActiveStep,
  intl,
}) => {
  // const classes = useStyles();
  // const history = useHistory();

  if (!running) return null;

  return (
    // <Card className={classes.card}>
    //   <CardContent className={classes.container}>
    //     <Stepper activeStep={activeStep} alternativeLabel>
    //       <Step>
    //         <StepLabel>
    //           <FormattedMessage id="PROMPTER.STEPPER.STEP0" />
    //         </StepLabel>
    //       </Step>
    //       <Step>
    //         <StepLabel>
    //           <FormattedMessage id="PROMPTER.STEPPER.STEP1" />
    //         </StepLabel>
    //       </Step>
    //       <Step>
    //         <StepLabel>
    //           <FormattedMessage id="PROMPTER.STEPPER.STEP2" />
    //         </StepLabel>
    //       </Step>
    //       <Step>
    //         <StepLabel>
    //           <FormattedMessage id="PROMPTER.STEPPER.STEP3" />
    //         </StepLabel>
    //       </Step>
    //     </Stepper>
    //     <div>
    //       <div>
    //         <Typography className={classes.instructions}>
    //           {activeStep === 0 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT0" />}
    //           {activeStep === 1 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT1" />}
    //           {activeStep === 2 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT2" />}
    //           {activeStep === 3 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT3" />}
    //           {activeStep === 4 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT4" />}
    //         </Typography>
    //         <Grid container direction="row" justify="space-between" alignItems="center">
    //           <div>
    //             {activeStep !== 0 && (
    //               <Button
    //                 variant="outlined"
    //                 color="primary"
    //                 onClick={() => {
    //                   setActiveStep(activeStep - 1);
    //                   if (activeStep === 2) history.push("/user/profile");
    //                   if (activeStep === 4) {
    //                     if (dullRole === "seller") history.push("/purchase/best-bids/1");
    //                     if (dullRole === "buyer") history.push("/sale/best-bids/1");
    //                   }
    //                 }}
    //                 className={classes.backButton}
    //               >
    //                 <FormattedMessage id="ALL.BUTTONS.PREV" />
    //               </Button>
    //             )}
    //             {activeStep !== 4 && (
    //               <Button
    //                 variant="contained"
    //                 color="primary"
    //                 onClick={() => {
    //                   setActiveStep(activeStep + 1);
    //                   if (activeStep === 1) {
    //                     if (dullRole === "seller") history.push("/purchase/best-bids/1");
    //                     if (dullRole === "buyer") history.push("/sale/best-bids/1");
    //                   }
    //                   if (activeStep === 3) {
    //                     if (dullRole === "seller") history.push("/bid/create/sale/0/0");
    //                     if (dullRole === "buyer") history.push("/bid/create/purchase/0/0");
    //                   }
    //                 }}
    //               >
    //                 <FormattedMessage id="ALL.BUTTONS.NEXT" />
    //               </Button>
    //             )}
    //           </div>
    //           {activeStep === 4 && (
    //             <Button variant="outlined" color="primary" onClick={() => stopPrompter()}>
    //               <FormattedMessage id="ALL.BUTTONS.FINISH" />
    //             </Button>
    //           )}
    //         </Grid>
    //       </div>
    //     </div>
    //   </CardContent>
    // </Card>
    null
  );
};

const connector = connect(
  (state: IAppState) => ({
    dullRole: state.prompter.dullRole,
    running: state.prompter.running,
    activeStep: state.prompter.activeStep,
  }),
  {
    stopPrompter: prompterActions.stopPrompter,
    setActiveStep: prompterActions.setActiveStep,
  }
);

type TPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(injectIntl(Prompter));
