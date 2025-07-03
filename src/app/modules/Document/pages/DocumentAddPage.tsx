import { Grid, Paper } from "@mui/material";
import DocumentAddSearch from "../components/DocumentAddSearch";
import DocumentIndexTextField from "../components/DocumentIndexTextField";

const DocumentAddPage = () => {
    return (
        <Paper elevation={3}>
            {/* Custom style on current mui use sx */}
            <Grid container spacing={1} direction={"column"} justifyContent={"center"} sx={{ p: "10px" }}>
                <Grid item xs={12} sm={6} md={6}>
                    <DocumentAddSearch />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <DocumentIndexTextField />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    {/* <Grid container direction={"row"} justifyContent={"flex-end"} alignItems={"flex-end"}>
                        <Grid item xs={12} sm={2} style={{ textAlign: "right" }}>
                            <Button color={"primary"} variant={"contained"} href="scan" fullWidth>
                                บันทึก
                            </Button>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DocumentAddPage;
