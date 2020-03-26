import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  createStyles,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl";
import { compose } from "redux";
import { IAppState } from "../../../store/rootDuck";

import { actions as prompterActions } from "../../../store/ducks/prompter.duck";

const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing(3),
    },
    container: {
      maxWidth: "800px",
      width: "100%",
      padding: theme.spacing(3),
    },
    backButton: {
      marginRight: theme.spacing(2),
    },
    instructions: {
      textAlign: "justify",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3),
    },
  })
);

const Prompter: React.FC<TPropsFromRedux & WrappedComponentProps> = ({
  dullRole,
  running,
  activeStep,
  stopPrompter,
  setActiveStep,
  intl,
}) => {
  const classes = useStyles();
  const history = useHistory();

  if (!running) return null;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.container}>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>
              <FormattedMessage id="PROMPTER.STEPPER.STEP0" />
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <FormattedMessage id="PROMPTER.STEPPER.STEP1" />
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <FormattedMessage id="PROMPTER.STEPPER.STEP2" />
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              <FormattedMessage id="PROMPTER.STEPPER.STEP3" />
            </StepLabel>
          </Step>
          {dullRole === "seller" && (
            <Step>
              <StepLabel>
                <FormattedMessage id="PROMPTER.STEPPER.STEP4" />
              </StepLabel>
            </Step>
          )}
        </Stepper>
        <div>
          <div>
            <Typography className={classes.instructions}>
              {activeStep === 0 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT0" />}
              {activeStep === 1 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT1" />}
              {activeStep === 2 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT2" />}
              {activeStep === 3 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT3" />}
              {dullRole === "seller"
                ? activeStep === 4 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT4" />
                : activeStep === 4 && <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT5" />}
              {dullRole === "seller" && activeStep === 5 && (
                <FormattedMessage id="PROMPTER.STEPPER.STEP_CONTENT5" />
              )}
            </Typography>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <div>
                {/*activeStep !== 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setActiveStep(activeStep - 1);
                      if (activeStep === 2) history.push("/user/profile");
                      if (activeStep === 5) history.push("/bidsList/1");
                    }}
                    className={classes.backButton}
                  >
                    <FormattedMessage id="ALL.BUTTONS.PREV" />
                  </Button>
                  )*/}
                {((dullRole === "seller" && activeStep !== 5) ||
                  (dullRole === "buyer" && activeStep !== 4)) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setActiveStep(activeStep + 1);
                      if (activeStep === 1) history.push("/bidsList/1");
                      if (activeStep === 4) history.push("/bid/create");
                    }}
                  >
                    <FormattedMessage id="ALL.BUTTONS.NEXT" />
                  </Button>
                )}
              </div>
              <Button variant="outlined" color="primary" onClick={() => stopPrompter()}>
                <FormattedMessage id="ALL.BUTTONS.FINISH" />
              </Button>
            </Grid>
          </div>
        </div>
      </CardContent>
    </Card>
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

export default compose(connector, injectIntl)(Prompter);
