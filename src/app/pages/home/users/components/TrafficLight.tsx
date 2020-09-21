import React from "react";
import { IntlShape } from "react-intl";

import useStyles from "../../styles";
import { ColorDot } from ".";

interface IProps {
  intl: IntlShape;
  colors: string[];
}

const TrafficLight: React.FC<IProps> = ({ intl, colors }) => {
  const classes = useStyles();

  return (
    <div className={classes.box}>
      <div>
        <b>{intl.formatMessage({ id: "COMPANY.FORM.COMPANY.CHECK" })}</b>
      </div>
      {!colors.length ? (
        <div>{intl.formatMessage({ id: "COMPANY.FORM.COMPANY.CHECK.NO" })}</div>
      ) : (
        colors.map((item, i) => (
          <div className={classes.flexRow} key={i} style={{ marginTop: 4 }}>
            <ColorDot color={item} />
            <div>{intl.formatMessage({ id: `COMPANY.FORM.COMPANY.CHECK.${item}` })}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrafficLight;
