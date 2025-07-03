import { CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import DocumentDetail from "../components/DocumentDetail";
import DocumentFileDataTable from "../components/DocumentFileDataTable";
import DocumentIndexDataDataTable from "../components/DocumentIndexDataDataTable";
import DocumentPreview from "../components/DocumentPreview";
import { useDocumentByIdGet } from "../documentApi";

const DocumentPreviewPage = () => {
    const { documentId } = useParams();

    const decodedDocumentId: string = String(documentId);

    const { data, isLoading } = useDocumentByIdGet(decodedDocumentId ?? "");

    if (isLoading) {
        return <CircularProgress color="inherit" size={20} />;
    }

    if (data?.data !== null) {
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
                                {/* {JSON.stringify(data?.data)} */}
                                <DocumentDetail document_Id={decodedDocumentId} />
                            </Grid>

                            <Grid item xs={12}>
                                <DocumentIndexDataDataTable documentId={decodedDocumentId ?? ""} />
                            </Grid>
                            <Grid item xs={12}>
                                <DocumentFileDataTable documentId={decodedDocumentId ?? ""} />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Grid
                                    container
                                    direction={"row"}
                                    justifyContent={"flex-end"}
                                    alignItems={"flex-end"}
                                    pt={1}
                                >
                                    <Grid item xs={12} sm={3} style={{ textAlign: "right" }}>
                                        <Button variant={"outlined"} href={`scanUpdate`} fullWidth>
                                            เพิ่มรายการ
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid> */}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <DocumentPreview />
                    </Grid>
                </Grid>
            </Paper>
        );
    } else {
        return (
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
        );
    }
};

export default DocumentPreviewPage;
