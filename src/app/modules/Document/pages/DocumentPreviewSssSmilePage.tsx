import { Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import DocumentSssPreview from "../components/DocumentSssPreview";
import DocumentFileSssDataTable from "../components/DocumentFileSssDataTable";
import DocumentFileSmileDataTable from "../components/DocumentFileSmileDataTable";
import DocumentSmilePreview from "../components/DocumentSmilePreview";

const DocumentPreviewSssSmilePage = () => {
    const { documentId } = useParams();

    // NOTE - Decode
    let decodedDocumentId: string = "";
    try {
        decodedDocumentId = atob(String(documentId));
    } catch (error) {
        decodedDocumentId = "";
    }

    return (
        <Paper elevation={3}>
            <Grid
                container
                direction={"row"}
                alignItems={"flex-start"}
                justifyContent={"center"}
                style={{ padding: "25px" }}
                spacing={1}
            >
                <Grid item xs={12} sm={5}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            {/* NOTE - เช็คว่าเป็น Number ไหมถ้าเป็นให้เปิดของ smileDoc ถ้าไม่เป็นให้เปิดของ sssDoc */}
                            {isNaN(Number(decodedDocumentId)) ? (
                                <DocumentFileSssDataTable documentId={decodedDocumentId ?? ""} />
                            ) : !isNaN(Number(decodedDocumentId)) ? (
                                <DocumentFileSmileDataTable documentId={decodedDocumentId ?? ""} />
                            ) : (
                                <Grid
                                    container
                                    direction={"row"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                    style={{ padding: "5px" }}
                                    spacing={1}
                                >
                                    <Grid item xs></Grid>
                                    <Grid item xs={6} sx={{ textAlign: "center" }}>
                                        <Typography variant="h6">ไม่พบเอกสาร</Typography>
                                    </Grid>
                                    <Grid item xs></Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={7}>
                    {isNaN(Number(decodedDocumentId)) ? (
                        <DocumentSssPreview documentId={decodedDocumentId ?? ""} />
                    ) : !isNaN(Number(decodedDocumentId)) ? (
                        <DocumentSmilePreview documentId={decodedDocumentId ?? ""} />
                    ) : null}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DocumentPreviewSssSmilePage;
