import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip, TableFooter, IconButton } from "@material-ui/core";
import TopTableCell from "../../../../../components/ui/Table/TopTableCell";
import { TablePaginator } from "../../../../../components/ui/Table/TablePaginator";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import EditIcon from "@material-ui/icons/Edit";
import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { useBidTableStyles } from "../hooks/useStyles";

interface IProps {
  transportersList: any;
  fetch: any;
  page: number;
  perPage: number;
  total: number;
}

const TransporterTable = React.memo<IProps>(({ transportersList, fetch, page, perPage, total }) => {

  const classes = useBidTableStyles();
  const { me } = useSelector(
    ({ auth }: any) => ({ me: auth.user }),
    shallowEqual
  );
  return (
    <div className={classes.transpoterTable} >
      <div>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TopTableCell>ФИО</TopTableCell>
              <TopTableCell>Телефон</TopTableCell>
              <TopTableCell>Местоположение</TopTableCell>
              <TopTableCell>Параметры</TopTableCell>
              <TopTableCell>Действия</TopTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transportersList &&
              transportersList.map(item => (
                <TableRow key={item.id}>
                  {console.log("item?.transport", item?.transport)}
                  <TableCell>{item.firstname}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item?.transport?.location?.text}</TableCell>
                  <TableCell>
                    {item?.transport?.weight && <div>Максимальный вес (тонна): {item?.transport?.weight}<br /></div>}
                    {item?.transport?.amount && <div>Количество машин: {item?.transport?.amount}<br /></div>}
                    {item?.transport?.overload && <div>Погрузка: {item?.transport?.loading === 'side' ? 'Боковая' : 'Задняя'}<br /></div>}
                    {item?.transport?.overload && <div>Перегруз: {item?.transport?.overload === 'overload' ? 'Перегруз' : 'Норма'}<br /></div>}
                    {item?.transport?.sidewall_height && <div>Высота борта(метры): {item?.transport?.sidewall_height}<br /></div>}
                    {item?.transport?.sidewall_height && <div>Высота кабины(метры): {item?.transport?.cabin_height}<br /></div>}
                    {item?.transport?.length && <div>Длина машины(метры): {item?.transport?.length}<br /></div>}
                    {item?.transport?.name && <div>Название машины: {item?.transport?.name}<br /></div>}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Просмотреть профиль">
                      <IconButton size="medium" color="default" onClick={() => window.open(`/user/view/${item.id}`)}>
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </Tooltip>
                    {(me.roles.includes("ROLE_ADMIN") || me.roles.includes("ROLE_VENDOR")) && (
                      <Tooltip title="Редактировать профиль">
                        <IconButton size="medium" color="default" onClick={() => window.open(`/user/edit/${item.id}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePaginator
                page={page}
                realPerPage={0}
                perPage={perPage}
                total={total}
                fetchRows={(page, perPage) => {
                  fetch({
                    page,
                    perPage,
                  });
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
});

export default TransporterTable;
