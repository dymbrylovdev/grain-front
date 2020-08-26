import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paperWithTable: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowX: "hidden",
  },
  paperWithForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowX: "hidden",
  },
  form: {
    maxWidth: "800px",
    width: "100%",
    padding: theme.spacing(2),
  },
  form2: {
    maxWidth: "800px",
    width: "100%",
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  textSelect: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  actionButtonsContainer: {
    flexDirection: "column",
  },
  table: {
    flex: 1,
    overflowX: "auto",
  },
  tableFooterText: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  buttonAddContainer: {
    flex: 1,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  paramContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  textFieldContainer: {
    display: "flex",
    minHeight: 70,
    alignItems: "center",
  },
  textField: {
    flex: "1 1 auto",
  },
  leftIcon: {
    padding: theme.spacing(1),
  },
  titleText: {
    fontSize: 16,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  text: {
    display: "flex",
    minHeight: 40,
    fontSize: 16,
    alignItems: "center",
    //paddingTop: theme.spacing(1),
    //paddingBottom: theme.spacing(1),
  },
  appBar: {
    boxShadow: "none",
    backgroundColor: "white",
    paddingTop: theme.spacing(1),
  },
  tableTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyTitle: {
    fontSize: 16,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginLeft: theme.spacing(4),
  },
  switcher: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  dividerContainer: {
    height: 1,
  },

  // containers *****************************************************************************************************************

  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  box: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: "1px solid rgba(0, 0, 0, 0.26)",
    borderRadius: "4px",
  },

  // buttons ********************************************************************************************************************

  topButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: -theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  bottomButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft: -theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },

  // margins ********************************************************************************************************************

  topMargin: {
    marginTop: theme.spacing(2),
  },
  topAndBottomMargin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  bottomMargin1: {
    marginBottom: theme.spacing(1),
  },
  bottomMargin2: {
    marginBottom: theme.spacing(2),
  },
  leftMargin1: {
    marginLeft: theme.spacing(1),
  },
  leftMargin2: {
    marginLeft: theme.spacing(2),
  },

  // funnel state ***************************************************************************************************************

  funnelStateName: {
    margin: 0,
    borderRadius: "4px",
    width: "max-content",
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  // alerts *********************************************************************************************************************

  infoAlert: {
    marginBottom: theme.spacing(2),
    whiteSpace: "pre-wrap",
  },

  // mobile *********************************************************************************************************************

  [theme.breakpoints.down("xs")]: {
    paperWithTable: {
      marginLeft: -15,
      marginRight: -15,
    },
    paperWithForm: {
      marginLeft: -15,
      marginRight: -15,
      paddingLeft: 0,
      paddingRight: 0,
    },
    table: {
      marginLeft: -theme.spacing(2),
      marginRight: -theme.spacing(2),
    },
  },
}));

export default useStyles;
