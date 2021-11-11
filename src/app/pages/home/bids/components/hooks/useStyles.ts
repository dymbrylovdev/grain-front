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
  image: {
    maxHeight: 268,
    maxWidth: 318,
    objectFit: "contain",
    borderRadius: 4,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:1000px)"]: {
      maxHeight: 102,
      maxWidth: "100%",
      objectFit: "cover",
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
}));
