import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import DocumentDetail from "../components/DocumentDetail";
import DocumentScanFileDialog from "../components/DocumentScanFileDialog";
import DocumentUploadDialog from "../components/DocumentUploadDialog";
import { documentSelector, setDocumentId, setDocumentUploadDetail } from "../documentSlice";
import { swalError } from "../../_common";

const DocumentScanPage = () => {
    const dispatch = useAppDispatch();
    const { documentId, indexId, indexValue, mainIndex, searchIndex } = useAppSelector(documentSelector);
    // const [openScan, setOpenScan] = useState<boolean>(false);
    const [openUploadFile, setOpenUploadFile] = useState<boolean>(false);
    const { docId } = useParams();
    const [queryParam] = useSearchParams();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    //#region handle
    const handleOpenUpload = () => {
        setOpenUploadFile(true);
    };
    // const handleOpenScanDialog = () => {
    //     setOpenScan(true);
    // };

    //#endregion
    //#region BindDetail

    const docGuid = queryParam.get("documentId");
    const documentCode = queryParam.get("documentCode");
    const subtypeId = queryParam.get("documentSubType");
    const documentSubTypeId = Number(subtypeId) ? parseInt(subtypeId ?? "") : 0;
    const mainIndexParam = queryParam.get("mainIndex");
    const searchIndexParam = queryParam.get("searchIndex");
    const indexIdParam = queryParam.get("documentIndexId")?.split(",") ?? [];
    const indexValueParam = queryParam.get("documentIndexValueId")?.split(",") ?? [];

    useEffect(() => {
        if (queryParam.size !== 0) {
            if (!mainIndexParam || !searchIndexParam || !documentCode || !docGuid || !subtypeId) {
                swalError("Error", "ข้อมูลส่งมาไม่ครบ กรุณาเปิด DocStorage จากเว็บไซต์ต้นทาง อีกครั้งหนึ่ง");
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
                const payload = {
                    documentId: docGuid,
                    documentCode: documentCode,
                    documentSubTypeId: documentSubTypeId,
                    mainIndex: mainIndexParam,
                    searchIndex: searchIndexParam,
                    indexId: indexIdParam,
                    indexValue: indexValueParam,
                };
                dispatch(setDocumentUploadDetail(payload));
            }
        } else if (queryParam.size === 0) {
            if (!indexId || !indexValue || !mainIndex || !searchIndex) {
                setIsDisabled(true);
            }
        }
    }, [queryParam]);

    useEffect(() => {
        if (docId !== undefined && docId !== "") {
            const payload = {
                documentId: docId,
            };
            dispatch(setDocumentId(payload));
        }
    }, [docId]);
    //#endregion
    return (
        <Grid container direction={"column"} spacing={1}>
            <Grid item xs={12}>
                {/* <pre>{JSON.stringify(documentId ?? "", null, 2)}</pre>
                <pre>{JSON.stringify(indexId ?? "", null, 2)}</pre>
                <pre>{JSON.stringify(indexValue ?? "", null, 2)}</pre>
                <pre>{JSON.stringify(docId ?? "", null, 2)}</pre>
                <pre>{JSON.stringify(indexValue?.map((item) => item).join(" "), null, 2)}</pre>
                <pre>{JSON.stringify(mainIndex, null, 2)}</pre> */}
            </Grid>
            <Grid item xs={12}>
                <DocumentDetail document_Id={documentId !== undefined && documentId !== "" ? documentId : docId} />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    direction={"row"}
                    justifyContent={"left"}
                    style={{ textAlign: "left" }}
                    spacing={2}
                    pt={1}
                >
                    <Grid item xs={12} sm={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                handleOpenUpload();
                            }}
                            disabled={isDisabled}
                        >
                            แนบไฟล์
                        </Button>
                    </Grid>
                    {/* <Grid item xs={12} sm={2}>
                        <Button
                            variant="contained"
                            color="warning"
                            fullWidth
                            onClick={() => {
                                handleOpenScanDialog();
                                console.log(openScan);
                            }}
                            disabled={isDisabled}
                            autoFocus
                        >
                            แสกนเอกสาร
                        </Button>
                    </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <DocumentScanFileDialog />
            </Grid>
            <DocumentUploadDialog isOpenDialog={openUploadFile} isSetOpenDialog={setOpenUploadFile} />
            {/* <DocumentScanFileDialog isOpenDialog={openScan} isSetOpenDialog={setOpenScan} /> */}
        </Grid>
    );
};

export default DocumentScanPage;
