import { Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch } from "../../../../redux";
import { FormikDropdown, FormikTextField } from "../../_common";
import { useDocumentSubTypeGet, useDocumentTypeGet } from "../documentApi";
import { setDocumentSearch } from "../documentSlice";

type DocumentSearchForm = {
    documentSubTypeId?: number | undefined;
    documentSubType_selectedText?: string[];
    documentTypeId?: number | undefined;
    documentType_selectedText?: string[];
    searchText?: string;
};

const DocumentSearch = () => {
    const dispatch = useAppDispatch();

    const defaultValue: DocumentSearchForm = {
        documentSubTypeId: -1,
        documentTypeId: -1,
        searchText: "",
    };

    const formik = useFormik<DocumentSearchForm>({
        enableReinitialize: true,
        initialValues: defaultValue,
        onSubmit: (values) => {
            //onSubmitDemo(formik, values)

            const payload = {
                documentSubTypeId: values.documentSubTypeId === -1 ? undefined : values.documentSubTypeId,
                documentTypeId: values.documentTypeId === -1 ? undefined : values.documentTypeId,
                searchText: values.searchText === "" ? undefined : values.searchText,
            };

            dispatch(setDocumentSearch(payload));
        },
        validate: () => {
            // const errors: FormikErrors<DocumentSearchForm> = {};
            // if (!values.favoriteFoodByCategory) {
            //     errors.favoriteFoodByCategory = "Required";
            // }
            //return errors;
        },
    });

    const { data, isLoading } = useDocumentTypeGet();

    const { data: dataDocumentSubType, isLoading: isLoadingDocumentSubType } = useDocumentSubTypeGet(
        formik.values.documentTypeId === -1 ? undefined : formik.values.documentTypeId
    );

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container direction={"row"} spacing={1} style={{ padding: "5px" }}>
                {/* <Grid item xs={12}>
                    {JSON.stringify(formik.initialValues)}
                </Grid> */}
                <Grid item sm={3} xs={12}>
                    <FormikDropdown
                        fullWidth
                        name="documentTypeId"
                        data={data?.data ?? []}
                        label="ประเภทเอกสาร"
                        formik={formik}
                        valueFieldName="documentTypeId"
                        displayFieldName="documentTypeName"
                        selectedCallback={() => formik.setFieldValue("documentSubTypeId", undefined, true)}
                        firstItemText="ทั้งหมด"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item sm={3} xs={12}>
                    <FormikDropdown
                        fullWidth
                        name="documentSubTypeId"
                        data={dataDocumentSubType?.data ?? []}
                        label="ประเภทย่อยเอกสาร"
                        formik={formik}
                        valueFieldName="documentSubTypeId"
                        displayFieldName="documentSubTypeName"
                        isLoading={isLoadingDocumentSubType}
                        firstItemText="ทั้งหมด"
                    />
                </Grid>
                <Grid item sm={4} xs={12}>
                    <FormikTextField name="searchText" formik={formik} label="ค้นหา" />
                </Grid>
                <Grid item sm={2} xs={12} style={{ marginTop: "12px" }}>
                    <Button variant="contained" style={{ width: "100%" }} type="submit">
                        ค้นหา
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default DocumentSearch;
