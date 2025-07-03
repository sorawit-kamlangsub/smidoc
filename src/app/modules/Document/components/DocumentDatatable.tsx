import { Button, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { MUIDataTableColumn } from "mui-datatables";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { PaginationResultDto, PaginationSortableDto, StandardDataTable } from "../../_common";
import { useDocumentAllGet } from "../documentApi";
import { documentSelector, setDocumentSearchPaginated } from "../documentSlice";

const DocumentDatatable = () => {
    // use payload from redux for use-query
    const dispatch = useAppDispatch();
    const { documentSearchPagination, documentSubTypeId, documentTypeId, searchText } =
        useAppSelector(documentSelector);

    const { data, isLoading } = useDocumentAllGet(
        documentSearchPagination.page,
        documentSearchPagination.recordsPerPage,
        documentTypeId,
        documentSubTypeId,
        searchText,
        documentSearchPagination.orderingField,
        documentSearchPagination.ascendingOrder === true ? "asc" : "desc"
    );

    const handlePagination: React.Dispatch<React.SetStateAction<PaginationSortableDto>> = (newPaginate) => {
        if (typeof newPaginate == "function") {
            dispatch(setDocumentSearchPaginated(newPaginate(documentSearchPagination)));
        } else {
            dispatch(setDocumentSearchPaginated(newPaginate));
        }
    };

    const pagination: PaginationResultDto = useMemo(
        () => ({
            totalAmountRecords: data?.totalAmountRecords ?? 0,
            totalAmountPages: data?.totalAmountPages ?? 0,
            currentPage: data?.currentPage ?? 0,
            recordsPerPage: data?.recordsPerPage ?? 0,
            pageIndex: data?.pageIndex ?? 0,
        }),
        [data]
    );

    const columns: MUIDataTableColumn[] = [
        { name: "documentCode", label: "รหัสเอกสาร", options: { filter: false, sort: true } },
        { name: "documentTypeName", label: "ประเภทเอกสาร", options: { filter: true, sort: true } },
        { name: "documentSubTypeName", label: "ประเภทย่อยเอกสาร", options: { filter: true, sort: true } },
        { name: "searchIndex", label: "รายละเอียด", options: { filter: true, sort: true } },
        { name: "fileCount", label: "จำนวนเอกสาร", options: { filter: true, sort: true } },
        {
            name: "createdDate",
            label: "วันที่สร้างเอกสาร",
            options: {
                filter: true,
                sort: true,
                customBodyRenderLite: (rowIndex) => {
                    const date = data?.data ? data.data[rowIndex].createdDate : "";
                    const dateFormat = dayjs(date).format("DD-MM-BBBB HH:mm:ss");
                    return <Typography>{dateFormat}</Typography>;
                },
            },
        },
        {
            name: "",
            label: "รายละเอียด",
            options: {
                customBodyRenderLite: (rowIndex) => {
                    const id = data?.data ? data.data[rowIndex].documentId : "0";
                    return (
                        <Button
                            variant="contained"
                            href={`/document/${id}/preview`}
                            target="_blank"
                            sx={{ width: "15dvh" }}
                        >
                            ดูรายละเอียด
                        </Button>
                    );
                },
            },
        },
    ];
    return (
        <Grid container direction={"column"}>
            <Grid item xs={12}>
                <StandardDataTable
                    name="documentlist"
                    data={data?.data ?? []}
                    isLoading={isLoading}
                    columns={columns}
                    paginated={pagination}
                    setPaginated={handlePagination}
                    color="primary"
                />
            </Grid>
        </Grid>
    );
};

export default DocumentDatatable;
