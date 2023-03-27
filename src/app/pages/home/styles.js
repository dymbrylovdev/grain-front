import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paperWithTable: {
    display: "flex",
    flex: "auto",
    flexDirection: "column",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    // overflowX: "hidden",
  },
  tableCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  tableHead: {
    position: 'sticky',
    zIndex: 10000,
    top: 104,
    ["@media (max-width:1000px)"]: {
      top: 50,
    },
  },
  paperWithForm: {
    display: "flex",
    flex: 1,
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
    position: 'relative'
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
    // minHeight: 70,
    alignItems: "center",
  },
  titleTextBold: {
    fontWeight: "bold",
    fontSize: "1.3vw",
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 22,
    },
  },
  boldText: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "1.175vw",
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  normalText: {
    fontSize: "1vw",
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
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
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
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
  menuFlexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
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
  topAndBottomMargin1: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
  rightMargin1: {
    marginRight: theme.spacing(1),
  },
  rightMargin2: {
    marginRight: theme.spacing(2),
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
      // marginLeft: -15,
      // marginRight: -15,
    },
    paperWithForm: {
      // marginLeft: -15,
      // marginRight: -15,
      paddingLeft: 0,
      paddingRight: 0,
    },
    table: {
      marginLeft: -theme.spacing(2),
      marginRight: -theme.spacing(2),
    },
    displayNone: {
      display: 'none'
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tableCellModifed: {
    color: "#666666",
    fontWeight: "bold",
  },
  hideIcon: {
    pointerEvents: "none",
    visibility: "hidden"
  },

  // blocks *********************************************************************************************************************

  tariffBlock : {
    display: 'flex',
    alignItems: 'center',
    marginTop: -15
  }
}));

export default useStyles;
