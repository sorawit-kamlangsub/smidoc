import { Box, ButtonBase, CircularProgress, Grid, styled } from "@mui/material";
import React from "react";
import Viewer from "react-viewer";
import { useAppSelector } from "../../../../redux";
import { documentSelector } from "../documentSlice";
import { useGetDocumentSSSDoc } from "../documentSssSmileApi";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: "relative",
    height: 200,
    [theme.breakpoints.down("sm")]: {
        width: "100% !important",
        height: 100,
    },
    "&:hover, &.Mui-focusVisible": {
        zIndex: 1,
        "& .MuiImageBackdrop-root": {
            opacity: 0.15,
        },
        "& .MuiImageMarked-root": {
            opacity: 0,
        },
        "& .MuiTypography-root": {
            border: "4px solid currentColor",
        },
    },
}));

const ImageSrc = styled("span")({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
}));

type DocumentSssPreviewProps = {
    documentId: string;
};

const DocumentSssPreview = ({ documentId }: DocumentSssPreviewProps) => {
    // NOTE - ดึงข้อมูลจาก API มาใช้
    const { data: sssDocData, isLoading } = useGetDocumentSSSDoc(
        documentId ?? "",
        undefined,
        undefined,
        undefined,
        undefined
    );
    const { documentFileId } = useAppSelector(documentSelector);

    // NOTE - เลือก Show data จากการเลือก Document File ID ใน DataTable
    const selectShowPdf = sssDocData?.data?.find((item) => item.documentFileCode === documentFileId);

    const [visible, setVisible] = React.useState(false);

    if (isLoading) {
        return <CircularProgress color="inherit" size={20} />;
    }
    return (
        <Grid container direction={"row"} alignContent={"flex-start"} justifyContent={"flex-start"}>
            <Grid item xs={12}>
                {!sssDocData?.data ? null : sssDocData?.data?.[0]?.isImage ? (
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <Box sx={{ display: "flex", flexWrap: "wrap", minWidth: 300, width: "100%" }}>
                                <ImageButton focusRipple style={{ width: "100dvh", height: "100dvh" }}>
                                    <ImageSrc
                                        style={{ backgroundImage: `url(${sssDocData?.data?.[0]?.urlFilePath})` }}
                                    />
                                    <Image
                                        onClick={() => {
                                            setVisible(!visible);
                                        }}
                                    ></Image>
                                </ImageButton>
                            </Box>
                            <Viewer
                                visible={visible}
                                onClose={() => {
                                    setVisible(false);
                                }}
                                images={[{ src: `${sssDocData?.data?.[0]?.urlFilePath}` }]}
                                noFooter={false}
                                attribute={false}
                                zIndex={9999}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <>
                        <iframe
                            width={"100%"}
                            height={"1000px"}
                            // selectShowPdf ถ้าเป็น undefined ให้ใช้ค่าจาก sssDocData ที่เป็น index แรก ถ้าไม่ใช๋่ จะใช้ค่า จาก selectShowPdf
                            src={`${
                                selectShowPdf ? selectShowPdf?.urlFilePath : sssDocData?.data?.[0]?.urlFilePath
                            }#view=fitH`}
                        ></iframe>
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default DocumentSssPreview;
