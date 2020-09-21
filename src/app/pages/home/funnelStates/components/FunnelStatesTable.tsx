import React from "react";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";

import TopTableCell from "../../../../components/ui/Table/TopTableCell";
import useStyles from "../../styles";
import { IFunnelState } from "../../../../interfaces/funnelStates";
import { Skeleton } from "@material-ui/lab";

const useInnerStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "500px",
    height: "42px",
    overflow: "hidden",
  },
  wrapper: {
    width: "2000px",
    height: "100%",
  },
  helper: {
    height: "100%",
  },
  text: {
    float: "left",
    width: "500px",
    "& p": {
      margin: 0,
      lineHeight: "14px",
    },
  },
  fader: {
    float: "left",
    width: "500px",
    height: "14px",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 85%)",
    margin: "-14px 0px 0px -500px",
    position: "static",
  },
}));

interface IProps {
  intl: any;
  funnelStates: IFunnelState[] | undefined;
  setDeleteUserId: React.Dispatch<React.SetStateAction<number>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FunnelStatesTable: React.FC<IProps> = ({
  intl,
  funnelStates,
  setDeleteUserId,
  setAlertOpen,
}) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();
  const history = useHistory();

  return (
    <>
      <Button
        className={classes.topAndBottomMargin}
        variant="contained"
        color="primary"
        onClick={() =>
          history.push(
            `/funnel-states/new-${
              funnelStates && funnelStates[0].role === "ROLE_BUYER" ? "buyer" : "seller"
            }`
          )
        }
        disabled={!funnelStates}
      >
        {intl.formatMessage({ id: "FUNNEL_STATES.BUTTON.ADD" })}
      </Button>
      {!funnelStates ? (
        <>
          <Skeleton width="100%" height={52} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
          <Skeleton width="100%" height={77} animation="wave" />
        </>
      ) : (
        <div className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TopTableCell>
                  {intl.formatMessage({ id: "FUNNEL_STATES.TABLE.NAME" })}
                </TopTableCell>
                <TopTableCell>
                  {intl.formatMessage({ id: "FUNNEL_STATES.TABLE.ENGAGEMENT" })}
                </TopTableCell>
                <TopTableCell>
                  {intl.formatMessage({ id: "FUNNEL_STATES.TABLE.AUTO" })}
                </TopTableCell>
                <TopTableCell>
                  {intl.formatMessage({ id: "FUNNEL_STATES.TABLE.HINT" })}
                </TopTableCell>
                <TopTableCell></TopTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {funnelStates.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p
                      className={classes.funnelStateName}
                      style={{ backgroundColor: `${item.color || "#ededed"}` }}
                    >
                      {item.name}
                    </p>
                  </TableCell>
                  <TableCell>{item.engagement}</TableCell>
                  <TableCell>
                    <SpellcheckIcon
                      color={item.auto ? "secondary" : "disabled"}
                      className={classes.leftMargin1}
                    />
                  </TableCell>
                  <TableCell>
                    <div className={innerClasses.container}>
                      <div className={innerClasses.wrapper}>
                        <div
                          className={innerClasses.text}
                          dangerouslySetInnerHTML={{ __html: item.hint }}
                        ></div>
                        <div className={innerClasses.helper}></div>
                        <div className={innerClasses.fader}></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right" style={{ width: 150 }}>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => history.push(`/funnel-states/edit/${item.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    {!item.auto && (
                      <IconButton
                        size="medium"
                        color="secondary"
                        onClick={() => {
                          setDeleteUserId(item.id);
                          setAlertOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default FunnelStatesTable;
