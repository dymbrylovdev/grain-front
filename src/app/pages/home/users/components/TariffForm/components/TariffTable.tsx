import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Grid as div,
} from "@material-ui/core";
import { IntlShape } from "react-intl";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { accessByRoles } from "../../../../../../utils/utils";

interface IProps {
  intl: IntlShape;
  me: any;
  classes: any;
}

const TariffTable: React.FC<IProps & WrappedComponentProps> = ({ intl, classes, me }) => {
  return (
    <div className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
              <b>{intl.formatMessage({ id: "TARIFFS.NAME.FREE" })}</b>
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.NAME.PREMIUM" })}</b>
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.NAME.BUSINESS" })}</b>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE1" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE2" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE3" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE4" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT2" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT2" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT2" })}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE5" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT3" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT3" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT3" })}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE6" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT4" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT4" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT4" })}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE7" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              +
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                +
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                +
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE8" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT5" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.TABLE.TEXT6" })}</b>
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.TABLE.TEXT6" })}</b>
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE9" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              10
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                <b>10</b>
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                <b>10</b>
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE10" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              1
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                <b>5</b>
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                <b>10</b>
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE11" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              1
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                <b>5</b>
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                <b>10</b>
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE12" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              10
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                <b>50</b>
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                <b>100</b>
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>{intl.formatMessage({ id: "TARIFFS.TABLE.TITLE13" })}</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT7" })}
            </TableCell>
            {!accessByRoles(me, ["ROLE_TRADER"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT7" })}
              </TableCell>
            )}
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT8" })}
              </TableCell>
            )}
          </TableRow>

        </TableBody>
      </Table>
    </div>
  );
};

export default injectIntl(TariffTable);
