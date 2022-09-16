import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    TableFooter,
    Button,
    TextField,
    MenuItem,
    IconButton,
} from "@material-ui/core";
import TopTableCell from '../../../../../components/ui/Table/TopTableCell';
import { TablePaginator } from '../../../../../components/ui/Table/TablePaginator';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';



interface IProps {
    transportersList: any;
    fetch: any;
    page: number;
    perPage: number;
    total: number;
}

const TransporterTable = React.memo<IProps>(({ transportersList, fetch, page, perPage, total }) => {

    return (
        <div>
            <div >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TopTableCell>
                                ФИО
                            </TopTableCell>
                            <TopTableCell>
                                E-mail
                            </TopTableCell>
                            <TopTableCell>
                                Телефон
                            </TopTableCell>
                            <TopTableCell>
                                Местоположение
                            </TopTableCell>
                            <TopTableCell>                                
                            </TopTableCell>
                            <TopTableCell></TopTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transportersList &&
                            transportersList.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.firstname}
                                    </TableCell>

                                    <TableCell>
                                        {item.email}
                                    </TableCell>

                                    <TableCell>
                                        {item.phone}
                                    </TableCell>

                                    <TableCell>
                                        {item?.transport?.location.text}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip
                                        title="Просмотреть профиль"
                                        >
                                            <IconButton
                                                size="medium"
                                                color="default"
                                                onClick={()=> window.open(`/user/view/${item.id}`)}
                                            >
                                                <RemoveRedEyeIcon />
                                            </IconButton>
                                        </Tooltip>
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
                                total={total }
                                fetchRows={(page, perPage) => {
                                    fetch({
                                        page,
                                        perPage,
                                    })
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
})

export default TransporterTable