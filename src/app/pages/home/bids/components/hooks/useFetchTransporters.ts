import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { archivedBId } from "../../../../../crud/bids.crud";
import { getResponseMessage } from "../../../../../utils";
import { getUsers } from "../../../../../crud/users.crud";


export const useFetchTransporters: any = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<any>(null);
    const [success, setSuccess] = useState(false);
    const [response, setResponse] = useState();
    const [pageNumber, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);



    const fetch = useCallback(
        async ({ page, perPage }) => {
            setLoading(true);
            getUsers(page, perPage, null, null, "ROLE_TRANSPORTER", null)
                .then((res: any) => {
                    setSuccess(true);
                    setPage(page)
                    setPerPage(perPage)
                    setResponse(res.data)
                    setTotal(res.data.total)
                })
                .catch(e => {
                    enqueueSnackbar(`Ошибка: ${getResponseMessage(e)}`, { variant: "error" });
                })
                .finally(() => {
                    setLoading(false);
                    setErr(null);
                    setSuccess(false);
                });
        },
        [enqueueSnackbar]
    );

    return [fetch, loading, response, pageNumber, perPage, total];
};
