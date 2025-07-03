import { Box, ButtonBase, Grid, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import Viewer from "react-viewer";
import { useAppSelector } from "../../../../redux";
import { useDocumentFileLinkGet } from "../documentApi";
import { documentSelector } from "../documentSlice";

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

const DocumentPreview = () => {
    const { documentFileId } = useAppSelector(documentSelector);
    const [visible, setVisible] = React.useState(false);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);

    const { data } = useDocumentFileLinkGet(documentFileId, isEnabled);

    useEffect(() => {
        if (documentFileId !== "") {
            setIsEnabled(true);
        }
    }, [documentFileId]);

    if (data?.data?.pathFullDoc === "" || data?.data?.pathFullDoc === undefined) {
        return <></>;
    }

    return (
        <Grid container direction={"row"} alignContent={"flex-start"} justifyContent={"flex-start"}>
            <Grid item xs={12}>
                {data?.data?.isImage ? (
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <Box sx={{ display: "flex", flexWrap: "wrap", minWidth: 300, width: "100%" }}>
                                <ImageButton focusRipple style={{ width: "100dvh", height: "100dvh" }}>
                                    <ImageSrc style={{ backgroundImage: `url(${data?.data?.pathFullDoc})` }} />
                                    <Image
                                        onClick={() => {
                                            setVisible(!visible);
                                        }}
                                    >
                                        {/* <img src={url} width={"250px"} height={"250px"} title=""></img> */}
                                    </Image>
                                </ImageButton>
                            </Box>
                            <Viewer
                                visible={visible}
                                onClose={() => {
                                    setVisible(false);
                                }}
                                images={[{ src: `${data?.data?.pathFullDoc}` }]}
                                noFooter={false}
                                attribute={false}
                                zIndex={9999}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <>
                        <iframe width={"100%"} height={"1000px"} src={`${data?.data?.pathFullDoc}#view=fitH`}></iframe>
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default DocumentPreview;
