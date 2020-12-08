import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Grid as div } from "@material-ui/core";
import { IntlShape } from "react-intl";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { accessByRoles } from "../../../../utils/utils";

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
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.4)" }}>
              <b>{intl.formatMessage({ id: "TARIFFS.NAME.PREMIUM" })}</b>
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.4)" }}>
                <b>{intl.formatMessage({ id: "TARIFFS.NAME.BUSINESS" })}</b>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>Количество публикаций объявлений</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              Неограниченно
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              Неограниченно
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                Неограниченно
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Количество активных объявлений</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              Неограниченно
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              Неограниченно
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                Неограниченно
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Количество точек отгрузки</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              Неограниченно
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              Неограниченно
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                Неограниченно
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Срок публикации заявки</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              14 дней
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              14 дней
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                14 дней
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Периодичность подписки</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              2 раза в неделю (понедельник и среда)
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              2 раза в неделю (понедельник и среда)
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                2 раза в неделю (понедельник и среда)
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Время получения подписки</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              6:00 (по Москве)
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              6:00 (по Москве)
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                6:00 (по Москве)
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell></TableCell>
            <TableCell
              align="center"
              style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}
            ></TableCell>
            <TableCell
              align="center"
              style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}
            ></TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell
                align="center"
                style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}
              ></TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Отображение объявлений в списках ваших клиентов</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              Общие условия
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              Приоритетное размещение
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                Приоритетное размещение
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Список встречных объявлений с лучшими ценами</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              10
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              10
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                10
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Количество культур с которыми можно работать в системе</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              1
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              5
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                10
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Количество подписок</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              1
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              5
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                10
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Количество просмотров контактов в день</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              8
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              50
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                80
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Обращение в службу поддержки</TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}>
              Обращения обрабатываются в течение 24 часов
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: "rgba(10, 187, 135, 0.2)" }}>
              Обращения обрабатываются в течение 24 часов
            </TableCell>
            {!accessByRoles(me, ["ROLE_VENDOR"]) && (
              <TableCell align="center" style={{ backgroundColor: "rgba(93, 120, 255, 0.2)" }}>
                Персональный менеджер
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default injectIntl(TariffTable);
