import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../../../redux";
import { PaginationResultDto, PaginationSortableDto, StandardDataTable } from "../../_common";
import { setDocumentFileId } from "../documentSlice";
import dayjs from "dayjs";
import { useGetDocumentSmileDoc } from "../documentSssSmileApi";

type DocumentFileSmileDataTableProps = {
    documentId: string;
};

const DocumentFileSmileDataTable = ({ documentId }: DocumentFileSmileDataTableProps) => {
    const [paginated, setPaginated] = React.useState<PaginationSortableDto>({
        page: 1,
        recordsPerPage: 5,
    });
    const { data: smileDocData, isLoading } = useGetDocumentSmileDoc(
        documentId ?? "",
        paginated.page,
        paginated.recordsPerPage,
        paginated.orderingField,
        paginated.ascendingOrder
    );

    const dispatch = useAppDispatch();
    const [rowIndexSelect, setRowIndexSelect] = useState<number | undefined>(0);

    const handleSelected = (docFileId: string, rowIndex: number) => {
        if (docFileId) {
            setRowIndexSelect(rowIndex);
            const payload = {
                documentFileId: docFileId,
            };

            dispatch(setDocumentFileId(payload));
        }
    };

    const pagination: PaginationResultDto = useMemo(
        () => ({
            totalAmountRecords: smileDocData?.totalAmountRecords ?? 0,
            totalAmountPages: smileDocData?.totalAmountPages ?? 0,
            currentPage: smileDocData?.currentPage ?? 0,
            recordsPerPage: smileDocData?.recordsPerPage ?? 0,
            pageIndex: smileDocData?.pageIndex ?? 0,
        }),
        [smileDocData]
    );

    const columns: MUIDataTableColumn[] = [
        {
            name: "",
            label: "",
            options: {
                customBodyRenderLite: (rowIndex) => {
                    const docFileId = smileDocData?.data?.[rowIndex]
                        ? smileDocData?.data?.[rowIndex].documentFileCode
                        : "";
                    return (
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (docFileId) {
                                    handleSelected(String(docFileId), rowIndex);
                                }
                            }}
                            color={"info"}
                        >
                            เลือก
                        </Button>
                    );
                },
            },
        },
        { name: "documentFileName", label: "ชื่อไฟล์", options: { filter: false, sort: true } },
        {
            name: "createdDate",
            label: "วันที่และเวลาทำรายการล่าสุด",
            options: {
                filter: false,
                sort: true,
                sortDirection: "desc",
                customBodyRenderLite: (rowIndex) => {
                    const reformatDate = smileDocData?.data?.[rowIndex].createdDate
                        ? dayjs(smileDocData?.data?.[rowIndex].createdDate).format("DD-MM-BBBB HH:mm:ss")
                        : "";

                    return <Typography>{reformatDate}</Typography>;
                },
            },
        },
    ];

    useEffect(() => {
        if (smileDocData?.data && smileDocData.data.length > 0) {
            let selectedIndex = 0;

            if (rowIndexSelect !== undefined) {
                selectedIndex = rowIndexSelect;
            }

            const docFileId =
                smileDocData.data[selectedIndex]?.documentFileCode || smileDocData.data[0]?.documentFileCode;

            if (docFileId) {
                const payload = {
                    documentFileId: docFileId,
                };
                dispatch(setDocumentFileId(payload));
            }

            setRowIndexSelect(selectedIndex);
        }
    }, [smileDocData?.data, rowIndexSelect, paginated.page]);

    useEffect(() => {
        setRowIndexSelect(0);
    }, [paginated.page]);

    if (isLoading) {
        return <CircularProgress color="inherit" size={20} />;
    }

    return (
        <Grid container direction={"row"} alignContent={"center"} spacing={1}>
            <Grid item xs={12}>
                <StandardDataTable
                    name="documentFileList"
                    title=""
                    data={smileDocData?.data ?? []}
                    isLoading={isLoading}
                    columns={columns}
                    paginated={pagination}
                    setPaginated={setPaginated}
                    color="primary"
                    options={{
                        selectableRows: "single",
                        selectToolbarPlacement: "none",
                        selectableRowsHideCheckboxes: true,
                        rowsSelected: [rowIndexSelect],
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default DocumentFileSmileDataTable;
