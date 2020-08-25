import React from "react";
import { IntlShape } from "react-intl";
import { Tooltip } from "@material-ui/core";

import MiniColorDot from "./MiniColorDot";

interface IProps {
  intl: IntlShape;
  colors: string[];
}

const MiniTrafficLight: React.FC<IProps> = ({ intl, colors }) => {
  return (
    <div>
      {!colors.length ? (
        <div>{intl.formatMessage({ id: "COMPANY.FORM.COMPANY.CHECK.NO" })}</div>
      ) : (
        colors.map((item, i) => (
          <Tooltip
            title={intl.formatMessage({
              id: `COMPANY.FORM.COMPANY.CHECK.${item}`,
            })}
            key={i}
          >
            <div>
              <MiniColorDot color={item} />
            </div>
          </Tooltip>
        ))
      )}
    </div>
  );
};

export default MiniTrafficLight;
