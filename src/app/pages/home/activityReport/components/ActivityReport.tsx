import React from "react";
import { Table, TableBody, TableCell, TableRow, makeStyles, Theme } from "@material-ui/core";

import useStyles from "../../styles";
import { IFunnelStatesReport } from "../../../../interfaces/funnelStates";
import { Skeleton } from "@material-ui/lab";

const useInnerStyles = makeStyles((theme: Theme) => ({
  textContainer: {
    display: "flex",
    flexDirection: "column",
    height: "40px",
    marginRight: theme.spacing(1),
  },
  text: {
    margin: 0,
    lineHeight: "20px",
    textAlign: "right",
  },
  container: {
    display: "flex",
    height: "40px",
    alignItems: "center",
    marginLeft: theme.spacing(1),
  },
}));

interface IProps {
  intl: any;
  reports: IFunnelStatesReport[] | undefined;
}

const ActivityReport: React.FC<IProps> = ({ intl, reports }) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();

  return (
    <>
      <div className={classes.topAndBottomMargin} style={{ textAlign: "center" }}>
        {intl.formatMessage({ id: "FUNNEL_STATES.REPORT.HEADER" })}
      </div>
      {!reports ? (
        <>
          <Skeleton width="100%" height={72} animation="wave" />
          <Skeleton width="100%" height={72} animation="wave" />
          <Skeleton width="100%" height={72} animation="wave" />
          <Skeleton width="100%" height={72} animation="wave" />
          <Skeleton width="100%" height={72} animation="wave" />
        </>
      ) : (
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {reports.map((item, i) => (
              <TableRow key={i}>
                <TableCell align="right" style={{ width: "50%" }}>
                  <div className={innerClasses.textContainer}>
                    <p className={innerClasses.text}>
                      <strong>{item.funnel_state.name}</strong>
                    </p>
                    <p className={innerClasses.text}>{` ${intl.formatMessage({
                      id: "FUNNEL_STATES.REPORT.USERS",
                    })}: ${item.count_users_by_funnel_state}`}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={innerClasses.container}>
                    <div
                      style={{
                        height: "30px",
                        width: `${1 + 2 * item.percent_from_users_by_role}px`,
                        backgroundColor: `${item.funnel_state.color || "#ededed"}`,
                        marginRight: "8px",
                      }}
                    ></div>
                    <strong>{`${item.percent_from_users_by_role}%`}</strong>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ActivityReport;
