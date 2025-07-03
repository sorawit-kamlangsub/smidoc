import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import DocumentDetail from "../components/DocumentDetail";
import DocumentScanFileDialog from "../components/DocumentScanFileDialog";
import DocumentUploadDialog from "../components/DocumentUploadDialog";
import { documentSelector, setDocumentId } from "../documentSlice";
import { swalError } from "../../_common";

const DocumentScanPage = () => {
    const dispatch = useAppDispatch();
    const { documentId } = useAppSelector(documentSelector);
    // const [openScan, setOpenScan] = useState<boolean>(false);
    const [openUploadFile, setOpenUploadFile] = useState<boolean>(false);
    const { docId } = useParams();
    //#region handle
    const handleOpenUpload = () => {
        setOpenUploadFile(true);
    };
    // const handleOpenScanDialog = () => {
    //     setOpenScan(true);
    // };

    //#endregion
    //#region BindDetail

    if (!docId) {
        swalError("Error", "ข้อมูลส่งมาไม่ครบ กรุณาเปิด DocStorage จากเว็บไซต์ต้นทาง อีกครั้งหนึ่ง");
    }

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
                <pre>{JSON.stringify(indexValue?.map((item) => item).join(" "), null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(mainIndex, null, 2)}</pre> */}
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
                    spacing={1}
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
                            autoFocus
                        >
                            แสกนเอกสาร
                        </Button>
                    </Grid> */}
                </Grid>
            </Grid>
            <DocumentUploadDialog isOpenDialog={openUploadFile} isSetOpenDialog={setOpenUploadFile} />
            <DocumentScanFileDialog />
        </Grid>
    );
};

export default DocumentScanPage;
