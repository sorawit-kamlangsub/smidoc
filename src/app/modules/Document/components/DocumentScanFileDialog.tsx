import { Button, CircularProgress, Grid, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
import Dynamsoft from "dwt";
import { WebTwain } from "dwt/WebTwain";
import { SourceDetails } from "dwt/WebTwain.Acquire";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VITE_DYNASOFT_KEY } from "../../../../Const";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { swalError, swalSuccess, swalWarning } from "../../_common";
import { useDocumentByIdGet_OnLoad, useDocumentCreate, useDocumentFileUpload } from "../documentApi";
import { UploadResponseDtoServiceResponse } from "../documentApi.client";
import { documentSelector, resetToDefault } from "../documentSlice";

// type DocumentScanFileDialogProps = {
//     isOpenDialog: boolean;
//     isSetOpenDialog: React.Dispatch<boolean>;
// };

//custom Style
const CustomGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.only("xs")]: {
        textAlign: "center",
    },
}));

const DocumentScanFileDialog = () => {
    const theme = useTheme();
    const breakPoints = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useAppDispatch();
    const { documentId, documentCode, documentSubTypeId, indexId, indexValue, mainIndex, searchIndex } =
        useAppSelector(documentSelector);
    const [selectScanner, setSelectScanner] = useState<string[] | SourceDetails[] | undefined>(undefined);
    // const [indexScanner, setIndexScanner] = useState<number | undefined>(undefined);
    // const [redioValue, setRedioValue] = useState<string | undefined>(undefined);
    // const [Resolution, setResolution] = useState<number | undefined>(undefined);
    // const [pageScan, setPageScan] = useState<string | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const navigate = useNavigate();

    //Mutate
    const onSuccessCallback = (data: UploadResponseDtoServiceResponse) => {
        swalSuccess("อัพโหลดไฟล์สําเร็จ", data.message ?? "").then(() => {
            // const encodedDocId = btoa(String(data.data?.documentId));
            navigate(`/document/${String(data.data?.documentId)}/preview`);
            dispatch(resetToDefault());
            // handleClose();
        });
    };

    const onErrorCallback = (error: string) => {
        swalError("Error", error);
    };

    const { mutate } = useDocumentCreate(onSuccessCallback, onErrorCallback);
    const { data } = useDocumentByIdGet_OnLoad(String(documentId), isEnabled);

    const updateFile = useDocumentFileUpload(String(documentId), onSuccessCallback, onErrorCallback);

    // const handleClose = () => {
    //     isSetOpenDialog(false);
    //     setIsDisabled(false);
    // };
    //#region handle
    // const handleChangeSourceScanner = (valuesTarget: number | undefined) => {
    //     setIndexScanner(valuesTarget);
    // };

    // const handleChangeRadio = (valueTarget: string) => {
    //     setRedioValue(valueTarget);
    // };

    // const handleChangeResolution = (valueTarget: number | undefined) => {
    //     setResolution(valueTarget);
    // };

    // const handleChangePageRadio = (valuesTarget: string | undefined) => {
    //     setPageScan(valuesTarget);
    // };

    const handleUploadFile = () => {
        //Enum from Dynamsoft 4 === IT_PDF
        const scanImageIndex = Array(DWObject?.HowManyImagesInBuffer);
        console.log(scanImageIndex);
        // @ts-ignore
        //add index
        const fillIndex = scanImageIndex.fill().map((index) => index);
        UploadImage(fillIndex, 4);
    };
    const handleClosePage = () => {
        window.close();
    };

    //#endregion
    //Setting Dynamsoft
    const containerId: string = "dwtcontrolContainer";
    let DWObject: WebTwain | undefined = undefined;
    useEffect(() => {
        Dynamsoft.DWT.ProductKey = VITE_DYNASOFT_KEY;
        Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
        Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", Dynamsoft_OnReady);
        Dynamsoft.DWT.RegisterEvent("OnPostLoad", GetInputSource);
        Dynamsoft.DWT.Containers = [
            {
                WebTwainId: "dwtObject",
                ContainerId: containerId,
                Width: "595px",
                Height: "842px",
            },
        ];
        Dynamsoft.DWT.Load();
    }, []);

    useEffect(() => {
        if (documentId !== undefined) {
            setIsEnabled(true);
        }
    }, [documentId]);

    const Dynamsoft_OnReady = () => {
        // @ts-ignore
        DWObject = Dynamsoft.DWT.GetWebTwain(containerId);
        //GetInputSource();
    };

    const GetInputSource = () => {
        if (DWObject) {
            //it make DWObject To undefined
            setSelectScanner(DWObject.GetSourceNames());
            console.log(selectScanner);
        }
    };

    //Test click button
    // const handleScan = () => {
    //     if (DWObject) {
    //         switch (redioValue) {
    //             case "BW":
    //                 DWObject.PixelType = Dynamsoft.DWT.EnumDWT_PixelType.TWPT_BW;
    //                 break;
    //             case "Grey":
    //                 DWObject.PixelType = Dynamsoft.DWT.EnumDWT_PixelType.TWPT_GRAY;
    //                 break;
    //             case "Color":
    //                 DWObject.PixelType = Dynamsoft.DWT.EnumDWT_PixelType.TWPT_RGB;
    //                 break;

    //             default:
    //                 break;
    //         }
    //         switch (pageScan) {
    //             case "Duplex":
    //                 DWObject.IfDuplexEnabled = true;
    //                 break;
    //             case "ADF":
    //                 DWObject.IfFeederEnabled = true;
    //                 break;
    //             case "ShowUI":
    //                 DWObject.IfShowUI = true;
    //                 break;

    //             default:
    //                 break;
    //         }
    //         DWObject.Resolution = Number(Resolution);
    //         DWObject.SelectSourceByIndex(indexScanner ?? 0);
    //         DWObject.OpenSource();
    //         DWObject.AcquireImage();
    //     } else {
    //         alert("Fail");
    //     }
    // };

    // const onSuccess = () => {
    //     console.log("Loaded a file successfully!");
    // };
    // const onFailure = (errorString: string) => {
    //     console.log(errorString);
    // };

    // const handleChooseFile = () => {
    //     if (DWObject) {
    //         if (DWObject.HowManyImagesInBuffer === 0) {
    //             DWObject.IfShowFileDialog = true;
    //             // PDF Rasterizer Addon is used here to ensure PDF support
    //             DWObject.Addon.PDF.SetResolution(200);
    //             DWObject.Addon.PDF.SetConvertMode(Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL);
    //             // @ts-ignore
    //             DWObject.LoadImageEx("", Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL, onSuccess, onFailure);
    //         }
    //     } else {
    //         alert(DWObject);
    //     }
    // };
    //#region Dynamsoft
    // DWObject.SelectSourceAsync();
    const acquireImage = () => {
        if (DWObject) {
            // console.log(DWObject.GetSourceNames());
            DWObject.SelectSourceAsync()
                .then(() => {
                    // @ts-ignore
                    return DWObject.AcquireImageAsync({
                        IfDisableSourceAfterAcquire: true,
                        IfGetExtImageInfo: true,
                    });
                })
                .then((result) => {
                    console.log(result);
                    // DWObject?.SaveAllAsPDF("D:\\Test.pdf");
                })
                .catch((exp: Error) => {
                    console.error(exp.message);
                })
                .finally(() => {
                    DWObject?.CloseSourceAsync().catch((e) => {
                        console.error(e);
                    });
                });
        }
    };

    const RotateLeft = () => {
        if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer);
                console.log("RoateLeft");
            }
        }
    };

    const RotateRight = () => {
        if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer);
                console.log("RotateRight");
            }
        }
    };

    const Mirror = () => {
        if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject.Mirror(DWObject.CurrentImageIndexInBuffer);
                console.log("• สลับเอกสารแนวนอน");
            } else {
                console.log("• ไม่พบเอกสาร");
            }
        }
    };

    const Flip = () => {
        if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject.Flip(DWObject.CurrentImageIndexInBuffer);
                console.log("• สลับเอกสารแนวตั้ง");
            } else {
                console.log("• ไม่พบเอกสาร");
            }
        }
    };

    // const PrevImage = () => {
    //     if (DWObject) {
    //         if (DWObject.HowManyImagesInBuffer > 0) {
    //             DWObject.CurrentImageIndexInBuffer = DWObject.CurrentImageIndexInBuffer - 1;
    //         }
    //     }
    //     if (DWObject) {
    //         if (DWObject.HowManyImagesInBuffer > 0) {
    //             console.log("• ก่อนหน้านี้");
    //         } else {
    //             console.log("• ไม่พบเอกสาร");
    //         }
    //     }
    // };

    // const NextImage = () => {
    //     if (DWObject) {
    //         if (DWObject.HowManyImagesInBuffer > 0) {
    //             DWObject.CurrentImageIndexInBuffer = DWObject.CurrentImageIndexInBuffer + 1;
    //         }
    //     }
    //     if (DWObject) {
    //         if (DWObject.HowManyImagesInBuffer > 0) {
    //             console.log("• หน้าถัดไป");
    //         } else {
    //             console.log("• ไม่พบเอกสาร");
    //         }
    //     }
    // };
    //#endregion

    // ToDo File upload Ajax
    const UploadImage = (indices: number[], type: number) => {
        if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject?.ConvertToBlob(
                    indices,
                    type,
                    // use mutate
                    async (result, _indices) => {
                        //sent result on useMutate
                        //make payload and sent
                        const Digital = new Date();
                        const Year = Digital.getFullYear();
                        const Month = Digital.getMonth() + 1;
                        const uploadfilename =
                            "DOC" +
                            Year +
                            Month +
                            Digital.getDate() +
                            Digital.getHours() +
                            Digital.getMinutes() +
                            Digital.getSeconds() +
                            Digital.getMilliseconds() +
                            ".pdf";
                        const fileUploadpayload = {
                            data: result,
                            fileName: uploadfilename,
                        };
                        const payload = {
                            documentCode:
                                data?.data?.documentCode !== "" && data?.data?.documentCode !== undefined
                                    ? data?.data?.documentCode
                                    : documentCode,
                            documentId:
                                data?.data?.documentId !== undefined ? data?.data?.documentId : documentId ?? "",
                            documentSubTypeId: documentSubTypeId,
                            mainIndex: mainIndex,
                            searchIndex: searchIndex,
                            documentIndexId: indexId?.map(Number),
                            documentIndexValue: indexValue,
                            fileUploads: [fileUploadpayload],
                        };
                        //ToDo
                        setIsDisabled(true);

                        if (data?.data?.documentId !== undefined) {
                            const payloadUpdateFile = {
                                document: [fileUploadpayload],
                            };
                            updateFile.mutate(payloadUpdateFile);
                        } else {
                            mutate(payload);
                        }

                        // mutate(payload);
                    },
                    (errorCode, errorMessage) => {
                        console.log("Code:", errorCode, "Message:", errorMessage);
                    }
                );
            }
        } else {
            swalWarning("", "กรุณาสแกนเอกสาร");
        }
    };

    return (
        // <Dialog fullScreen open={isOpenDialog} fullWidth onClose={handleClose}>
        //     <DialogTitle id="responsive-dialog-title">{"สแกนไฟล์เอกสาร"}</DialogTitle>
        //     <DialogContent>
        //         <DialogContentText>
        <Grid container spacing={0.5} direction={"column"} justifyContent={"left"} sx={{ p: "5px" }}>
            <CustomGrid item xs={12} sm={2} md={1.2}>
                {/* {JSON.stringify(DWObject === undefined ? "Fail" : "haveObject")} */}
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                        acquireImage();
                    }}
                    sx={{ mt: breakPoints ? "1%" : "0%" }}
                >
                    Select Scanner
                </Button>
                &nbsp;
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                        RotateLeft();
                    }}
                    sx={{ mt: breakPoints ? "1%" : "0%" }}
                >
                    หมุนซ้าย
                </Button>
                &nbsp;
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                        RotateRight();
                    }}
                    sx={{ mt: breakPoints ? "1%" : "0%" }}
                >
                    หมุนขวา
                </Button>
                &nbsp;
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                        Flip();
                    }}
                    sx={{ mt: breakPoints ? "1%" : "0%" }}
                >
                    สลับเอกสารแนวตั้ง
                </Button>
                &nbsp;
                <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                        Mirror();
                    }}
                    sx={{ mt: breakPoints ? "1%" : "0%" }}
                >
                    สลับเอกสารแนวนอน
                </Button>
            </CustomGrid>
            <Grid item xs={12} sm={6} md={6}>
                <Grid container spacing={0.5} direction={"row"} justifyContent={"start"} alignItems={"start"}>
                    <Grid item xs={12} sm={6} md={6}>
                        <div id={containerId}></div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Grid container spacing={0.5} direction={"row"} justifyContent={"start"} alignItems={"start"}>
                            <Grid item xs={12}>
                                <Button
                                    autoFocus
                                    color="primary"
                                    onClick={handleUploadFile}
                                    disabled={isDisabled}
                                    sx={{
                                        width: "15%",
                                        bottom: 10,
                                        right: "2%",
                                        marginLeft: -100,
                                        position: "absolute",
                                    }}
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
                                <Button
                                    onClick={handleClosePage}
                                    color="error"
                                    sx={{
                                        width: "15%",
                                        bottom: 10,
                                        right: "18%",
                                        marginLeft: 5,
                                        position: "absolute",
                                    }}
                                >
                                    ยกเลิก
                                </Button>
                            </Grid>

                            {/* <Grid item xs={12}>
                                            <Select
                                                onChange={(event) => {
                                                    console.log("value:", event.target?.value);
                                                    handleChangeSourceScanner(Number(event.target?.value));
                                                }}
                                                sx={{ width: "45%" }}
                                            >
                                                {selectScanner?.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={index}>
                                                            {item}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </Grid> */}
                            <Grid item xs={12} sm={6} md={6}>
                                {/* <Grid item xs={12}>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="BW"
                                                    name="rbg-scanType"
                                                    onChange={(e) => {
                                                        handleChangeRadio(e.target?.value);
                                                    }}
                                                >
                                                    <FormControlLabel value="BW" control={<Radio />} label="ขาว-ดำ" />
                                                    <FormControlLabel value="Grey" control={<Radio />} label="เทา" />
                                                    <FormControlLabel value="Color" control={<Radio />} label="สี" />
                                                </RadioGroup>
                                            </Grid> */}
                                {/* <Grid item xs={12}>
                                                <Select
                                                    name="Resolution"
                                                    onChange={(e) => {
                                                        // console.log(e.target?.value);
                                                        handleChangeResolution(Number(e.target?.value));
                                                    }}
                                                    sx={{ width: "50%" }}
                                                    defaultValue={100}
                                                >
                                                    <MenuItem value={100}>100</MenuItem>
                                                    <MenuItem value={150}>150</MenuItem>
                                                    <MenuItem value={200}>200</MenuItem>
                                                    <MenuItem value={300}>300</MenuItem>
                                                </Select>
                                            </Grid> */}

                                {/* <Grid item xs={12}>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="Duplex"
                                                    name="rbg-pageScan"
                                                    onChange={(e) => {
                                                        handleChangePageRadio(e.target?.value);
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="Duplex"
                                                        control={<Radio />}
                                                        label="หน้า-หลัง"
                                                    />
                                                    <FormControlLabel
                                                        value="ADF"
                                                        control={<Radio />}
                                                        label="ต่อเนื่อง"
                                                    />
                                                    <FormControlLabel
                                                        value="ShowUI"
                                                        control={<Radio />}
                                                        label="เครื่องมือ"
                                                    />
                                                </RadioGroup>
                                            </Grid> */}
                                {/* <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    onClick={handleScan}
                                                    sx={{ width: "40%" }}
                                                >
                                                    สแกนเอกสาร
                                                </Button>
                                            </Grid> */}
                                {/* <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    onClick={() => {
                                                        handleChooseFile();
                                                    }}
                                                    sx={{ width: "40%" }}
                                                >
                                                    ChooseFile
                                                </Button>
                                            </Grid> */}
                                {/* <Button onClick={handleClose} color="error">
                                    ยกเลิก
                                </Button> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        //     </DialogContentText>
        // </DialogContent>
        // <DialogActions>
        // <Button onClick={handleClose} color="error">
        //     ยกเลิก
        // </Button>
        // <Button autoFocus color="primary" onClick={handleUploadFile} disabled={isDisabled}>
        //     {isDisabled && (
        //         <CircularProgress
        //             size={20}
        //             sx={{
        //                 color: "#FFFFFF",
        //             }}
        //         />
        //     )}{" "}
        //     {isDisabled !== true && <Typography> บันทึก</Typography>}
        // </Button>
        //     {/* </DialogActions>
        // </Dialog> */}
    );
};

export default DocumentScanFileDialog;
