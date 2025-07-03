import { Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { FormikTextField, swalWarning } from "../../_common";
import { useDocumentIndexGet } from "../documentApi";
import { documentSelector, resetToDefault, setIndexValues } from "../documentSlice";

const DocumentIndexTextField = () => {
    //Call Redux
    const dispatch = useAppDispatch();
    const { documentSubTypeId } = useAppSelector(documentSelector);
    //Get data from api
    const { data } = useDocumentIndexGet(Number(documentSubTypeId));
    const navigate = useNavigate();
    //declare formikData
    const formikData: any = {};

    //bind data to formikData
    data?.data?.forEach((item) => {
        if (item.documentIndexId) {
            formikData[item.documentIndexId] = "";
        }
    });

    const formik = useFormik<any>({
        enableReinitialize: true,
        initialValues: formikData,
        onSubmit: (values) => {
            console.log(Object.values(values)[0]);
            const indexValues = Object.values(values).filter((item) => {
                return item;
            }) as string[];
            const indexId = indexValues.map((item, index) => {
                if (item) {
                    return Object.keys(values)[index];
                }
            });
            console.log("IndexId", indexValues);
            const payload = {
                indexId: Object.values(indexId) as string[],
                indexValue: indexValues as string[],
                mainIndex: (Object.values(values)[0] as string) ?? "",
                searchIndex: Object.values(values)
                    .map((item) => item)
                    .join(" "),
            };
            console.log(payload);
            if (documentSubTypeId !== 0 && documentSubTypeId !== undefined) {
                if (payload.mainIndex !== "" && payload.searchIndex !== "") {
                    dispatch(setIndexValues(payload));

                    navigate("/document/scan");
                } else {
                    swalWarning("Warning", "กรุณากรอกข้อมูลเอกสาร");
                }
            } else {
                swalWarning("Warning", "กรุณาเลือกประเภทย่อยเอกสาร");
            }
        },
    });

    useEffect(() => {
        dispatch(resetToDefault());
    }, []);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1} direction={"column"} justifyContent={"center"} sx={{ p: "10px" }}>
                <Grid item xs={12} sm={6} md={6}>
                    {/* <pre>{JSON.stringify(formik.values ?? "", null, 2)}</pre> */}
                    {/* loop show text field in len of object from api */}
                    {data?.data?.map((item, index) => {
                        return (
                            <FormikTextField
                                name={`${item.documentIndexId}`}
                                label={`${item.documentIndexName}`}
                                formik={formik}
                                key={index}
                                required={item.isRequried}
                            />
                        );
                    })}
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Grid container direction={"row"} justifyContent={"flex-end"} alignItems={"flex-end"}>
                        <Grid item xs={12} sm={2} style={{ textAlign: "right" }}>
                            <Button color={"primary"} variant={"contained"} type="submit" fullWidth>
                                บันทึก
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default DocumentIndexTextField;
