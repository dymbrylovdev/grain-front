import { makeStyles, createStyles } from "@material-ui/core";

export const useBidTableStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    // flexWrap: "wrap",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 4,
    cursor: "pointer",
    // transition: ".1s ease-in",
    boxShadow: "none !important",
    width: "100%",
    "&:hover": {
      // transform: "scale(0.99)",
      border: "4px solid #21BA88",
      padding: 8,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      display: "block",
    },
  },
  imageBlock: {
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1000px)"]: {
      marginRight: 16,
    },
  },
  imageBlocks: {
    position: "absolute",
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 10,
  },
  imageFirstBlock: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#0F7F12FF",
    borderRadius: 4,
    marginBottom: 8,
  },
  imageTwoBlock: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "#21BA88FF",
    borderRadius: 4,
  },
  fontImageText: {
    fontSize: "0.9vw",
    color: "white",
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  wrapperImage: {
    height: 258,
    cursor: "pointer",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:900px)"]: {
      width: 280,
      height: 210,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1200px)"]: {
      width: 300,
      height: 230,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1536px)"]: {
      width: 318,
      height: 258,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      maxHeight: 172,
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
    marginTop: 235,
    zIndex: 1,
    width: 300,
    cursor: "pointer",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:900px)"]: {
      width: 280,
      marginTop: 180,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1200px)"]: {
      width: 300,
      marginTop: 200,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1536px)"]: {
      width: 318,
      marginTop: 230,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      marginTop: 160,
      width: "100%",
      marginLeft: -15,
    },
  },
  wrapperDot: {
    paddingRight: 3,
    paddingBottom: 8,
  },
  dot: {
    width: 50,
    height: 6,
    borderRadius: 10,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: 38,
    },
  },
  wrapperCarusel: {
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:900px)"]: {
      width: 280,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1200px)"]: {
      width: 300,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:1536px)"]: {
      width: 318,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "100%",
    },
  },
  wrapperFirstInfoBlock: {
    display: "flex",
    flexWrap: "wrap",
    width: "30vw",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (min-width:910px)"]: {
      marginRight: 30,
    },
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      width: "100%",
    },
  },
  wrapperInfoBlock: {
    display: "flex",
    flexWrap: "wrap",
    width: "24vw",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      display: "block",
      width: "100%",
    },
  },
  containerInfoBlock: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
    // marginBottom: 8,
  },
  price: {
    fontWeight: "bold",
    fontSize: "1.175vw",
    color: "black",
    marginRight: 14,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  rybl: {
    fontSize: "1.175vw",
    color: "#21BA88",
    marginRight: 14,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  nds: {
    fontSize: "1.175vw",
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  delivery: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "1.175vw",
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  deliveryAddress: {
    fontSize: "1.175vw",
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },

  btnChangeDelivery: {
    fontSize: "1.175vw",
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
    fontSize: "1.175vw",
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
    fontSize: "1.175vw",
    color: "black",
    marginRight: 16,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 18,
    },
  },
  btnCard: {
    minWidth: 120,
    backgroundColor: "#EDEEF4FF",
    fontSize: "0.975vw",
    textTransform: "initial",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  textCard: {
    color: "#54C7A3FF",
    fontSize: "0.975vw",
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  infoText: {
    fontSize: "0.975vw",
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  infoTwoText: {
    fontSize: "0.975vw",
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  btnShowPhone: {
    maxWidth: "9vw",
    marginBottom: 16,
    textTransform: "initial",
    color: "#6164FF",
    padding: 0,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      maxWidth: 200,
      paddingRight: 8,
    },
  },
  wrapperTextShowBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: 8,
    alignItems: "flex-start",
  },
  textPhone: {
    color: "black",
    fontSize: "0.975vw",
    fontWeight: 400,
    width: "100%",
    textAlign: "left",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  textCreateAt: {
    color: "black",
    fontSize: "0.975vw",
    fontWeight: 400,
    textAlign: "end",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  companyWrapper: { display: "flex", justifyContent: "space-between", flexDirection: "column", marginRight: 10 },
  nameVendor: {
    fontSize: "0.975vw",
    fontWeight: "bold",
    color: "black",
    textDecoration: "underline ",
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
      marginBottom: 8,
    },
  },
  datePublic: {
    fontSize: "0.975vw",
    fontWeight: "bold",
    color: "black",
    textAlign: "end",
    marginBottom: 8,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
      marginBottom: 8,
    },
  },
  nameCompany: {
    fontSize: "0.975vw",
    fontWeight: 400,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  companyInfo: { display: "flex", flexDirection: "column" },
  iconBtn: { padding: 8 },
  btnTextShowPhone: {
    fontSize: "0.975vw",
    color: "#6164FF",
    fontWeight: 400,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      fontSize: 14,
    },
  },
  wrapperInfoCompany: { display: "flex", flexDirection: "row" },
  btnDetailed: {
    width: "9vw",
    backgroundColor: "#6164FF",
    alignItems: "center",
    textTransform: "initial",
  },
  textBtnDetailed: {
    fontSize: "0.975vw",
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
  wrapperPriceVat: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 8,
  },
  priceVat: {
    display: "flex",
    flexDirection: "row",
  },
  disabled: {
    pointerEvents: 'none',
  },
  transpoterTable: {
    width: '1100px'
  },
  ["@media (max-width:1200px)"]: {
    transpoterTable: {
      width: '900px'
    },
  },

  iconsRow: {
    display: 'flex'
  },
  icon: {
    marginBottom: '4px',
    position: 'relative',
    width: '40px'
  }
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
  btnExcel: {
    marginLeft: 15,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      marginTop: 8,
      marginLeft: 0,
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
  btnVendor: {
    cursor: "pointer",
    width: 90,
    borderBottom: "0.5px solid black",
    "&:hover": {
      opacity: 0.7,
    },
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
  containerCols: {
    display: "flex",
    width: "100%",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      flexWrap: "wrap",
    },
  },
  leftCol: {
    marginRight: 40,
    width: "42%",
    maxWidth: 530,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      width: "100%",
      maxWidth: "100%",
      marginRight: 0,
    },
  },
  rightCol: {
    width: "55%",
    maxWidth: 740,
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      width: "100%",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginTop: 25,
    marginBottom: 30,
    maxWidth: 530,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      width: "100%",
      maxWidth: "100%",
    },
  },
  name: {
    fontSize: 22,

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
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
  },
  wrapperPrice: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  infoTwoText: {
    fontSize: 14,
    color: "black",
  },
  imgBtnDetailed: { marginLeft: 12, marginRight: 12 },
  nameCompany: {
    fontSize: 14,
    fontWeight: 400,
    color: "black",
  },
  price: {
    fontWeight: "bold",
    fontSize: 21,
    color: "black",
    marginRight: 14,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      fontSize: 18,
    },
  },
  rybl: {
    fontSize: 21,
    color: "#21BA88",
    marginRight: 14,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      fontSize: 18,
    },
  },
  delivery: {
    display: "inline-block",
    fontWeight: "bold",
    fontSize: 21,
    color: "black",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      fontSize: 18,
    },
  },
  deliveryAddress: {
    fontSize: 21,
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      fontSize: 18,
    },
  },
  btnChangeDelivery: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#6164FFFF",
    cursor: "pointer",
    textDecoration: "underline ",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      fontSize: 18,
    },
  },
  nds: {
    fontSize: 21,
    color: "black",
    fontWeight: "normal",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      fontSize: 18,
    },
  },
  nameParameter: {
    fontSize: 16,
    fontWeight: 700,
    color: "black",
    marginBottom: 8,
  },
  parameterValue: {
    fontSize: 14,
    fontWeight: 400,
    color: "black",
  },
  vendorCompany: {
    fontSize: 14,
    fontWeight: 400,
    color: "black",
    marginTop: 8,
  },
  modifedAt: {
    fontSize: 14,
    fontWeight: 600,
    color: "black",
    marginBottom: 8,
  },
  btnShowPhone: {
    maxWidth: 159,
    maxHeight: 56,
    marginBottom: 18,
    textTransform: "initial",
    color: "#6164FF",
    padding: 0,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      marginBottom: 16,
    },
  },
  wrapperTextShowBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    padding: "0 8px",
    alignItems: "flex-start",
  },
  textPhone: {
    color: "black",
    fontSize: 14,
    fontWeight: 400,
    width: "100%",
    textAlign: "left",
  },
  btnTextShowPhone: {
    fontSize: 14,
    color: "#6164FF",
    fontWeight: 400,
  },
  infoAlert: {
    whiteSpace: "pre-wrap",
    marginTop: 8,
    marginBottom: 26,
    fontSize: 14,
    color: "black",
    fontWeight: 400,
  },
  calcParam: {
    fontSize: 14,
    fontWeight: 400,
    color: "black",
    marginBottom: 8,
  },
  calcVal: {
    fontSize: 14,
    fontWeight: 400,
    color: " #6164FF",
    marginBottom: 26,
  },
  imageBlocks: {
    position: "absolute",
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 65,
    zIndex: 100,
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
    fontSize: 14,
    color: "white",
    fontWeight: 400,
  },
  wrapperValCalc: { display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" },
  wrapperMedia: { display: "flex", alignItems: "center", marginTop: -6 },
  yaMap: { width: "100%", marginTop: 5 },
  wrapperParameters: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    borderTop: "0.5px solid #9FA8DAFF",
    borderBottom: "0.5px solid #9FA8DAFF",
    paddingTop: 10,
    marginBottom: 10,
  },
  wrapperParameter: { display: "flex", flexDirection: "column", marginRight: 40, marginBottom: 16 },
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
    fontSize: 16,
    fontWeight: 700,
    color: "black",
  },
  textField: { height: 50, width: 255, margin: 0, marginBottom: 26 },
  wrapperVendor: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "98%",
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      marginBottom: 16,
    },
  },
  btnGoBack: { width: 40, height: 24, minWidth: 40, marginRight: 8, color: "black", border: "1px solid #000000", padding: 0 },
  wrapperPriceVat: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 8,
  },
  priceVat: {
    display: "flex",
    flexDirection: "row",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  disabled: {
    pointerEvents: 'none',
  },
}));

