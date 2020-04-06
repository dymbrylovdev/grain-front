import { withStyles, Button } from "@material-ui/core";

export const OutlinedRedButton = withStyles({
  root: {
    background: "none",
    borderColor: "rgba(253, 57, 122, 0.5)",
    color: "#fd397a",
    "&:hover": {
      color: "#fd397a",
      borderColor: "#fd397a",
      backgroundColor: "rgba(253, 57, 122, 0.03)",
    },
  },
})(Button);
