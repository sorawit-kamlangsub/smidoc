import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { MUIDataTableColumn } from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import {
    FormikCheckbox,
    PaginationResultDto,
    PaginationSortableDto,
    StandardDataTable,
    swalConfirm,
    swalError,
    swalSuccess,
} from "../../_common";
import { useDocumentFileByDocumentIdAll, useDocumentFileDelete, useReUploadDocumentFile } from "../documentApi";
import { documentSelector, resetToDefault, setDocumentFileId } from "../documentSlice";
import { useFormik } from "formik";
import dayjs, { Dayjs } from "dayjs";

type DialogInformation = {
    recoveredByUserId: string | undefined;
    deleteByUserId: string | undefined;
    deleteDate: Dayjs | undefined;
    createdByUserId: string | undefined;
    createdDate: Dayjs | undefined;
    updateDate: Dayjs | undefined;
    recoveredDate: Dayjs | undefined;
};

const InformationDialog = ({
    createdDate,
    updateDate,
    createdByUserId,
    deleteDate,
    deleteByUserId,
    recoveredByUserId,
    recoveredDate,
}: DialogInformation) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={() => {
                    handleClickOpen();
                }}
                style={{ backgroundColor: "#03A9F4" }}
            >
                ประวัติ
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
                <DialogTitle style={{ color: "#007AC1" }}>
                    <b>ประวัติการทำรายการ</b>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>ผู้สร้างรายการ:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>{createdByUserId}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>วันที่สร้างรายการ:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>
                                        {createdDate ? dayjs(createdDate).format("DD/MM/BBBB HH:mm:ss") : ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>วันที่และเวลาทำรายการล่าสุด:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>
                                        {updateDate ? dayjs(updateDate).format("DD/MM/BBBB HH:mm:ss") : ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>ผู้ลบรายการ:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>{deleteByUserId}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>วันที่ลบรายการ:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>
                                        {deleteDate ? dayjs(deleteDate).format("DD/MM/BBBB HH:mm:ss") : ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>ผู้เรียกคืนรายการ:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>{recoveredByUserId}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center">
                                <Grid item xs={4} md={3}>
                                    <b>วันที่เรียกคืน:</b>
                                </Grid>
                                <Grid item xs={8} md={9}>
                                    <Typography>
                                        {recoveredDate ? dayjs(recoveredDate).format("DD/MM/BBBB HH:mm:ss") : ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        autoFocus
                        color="error"
                        size="large"
                        style={{ width: "20%" }}
                    >
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

type DocumentFileDataTableProps = {
    documentId: string;
};

type FormikDefaultValue = {
    isActive: boolean;
};

const DocumentFileDataTable = ({ documentId }: DocumentFileDataTableProps) => {
    const dispatch = useAppDispatch();
    const { documentFileId } = useAppSelector(documentSelector) ?? "";
    const [rowIndexSelect, setRowIndexSelect] = useState<number | undefined>(0);

    const defaultValues: FormikDefaultValue = {
        isActive: false,
    };

    const formik = useFormik<FormikDefaultValue>({
        enableReinitialize: true,
        initialValues: defaultValues,
        onSubmit: () => {},
    });

    const handleDelete = (id: string | undefined) => {
        swalConfirm("ยืนยันการทำรายการ", "ต้องการลบรายการหรือไม่ ?", "ตกลง", "ยกเลิก").then((result) => {
            if (result.isConfirmed) {
                const payload = {
                    documentfileid: id ?? "",
                };
                mutate(payload);
                if (id === documentFileId) {
                    setRowIndexSelect(0);
                }
                dispatch(resetToDefault());
            }
        });
    };

    const handleReUpload = (id: string | undefined) => {
        swalConfirm("ยืนยันการทำรายการ", "ต้องการเรียกคืนรายการหรือไม่ ?", "ตกลง", "ยกเลิก").then((result) => {
            if (result.isConfirmed) {
                const payload = {
                    documentfileid: id ?? "",
                };
                reUploadMutate(payload);
                if (id === documentFileId) {
                    setRowIndexSelect(0);
                }
                dispatch(resetToDefault());
            }
        });
    };

    const handleSelected = (docFileId: string, rowIndex: number) => {
        if (docFileId) {
            setRowIndexSelect(rowIndex);
            const payload = {
                documentFileId: docFileId,
            };
            dispatch(setDocumentFileId(payload));
        }
    };

    const [paginated, setPaginated] = React.useState<PaginationSortableDto>({
        page: 1,
        recordsPerPage: 5,
    });
    const { data, isLoading } = useDocumentFileByDocumentIdAll(
        documentId,
        paginated.page,
        paginated.recordsPerPage,
        paginated.orderingField,
        paginated.ascendingOrder === true ? "asc" : "desc",
        formik.values.isActive
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
        {
            name: "",
            label: "",
            options: {
                customBodyRenderLite: (rowIndex) => {
                    // const docFileId = data?.data ? data.data[rowIndex].documentFileId : undefined;
                    const docFileId = data?.data && data.data[rowIndex] ? data.data[rowIndex].documentFileId : "";

                    return (
                        // <Button
                        //     variant="contained"
                        //     onClick={() => {
                        //         handleSelected(String(docFileId), rowIndex);
                        //         console.log(rowIndex);
                        //     }}
                        //     color={"info"}
                        // >
                        //     เลือก
                        // </Button>
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
        { name: "fileName", label: "ชื่อไฟล์", options: { filter: false, sort: true } },
        {
            name: "createdDate",
            label: "วันที่สร้างรายการ",
            options: {
                filter: false,
                sort: true,
                sortDirection: "desc",
                customBodyRenderLite: (rowIndex) => {
                    const reformatDate = data?.data?.[rowIndex].createdDate
                        ? dayjs(data?.data?.[rowIndex].createdDate).format("DD-MM-BBBB HH:mm:ss")
                        : "";

                    return <Typography>{reformatDate}</Typography>;
                },
            },
        },

        {
            name: "",
            label: "รายละเอียด",
            options: {
                customBodyRenderLite: (rowIndex) => {
                    const id = data?.data ? data?.data[rowIndex].documentFileId : "";
                    if (!formik.values.isActive) {
                        return (
                            <div>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleDelete(id);
                                            }}
                                            style={{ backgroundColor: "#FF0000" }}
                                        >
                                            <DeleteIcon /> ลบ
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <InformationDialog
                                            createdByUserId={data?.data?.[rowIndex].createdByUserName}
                                            createdDate={
                                                data?.data?.[rowIndex].createdDate
                                                    ? data?.data?.[rowIndex].createdDate
                                                    : undefined
                                            }
                                            updateDate={
                                                data?.data?.[rowIndex].updatedDate
                                                    ? data?.data?.[rowIndex].updatedDate
                                                    : undefined
                                            }
                                            deleteByUserId={data?.data?.[rowIndex].deletedByUserName}
                                            deleteDate={
                                                data?.data?.[rowIndex].deletedDate
                                                    ? data?.data?.[rowIndex].deletedDate
                                                    : undefined
                                            }
                                            recoveredByUserId={data?.data?.[rowIndex].recoveredByUserName}
                                            recoveredDate={
                                                data?.data?.[rowIndex].recoveredDate
                                                    ? data?.data?.[rowIndex].recoveredDate
                                                    : undefined
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <Grid container>
                                    <Grid item>
                                        <Button
                                            onClick={() => {
                                                handleReUpload(id);
                                            }}
                                            variant="contained"
                                            color={"primary"}
                                            style={{ backgroundColor: "#388E3C" }}
                                        >
                                            เรียกคืน{" "}
                                        </Button>
                                    </Grid>
                                    <Grid item style={{ marginLeft: "10px" }}>
                                        <InformationDialog
                                            createdByUserId={data?.data?.[rowIndex].createdByUserName}
                                            createdDate={
                                                data?.data?.[rowIndex].createdDate
                                                    ? data?.data?.[rowIndex].createdDate
                                                    : undefined
                                            }
                                            updateDate={
                                                data?.data?.[rowIndex].updatedDate
                                                    ? data?.data?.[rowIndex].updatedDate
                                                    : undefined
                                            }
                                            deleteByUserId={data?.data?.[rowIndex].deletedByUserName}
                                            deleteDate={
                                                data?.data?.[rowIndex].deletedDate
                                                    ? data?.data?.[rowIndex].deletedDate
                                                    : undefined
                                            }
                                            recoveredByUserId={data?.data?.[rowIndex].recoveredByUserName}
                                            recoveredDate={
                                                data?.data?.[rowIndex].recoveredDate
                                                    ? data?.data?.[rowIndex].recoveredDate
                                                    : undefined
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        );
                    }
                },
            },
        },
    ];

    const onSuccessCallback = () => {
        swalSuccess("", "ลบรายการสำเร็จ").then(() => {
            //navigate("/product-group");
        });
    };

    const onSuccessReUploadCallback = () => {
        swalSuccess("Success", "เรียกคืนสำเร็จ").then(() => {});
    };

    const onErrorCallback = (error: string) => {
        swalError("Error", error).then(() => {});
    };

    const { mutate } = useDocumentFileDelete(documentId ?? "", onSuccessCallback, onErrorCallback);
    const { mutate: reUploadMutate } = useReUploadDocumentFile(
        documentId ?? "",
        onSuccessReUploadCallback,
        onErrorCallback
    );

    useEffect(() => {
        if (data?.data && data.data.length > 0) {
            let selectedIndex = 0;

            if (rowIndexSelect !== undefined) {
                selectedIndex = rowIndexSelect;
            }

            const docFileId = data.data[selectedIndex]?.documentFileId || data.data[0]?.documentFileId;

            if (docFileId) {
                const payload = {
                    documentFileId: docFileId,
                };
                dispatch(setDocumentFileId(payload));
            }

            setRowIndexSelect(selectedIndex);
        }
    }, [data?.data, rowIndexSelect, paginated.page]);

    useEffect(() => {
        setRowIndexSelect(0);
    }, [paginated.page]);

    useEffect(() => {
        setRowIndexSelect(0);

        return () => {};
    }, [formik.values.isActive]);

    console.log("data?.data ", data?.data);
    return (
        <Grid container direction={"row"} alignContent={"center"} spacing={1}>
            <Grid item xs={4}>
                <FormikCheckbox formik={formik} name="isActive" label="แสดงรายการที่ถูกลบ" />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={12}>
                <StandardDataTable
                    name="documentFileList"
                    title=""
                    data={data?.data ?? []}
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
            <Grid item xs={12}>
                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" pt={1}>
                    <Grid item xs={12} sm={3} style={{ textAlign: "right" }}>
                        {!formik.values.isActive && (
                            <Button variant="outlined" href={`scanUpdate`} fullWidth>
                                เพิ่มรายการ
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DocumentFileDataTable;
