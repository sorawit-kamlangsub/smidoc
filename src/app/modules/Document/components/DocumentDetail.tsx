import { CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../redux";
import { useDocumentByIdGet, useDocumentSubTypeGet, useDocumentTypeGetAfterGetSubType } from "../documentApi";
import { documentSelector } from "../documentSlice";

type DocumentDetailProps = {
    document?: any | [];
    document_Id?: string | undefined;
};

type payload = {
    documentCode?: string | undefined;
    searchIndex?: string | undefined;
    documentTypeName?: string | undefined;
    documentSubTypeName?: string | undefined;
};

const DocumentDetail = ({ document_Id }: DocumentDetailProps) => {
    const { indexValue, documentCode, documentSubTypeId, searchIndex } = useAppSelector(documentSelector);
    const [isEnable, setIsEnable] = useState<boolean>(false);
    const detail: payload = {
        documentCode: "",
        searchIndex: "",
        documentTypeName: "",
        documentSubTypeName: "",
    };

    const { data, isLoading } = useDocumentByIdGet(document_Id ?? "");
    const { data: documentSubTypeName, isLoading: documentSubTypeLoading } = useDocumentSubTypeGet(
        undefined,
        documentSubTypeId
    );

    useEffect(() => {
        if (documentSubTypeId !== undefined && documentSubTypeId !== 0) {
            setIsEnable(true);
        } else {
            setIsEnable(false);
        }
    }, [documentSubTypeId]);

    const { data: documentTypeName, isLoading: documentTypeLoading } = useDocumentTypeGetAfterGetSubType(
        Number(documentSubTypeName?.data?.map((item) => item.documentTypeId)),
        isEnable
    );

    if (isLoading) {
        return <CircularProgress color="inherit" size={20} />;
    }
    if (isLoading && documentSubTypeLoading) {
        return <CircularProgress color="inherit" size={20} />;
    }
    if (isLoading && documentTypeLoading) {
        return <CircularProgress color="inherit" size={20} />;
    }

    if (data?.data && document_Id !== undefined) {
        detail.documentCode = data.data.documentCode;
        detail.documentSubTypeName = data.data.documentSubTypeName;
        detail.documentTypeName = data.data.documentTypeName;
        detail.searchIndex = data.data.searchIndex;
    } else {
        detail.documentCode = documentCode;
        detail.documentTypeName = documentTypeName?.data !== undefined ? documentTypeName.data[0].documentTypeName : "";
        detail.documentSubTypeName = String(documentSubTypeName?.data?.map((item) => item.documentSubTypeName));
        detail.searchIndex =
            indexValue !== undefined && indexValue.length > 0 ? indexValue?.map((item) => item).join(" ") : searchIndex;
    }

    return (
        <Grid container direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"} rowSpacing={1}>
            <Grid item xs={12}>
                <Grid container direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                    <Grid item sm={4}>
                        <Typography variant="body1" style={{ fontSize: "13px", fontWeight: "bold", color: "GrayText" }}>
                            รหัสเอกสาร :
                        </Typography>
                    </Grid>
                    <Grid item sm={8}>
                        <Typography variant="body2" style={{ color: "#3B3938" }}>
                            {detail.documentCode}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                    <Grid item sm={4}>
                        <Typography
                            component={"p"}
                            variant="body1"
                            style={{ fontSize: "13px", fontWeight: "bold", color: "GrayText" }}
                        >
                            ประเภทเอกสาร :
                        </Typography>
                    </Grid>
                    <Grid item sm={8}>
                        <Typography component={"p"} variant="body2" style={{ color: "#3B3938" }}>
                            {detail.documentTypeName} / {detail.documentSubTypeName}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                    <Grid item sm={4}>
                        <Typography
                            component={"p"}
                            variant="body1"
                            style={{ fontSize: "13px", fontWeight: "bold", color: "GrayText" }}
                        >
                            รายละเอียด :
                        </Typography>
                    </Grid>
                    <Grid item sm={8}>
                        <Typography component={"p"} variant="body2" style={{ color: "#3B3938" }}>
                            {detail.searchIndex}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DocumentDetail;
