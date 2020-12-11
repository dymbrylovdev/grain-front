import React from "react";
import {
  TableContainer,
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

import { accessByRoles } from "../../../../utils/utils";
import { IUser } from "../../../../interfaces/users";

interface IProps {
  intl: IntlShape;
  me: IUser;
  classes: any;
  showTariffTable: boolean;
  setShowTariffTable: any;
}

const NewTariffTable: React.FC<IProps & WrappedComponentProps> = ({ intl, me, classes, showTariffTable, setShowTariffTable }) => {
  return (
    <TableContainer style={{ display: "flex", justifyContent: "space-between" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.4)" }}>
              <b>{intl.formatMessage({ id: "TARIFFS.NAME.FREE" })}</b>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE1" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE2" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE3" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE4" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT2" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE5" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT3" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE6" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT4" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE7" })} +
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE8" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT5" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE9" })} 10
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE10" })} 1
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE11" })} 1
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE12" })} 10
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell size="small" align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE13" })}{" "}
              {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT7" })}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE14" })} -
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE15" })} -
            </TableCell>
          </TableRow>

        </TableHead>
      </Table>

      {!accessByRoles(me, ["ROLE_TRADER"]) && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.NAME.PREMIUM" })}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE1" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE2" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE3" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE4" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT2" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE5" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT3" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE6" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT4" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE7" })} +
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell size="small" align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE8" })}{" "}
                <b>{intl.formatMessage({ id: "TARIFFS.TABLE.TEXT6" })}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE9" })} <b>10</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE10" })} <b>5</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE11" })} <b>5</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE12" })} <b>50</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell size="small" align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE13" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT7" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE14" })} -
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE15" })} -
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                align="center"
                style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}
              >
                <Button variant="contained" color="primary" onClick={() => setShowTariffTable(false)}>Перейти на премиум</Button>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      )}

      {!accessByRoles(me, ["ROLE_VENDOR"]) && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.NAME.BUSINESS" })}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE1" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE2" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE3" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT1" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE4" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT2" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE5" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT3" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE6" })}{" "}
                {intl.formatMessage({ id: "TARIFFS.TABLE.TEXT4" })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE7" })} +
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell size="small" align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE8" })}{" "}
                <b>{intl.formatMessage({ id: "TARIFFS.TABLE.TEXT6" })}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE9" })} <b>10</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE10" })} <b>10</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE11" })} <b>10</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE12" })} <b>100</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE13" })}{" "}
                <b>{intl.formatMessage({ id: "TARIFFS.TABLE.TEXT8" })}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE14" })} <b>+</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                {intl.formatMessage({ id: "TARIFFS.TABLE.TITLE15" })} <b>+</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                <Button variant="contained" color="primary">Перейти на бизнес</Button>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      )}
    </TableContainer>
  );
};

export default injectIntl(NewTariffTable);
