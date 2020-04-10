import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    background: "white",
    alignItems: "center",
    //justifyContent: "center",
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
  },
  form: {
    maxWidth: "800px",
    width: "100%",
    padding: theme.spacing(3),
  },
  buttonContainer: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  tableContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowX: "auto",
  },
  textSelect: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  actionButtonsContainer: {
    flexDirection: "column",
  },
  table: {
    width: "100%",
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
    flexDirection: "row",
    minHeight: 80,
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
    fontSize: 14,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  tableTitle: {
    marginTop: theme.spacing(2),
  },
  emptyTitle: {
    fontSize: 12,
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
}));

export default useStyles;