export const useStylesPhotosForm = makeStyles(theme =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1,
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: "blue",
    },
    gridList: {
      width: "min-content",
      height: "max-content",
      transform: "translateZ(0)",
    },
    imgContainer: {
      position: "relative",
      height: 300,
      margin: 3,
      [theme.breakpoints.down("xs")]: {
        height: 150,
      },
    },
    mainImgContainer: {
      height: 700,
      alignItems: "center",
      justifyContent: "center",
      // maxWidth: 1000,
      marginTop: 20,
      marginBottom: 20,
      [theme.breakpoints.down("md")]: {
        height: 600,
      },
      [theme.breakpoints.down("sm")]: {
        height: 400,
      },
      [theme.breakpoints.down("xs")]: {
        height: 200,
      },
    },
    img: {
      height: "100%",
      maxWidth: "100%",
      objectFit: "cover",
    },
    titleBar: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      // eslint-disable-next-line no-useless-concat
      background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " + "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
    icon: {
      color: "white",
    },
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      marginTop: 20,
      marginBottom: 20,
      alignItems: "center",
      justifyContent: "center",
      transition: "1000",
    },
    empty: {
      marginBottom: 20,
    },
    container: {
      flexDirection: "row",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },

    actions: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      display: "flex",
      justifyContent: "center",
    },
    buttons: {
      marginRight: theme.spacing(2),
    },

  })
);
