import { Card, CardContent, Grid } from "@mui/material";
import DocumentDatatable from "../components/DocumentDatatable";
import DocumentSearch from "../components/DocumentSearch";
import { useAppDispatch } from "../../../../redux";
import { useEffect } from "react";
import { resetToDefault } from "../documentSlice";

const DocumentPage = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetToDefault());
    }, []);

    return (
        <Card>
            <CardContent sx={{ p: "10px" }}>
                <Grid container spacing={1} direction={"column"} justifyContent={"center"}>
                    <Grid item xs={12} sm={6} md={6}>
                        <DocumentSearch></DocumentSearch>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <DocumentDatatable></DocumentDatatable>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default DocumentPage;
