import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { FormikFileUploader, swalError, swalSuccess, swalWarning } from "../../_common";
import { useDocumentByIdGet_OnLoad, useDocumentCreate, useDocumentFileUpload } from "../documentApi";
import { UploadResponseDtoServiceResponse } from "../documentApi.client";
import { documentSelector, resetToDefault } from "../documentSlice";

type DocumentUploadDialogProps = {
    isOpenDialog: boolean | false;
    isSetOpenDialog: React.Dispatch<boolean>;
};

type DocumentUploadDialogForm = {
    file?: File[] | undefined;
};

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ isOpenDialog, isSetOpenDialog }) => {
    const dispatch = useAppDispatch();
    const { documentId, documentCode, documentSubTypeId, indexId, indexValue, mainIndex, searchIndex } =
        useAppSelector(documentSelector);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const defaultValues: DocumentUploadDialogForm = {
        file: undefined,
    };
    const navigate = useNavigate();
    //Mutate
    const onSuccessCallback = (data: UploadResponseDtoServiceResponse) => {
        swalSuccess("อัพโหลดไฟล์สําเร็จ", data.message ?? "").then(() => {
            if (data.isSuccess) {
                // const encodedDocId = btoa(String(data.data?.documentId));
                navigate(`/document/${String(data.data?.documentId)}/preview`);
                dispatch(resetToDefault());
                setIsDisabled(false);
                handleClose();
            }
        });
    };

    const onErrorCallback = (error: string) => {
        swalError("Error", error);
    };

    const { mutate } = useDocumentCreate(onSuccessCallback, onErrorCallback);
    const { data } = useDocumentByIdGet_OnLoad(String(documentId), isEnabled);
    const updateFile = useDocumentFileUpload(String(documentId), onSuccessCallback, onErrorCallback);

    const handleClose = () => {
        isSetOpenDialog(false);
        setIsDisabled(false);
    };

    const handleMutate = (values: File[] | undefined) => {
        if (values) {
            setIsDisabled(true);
            const toBlobFile = new Blob(values, { type: values[0].type });
            const uploadfilename = values[0].name;
            const fileUploadpayload = {
                data: toBlobFile,
                fileName: uploadfilename,
            };
            const payload = {
                documentCode:
                    data?.data?.documentCode !== "" && data?.data?.documentCode !== undefined
                        ? data?.data?.documentCode
                        : documentCode,
                documentId: data?.data?.documentId !== undefined ? data.data.documentId : documentId,
                documentSubTypeId: documentSubTypeId,
                mainIndex: mainIndex,
                searchIndex: searchIndex,
                documentIndexId: indexId?.map(Number),
                documentIndexValue: indexValue,
                fileUploads: [fileUploadpayload],
            };

            if (data?.data?.documentId !== undefined) {
                const payloadUpdateFile = {
                    document: [fileUploadpayload],
                };
                updateFile.mutate(payloadUpdateFile);
            } else {
                mutate(payload);
            }
        }
    };

    const formik = useFormik<DocumentUploadDialogForm>({
        initialValues: defaultValues,
        enableReinitialize: true,
        onSubmit: () => {
            formik.setSubmitting(false);
            //onSubmitDemo(formik, values);
        },
    });

    useEffect(() => {
        if (documentId !== undefined) {
            setIsEnabled(true);
            // getDocDetailById(documentId);
        }
    }, [documentId]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Dialog fullScreen={fullScreen} open={isOpenDialog} fullWidth maxWidth={"md"} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">{"แนบไฟล์เอกสาร"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Grid container>
                            <Grid item xs={12} sx={{ padding: 0 }}>
                                <Typography variant="body2" sx={{ color: "#FF1100" }}>
                                    *** นามสกุลไฟล์ที่เป็น .pdf/.jpg/.jpeg/.png เท่านั้น
                                </Typography>
                                <FormikFileUploader
                                    icon="cloud_upload"
                                    maxFiles={1}
                                    accept={{
                                        "image/jpeg": [".jpeg", ".jpg", ".JPEG", ".JPG"],
                                        "image/png": [".png", ".PNG"],
                                        "text/pdf": [".pdf", ".PDF"],
                                    }}
                                    formik={formik}
                                    name="file"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleClose();
                        }}
                        color="error"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            if (formik.values.file && formik.values.file.length >= 1) {
                                handleMutate(formik.values.file);
                            } else {
                                swalWarning("", "กรุณาเลือกไฟล์ที่ต้องการอัพโหลด");
                            }
                        }}
                        disabled={isDisabled}
                    >
                        {isDisabled && (
                            <CircularProgress
                                size={20}
                                sx={{
                                    color: "#FFFFFF",
                                }}
                            />
                        )}{" "}
                        {isDisabled !== true && <Typography> บันทึก</Typography>}
                    </Button>
                </DialogActions>
                {/* <Grid item xs={12}>
                    <pre>{JSON.stringify(data ?? "", null, 2)}</pre>
                </Grid> */}
            </Dialog>
        </form>
    );
};

export default DocumentUploadDialog;
