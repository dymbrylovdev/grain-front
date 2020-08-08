import { TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const TopTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#1e1e2d",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  body: {
    fontSize: 16,
    fontWeight: "bold",
  },
  [theme.breakpoints.down("xs")]: {
    head: {
      fontSize: 10,
      paddingRight: 0,
      // paddingLeft: theme.spacing(2),
    },
  },
}))(TableCell);

export default TopTableCell;
