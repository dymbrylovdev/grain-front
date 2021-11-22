import { makeStyles } from "@material-ui/core";

export const useBidTableStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 8,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 4,
    // transition: ".1s ease-in",
    boxShadow: "none !important",
    width: "100%",
    "&:hover": {
      // transform: "scale(0.99)",
      border: "4px solid #21BA88",
      padding: 12,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1220px)"]: {
      flexDirection: "column",
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      display: "block",
    },
  },
  imageBlock: {
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1010px)"]: {
      marginRight: 32,
    },
  },
  imageBlocks: {
    position: "absolute",
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 20,
  },
  imageFirstBlock: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#21BA88FF",
    borderRadius: 4,
    marginBottom: 8,
  },
  imageTwoBlock: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#0F7F12FF",
    borderRadius: 4,
  },
  fontImageText: {
    fontSize: 16,
    color: "white",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  wrapperImage: {
    width: 318,
    height: 268,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      maxHeight: 102,
      width: "100%",
    },
  },
  image: {
    objectFit: "cover",
    borderRadius: 4,
    width: "100%",
    height: "100%",
  },
  containerDot: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "absolute",
    marginTop: 245,
    zIndex: 1,
    width: 318,
    cursor: "pointer",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      marginTop: 90,
      width: "100%",
      marginLeft: -15,
    },
  },
  wrapperDot: {
    paddingRight: 3,
    paddingBottom: 8,
  },
  dot: {
    width: 58,
    height: 6,
    borderRadius: 10,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: 38,
    },
  },
  wrapperCarusel: {
    width: 318,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "100%",
    },
  },
  wrapperFirstInfoBlock: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:910px)"]: {
      marginRight: 50,
    },
  },
  wrapperInfoBlock: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      display: "block",
    },
  },
  containerInfoBlock: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 500,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1800px)"]: {
      maxWidth: 750,
    },
  },
  wrapperPrice: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  wrapperNonRow: {
    marginBottom: 8,
  },
  price: {
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    marginRight: 14,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  rybl: {
    fontSize: 24,
    color: "#21BA88",
    marginRight: 21,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  nds: {
    fontSize: 24,
    color: "black",
    marginRight: 21,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  delivery: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    marginRight: 5,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  deliveryAddress: {
    fontSize: 24,
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },

  btnChangeDelivery: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6164FFFF",
    cursor: "pointer",
    textDecoration: "underline ",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  drop: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  wrapperDrop: { display: "flex", flexDirection: "row" },
  textDrop: {
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    marginRight: 16,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  btnCard: {
    backgroundColor: "#EDEEF4FF",
    fontSize: 16,
    textTransform: "initial",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  textCard: {
    color: "#54C7A3FF",
    fontSize: 16,
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  infoTwoText: {
    fontSize: 16,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  btnShowPhone: {
    width: 180,
    marginBottom: 18,
    textTransform: "initial",
    color: "#6164FF",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      marginBottom: 16,
    },
  },
  wrapperTextShowBtn: { display: "flex", flexDirection: "column", justifyContent: "flex-start" },
  textPhone: {
    color: "black",
    fontSize: 16,
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  textCreateAt: {
    color: "black",
    fontSize: 16,
    fontWeight: 400,
    textAlign: "end",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  companyWrapper: { display: "flex", justifyContent: "space-between", flexDirection: "column", marginRight: 10 },
  nameVendor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textDecoration: "underline ",
    marginBottom: 16,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
      marginBottom: 8,
    },
  },
  datePublic: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 16,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
      marginBottom: 8,
    },
  },
  nameCompany: {
    fontSize: 16,
    fontWeight: 400,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  companyInfo: { display: "flex", flexDirection: "column" },
  btnTextShowPhone: {
    fontSize: 16,
    color: "#6164FF",
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  wrapperInfoCompany: { display: "flex", flexDirection: "row" },
  btnDetailed: {
    width: 140,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#6164FF",
    alignItems: "center",
    textTransform: "initial",
  },
  textBtnDetailed: {
    fontSize: 16,
    color: "white",
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  imgBtnDetailed: { width: 6, height: 11, marginLeft: 12 },
  backdrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(0,0,30,0.4)",
  },
}));

export const useBidsPageStyles = makeStyles(theme => ({
  topContainer: {
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderRadius: 4,
  },
  leftButtonBlock: {
    flex: 1,
  },
  wrapperAddBid: { marginBottom: 16 },
  filterText: {
    width: 300,
    textAlign: "right",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  topSpaceContainer: {
    marginBottom: theme.spacing(2),
  },
  calendarBlock: {
    maxWidth: 250,
    marginLeft: theme.spacing(2),
  },
  text: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  iconButton: {
    animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
  },
  datesFilterBlock: {
    flexDirection: "row",
    display: "flex",
    alignSelf: "flex-end",
  },
  totalText: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  btnAddBid: {
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "100%",
    },
  },
  cropNameText: {
    fontSize: 36,
    color: "black",
    marginRight: 16,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 16,
    },
  },
  wrapperBtnFilters: { marginBottom: 12 },
  btnFilter: { border: "1px solid #EDEEF4", paddingTop: 4, paddingBottom: 4, paddingRight: 8, paddingLeft: 8, margin: 4 },
  imgBtnFilter: { height: 16, width: 16, marginRight: 4 },
  btnFilterText: {
    textTransform: "initial",
    color: "black",
    fontSize: 16,
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
}));

export const useViewBidStyles = makeStyles(theme => ({
  editor: {
    boxShadow: "initial !important",
    padding: "0 !important",
  },
  container: {
    padding: 0,
    margin: 0,
  },
  card: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 26,
    paddingBottom: 26,
    margin: 0,
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  leftCol: {
    maxWidth: 590,
    width: "100%",
  },
  rightCol: {
    maxWidth: 750,
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginTop: 25,
    marginBottom: 30,
    maxWidth: 530,
  },
  name: {
    fontSize: 25,

    fontWeight: "bold",
    margin: 0,

    [theme.breakpoints.up("md")]: {
      fontSize: 20,
    },
  },
  whatsAppButton: {
    width: "100%",
    height: 42,
    padding: "12px 0",
    borderRadius: 4,
    backgroundColor: "#25d366",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "bold",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
    textAlign: "center",
    color: "#fff",

    "&:hover": {
      color: "#fff",
    },

    [theme.breakpoints.up("md")]: {
      width: 215,
      marginTop: 0,
    },
  },
  listItem: {
    marginBottom: 15,
  },
  listValue: {
    fontSize: 19,
    fontWeight: 600,
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
    color: "#3f4254",
    marginBottom: 5,
  },
  listKey: {
    marginBottom: 0,
  },
  companyCard: {
    padding: "25px 30px",
    borderRadius: "4px",
    backgroundColor: "#f5f8fa",
    marginTop: 30,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  wrapperPrice: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  infoTwoText: {
    fontSize: 16,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  imgBtnDetailed: { marginLeft: 12, marginRight: 12 },
  nameCompany: {
    fontSize: 14,
    fontWeight: 400,
    color: "black",
  },
  price: {
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    marginRight: 14,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  rybl: {
    fontSize: 24,
    color: "#21BA88",
    marginRight: 21,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  delivery: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: 24,
    color: "black",
    marginRight: 5,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  deliveryAddress: {
    fontSize: 24,
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  btnChangeDelivery: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6164FFFF",
    cursor: "pointer",
    textDecoration: "underline ",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  nds: {
    fontSize: 24,
    color: "black",
    marginRight: 21,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  nameParameter: {
    fontSize: 18,
    fontWeight: 700,
    color: "black",
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 16,
    },
  },
  parameterValue: {
    fontSize: 16,
    fontWeight: 400,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  vendorCompany: {
    fontSize: 16,
    fontWeight: 400,
    color: "black",
    marginTop: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  modifedAt: {
    fontSize: 16,
    fontWeight: 600,
    color: "black",
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  btnShowPhone: {
    height: 56,
    width: 180,
    marginBottom: 18,
    textTransform: "initial",
    color: "#6164FF",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      marginBottom: 16,
    },
  },
  wrapperTextShowBtn: { display: "flex", flexDirection: "column", justifyContent: "flex-start" },
  textPhone: {
    color: "black",
    fontSize: 16,
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  btnTextShowPhone: {
    fontSize: 16,
    color: "#6164FF",
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  infoAlert: {
    whiteSpace: "pre-wrap",
    marginTop: 8,
    marginBottom: 26,
    fontSize: 16,
    color: "black",
    fontWeight: 400,

    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  calcParam: {
    fontSize: 16,
    fontWeight: 400,
    color: "black",
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  calcVal: {
    fontSize: 16,
    fontWeight: 400,
    color: " #6164FF",
    marginBottom: 26,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  imageBlocks: {
    position: "absolute",
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 60,
    zIndex: 1,
  },
  imageFirstBlock: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#21BA88FF",
    borderRadius: 4,
    marginBottom: 8,
  },
  imageTwoBlock: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#0F7F12FF",
    borderRadius: 4,
  },
  fontImageText: {
    fontSize: 16,
    color: "white",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  wrapperValCalc: { display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" },
  wrapperMedia: { display: "flex", alignItems: "center", marginTop: -6 },
  yaMap: { width: "100%", marginTop: 5 },
  wrapperParameters: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
  wrapperParameter: { display: "flex", flexDirection: "column", marginRight: 50, marginBottom: 26 },
  wrapperCalc: {
    paddingTop: 16,
    paddingBottom: 30,
    paddingRight: 16,
    paddingLeft: 16,
    border: "1px solid #EDEEF4",
    borderRadius: 4,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.06)",
  },
  titleCalc: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 700,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 16,
    },
  },
  textField: { height: 50, width: 255, margin: 0, marginBottom: 26 },
  wrapperVendor: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 26,

    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      marginBottom: 16,
    },
  },
  btnGoBack: { width: 40, height: 24, minWidth: 40, marginRight: 8, color: "black", border: "1px solid #000000", padding: 0 },
}));
