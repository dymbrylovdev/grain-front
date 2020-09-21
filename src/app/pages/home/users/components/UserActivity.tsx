import React from "react";
import { IntlShape } from "react-intl";

import useStyles from "../../styles";
import { IUser } from "../../../../interfaces/users";
import { accessByRoles } from "../../../../utils/utils";
import { roles } from "../utils/profileForm";

interface IProps {
  intl: IntlShape;
  user: IUser;
}

const UserActivity: React.FC<IProps> = ({ intl, user }) => {
  const classes = useStyles();

  return (
    <>
      {accessByRoles(user, ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TRADER"]) ? (
        <div
          className={classes.funnelStateName}
          style={{ border: "1px solid rgba(10, 187, 135, 0.4)" }}
        >
          {roles.find(item => item.id === user.roles[0])?.value}
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
