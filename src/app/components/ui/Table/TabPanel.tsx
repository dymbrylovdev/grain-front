import React from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";

const useInnerStyles = makeStyles(theme => ({
  box: {
    height: "100%",
    padding: 0,
  },
  tabPanel: {
    marginTop: theme.spacing(2),
  },
}));

export function TabPanel(props: { [x: string]: any; children: any; value: any; index: any }) {
  const { children, value, index, ...other } = props;
  const innerClasses = useInnerStyles();

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={innerClasses.tabPanel}
      {...other}
    >
      {value === index && (
        <Box p={3} className={innerClasses.box}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

export function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
