import React, {useEffect, useState} from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, IconButton, Paper } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { FormattedMessage, injectIntl } from "react-intl";
import { getCrops } from "../../../crud/crops.crud";
import { Link } from "react-router-dom";
import { connect, useSelector, shallowEqual } from "react-redux";
import * as crops from "../../../store/ducks/crops.duck";
import * as builder from "../../../../_metronic/ducks/builder";
import getMenuConfig  from "../../../router/MenuConfig";
import useStyles from "../styles";


function CropsListPage({setMenuConfig, setCrops}){
    const { crops, user } = useSelector(({ crops, auth }) => ({ crops: crops.crops, user: auth.user }), shallowEqual);
    const [menuConfig] = useState(getMenuConfig(crops, user.is_admin));
    const classes = useStyles();
    const getCropsAction = () => {
      getCrops()
        .then(({ data }) => {
          if (data && data.data) {
            setCrops(data.data, user.is_admin);
          }
        })
        .catch(error => {
        });
    };
    useEffect(() => {
      setMenuConfig(menuConfig);
      getCropsAction();
    }, []);
    return (    <Paper className={classes.tableContainer}>
        <div className={classes.buttonContainer}>
          <Link to="/crop/create" >
            <button className={"btn btn-primary btn-elevate kt-login__btn-primary"}>
              <FormattedMessage id="CROPSLIST.BUTTON.CREATE" />
            </button>
          </Link>
        </div>
        <Table aria-label="simple table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="CROPSLIST.TABLE.ID" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="CROPSLIST.TABLE.ID" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="CROPSLIST.TABLE.ACTIONS" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>   
            {crops.map(crop => (
              <TableRow key={crop.id}>
                <TableCell>{crop.id}</TableCell>
                <TableCell>{crop.name}</TableCell>
                <TableCell>
                <Link to={`/crop/edit/${crop.id}`}>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Link>
                </TableCell>    
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>)
} 

export default injectIntl(connect(null, { ...builder.actions, ...crops.actions })(CropsListPage))