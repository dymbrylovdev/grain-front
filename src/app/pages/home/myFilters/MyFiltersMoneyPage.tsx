import React from "react";
import { Paper } from "@material-ui/core";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { LayoutSubheader } from "../../../../_metronic/layout/LayoutContext";
import useStyles from "../styles";
import { PricesEdit } from "./components";

const MyFiltersMoneyPage: React.FC<WrappedComponentProps> = ({ intl }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <LayoutSubheader
        title={`${intl.formatMessage({ id: "SUBHEADER.PARTS.EDIT" })} ${intl.formatMessage({
          id: "SUBHEADER.PARTS.PRICE",
        })}`}
        breadcrumb={undefined}
        description={undefined}
      />
      <div className={classes.form}>
        <PricesEdit />
      </div>
    </Paper>
  );
};

export default injectIntl(MyFiltersMoneyPage);
