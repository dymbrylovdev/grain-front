import React from "react";
import { IntlShape } from "react-intl";

import useStyles from "../../styles";
import { IUser } from "../../../../interfaces/users";

interface IProps {
  intl: IntlShape;
  user: IUser;
}

const UserActivity: React.FC<IProps> = ({ intl, user }) => {
  const classes = useStyles();

  return (
    <>
      {user.is_admin ? (
        <div
          className={classes.funnelStateName}
          style={{ border: "1px solid rgba(10, 187, 135, 0.4)" }}
        >
          {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.ADMIN" })}
        </div>
      ) : !user.funnel_state ? (
        <div className={classes.funnelStateName} style={{ backgroundColor: "#f2f2f2" }}>
          {intl.formatMessage({ id: "USERLIST.FUNNEL_STATE.NO_NAME" })}
        </div>
      ) : (
        <div
          className={classes.funnelStateName}
          style={{ backgroundColor: `${user.funnel_state.color || "#ededed"}` }}
        >
          {`${user.funnel_state.engagement || "0"} • ${user.funnel_state.name}`}
        </div>
      )}
    </>
  );
};

export default UserActivity;
