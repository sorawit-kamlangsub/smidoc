import { Grid } from "@mui/material";
import { MUIDataTableColumn } from "mui-datatables";
import React, { useMemo } from "react";
import { PaginationResultDto, PaginationSortableDto, StandardDataTable } from "../../_common";
import { useDocumentIndexValueByDocumentIdAll } from "../documentApi";

type DocumentIndexDataDataTableProps = {
    documentId: string;
};

const DocumentIndexDataDataTable = ({ documentId }: DocumentIndexDataDataTableProps) => {
    const [paginated, setPaginated] = React.useState<PaginationSortableDto>({
        page: 1,
        recordsPerPage: 20,
    });

    const { data, isLoading } = useDocumentIndexValueByDocumentIdAll(
        documentId,
        paginated.page,
        paginated.recordsPerPage,
        paginated.orderingField,
        paginated.ascendingOrder === true ? "asc" : "desc"
    );

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
        { name: "documentIndexName", label: "รายการ", options: { filter: true, sort: true } },
        { name: "value", label: "รายละเอียด", options: { filter: true, sort: true } },
    ];
    if (data?.data === undefined || data.data.length === 0) {
        return null;
    }

    return (
        <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"}>
            <Grid item xs={12}>
                <StandardDataTable
                    name="documentIndexlist"
                    title=""
                    data={data?.data ?? []}
                    isLoading={isLoading}
                    columns={columns}
                    paginated={pagination}
                    setPaginated={setPaginated}
                    color="primary"
                    displayFooter={false}
                    displayToolbar={false}
                />
            </Grid>
        </Grid>
    );
};

export default DocumentIndexDataDataTable;
