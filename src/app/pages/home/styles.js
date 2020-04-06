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
  textField: {
    flexGrow: 1,
  },
  leftIcon: {
    padding: theme.spacing(1),
  },
  textFieldContainer: {
    flexDirection: "row",
    display: "flex",
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
  topMargin: {
    marginTop: theme.spacing(2),
  },
  marginTopAndBottom: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default useStyles;
