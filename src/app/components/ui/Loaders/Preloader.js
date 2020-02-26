import React from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%',
  
    }
}))
function Preloader(){
    const classes = useStyles();
    return (<div className={classes.container}>
        <CircularProgress/>
    </div>)
}

export default Preloader;