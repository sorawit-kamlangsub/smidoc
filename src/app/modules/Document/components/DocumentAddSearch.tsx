import { Grid } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../redux";
import { FormikDropdown } from "../../_common";
import { useDocumentSubTypeGet, useDocumentTypeGet } from "../documentApi";
import { setSelectTypeValue } from "../documentSlice";

type DocumentAddSearchForm = {
    documentSubTypeId?: number | undefined;
    documentTypeId?: number | undefined;
};

const DocumentAddSearch = () => {
    const dispatch = useAppDispatch();
    const defaultValue: DocumentAddSearchForm = {
        documentSubTypeId: -1,
        documentTypeId: -1,
    };
    const [disable, setDisable] = useState<boolean>(true);

    const handleDisable = () => {
        setDisable(false);
    };

    const formik = useFormik<DocumentAddSearchForm>({
        enableReinitialize: true,
        initialValues: defaultValue,
        onSubmit: () => {
            //onSubmitDemo(formik, values)
        },
        validate: () => {
            // const errors: FormikErrors<DocumentSearchForm> = {};
            // if (!values.favoriteFoodByCategory) {
            //     errors.favoriteFoodByCategory = "Required";
            // }
            //return errors;
        },
    });

    useEffect(() => {
        const payload = {
            documentSubTypeId: formik.values.documentSubTypeId ?? undefined,
            documentTypeId: formik.values?.documentTypeId ?? undefined,
        };
        if (formik.values.documentSubTypeId !== -1) {
            dispatch(setSelectTypeValue(payload));
        }
    }, [formik.values.documentSubTypeId]);

    const { data, isLoading } = useDocumentTypeGet();

    const { data: dataDocumentSubType, isLoading: isLoadingDocumentSubType } = useDocumentSubTypeGet(
        formik.values.documentTypeId === -1 ? undefined : formik.values.documentTypeId
    );

    return (
        <Grid container direction={"row"} spacing={1}>
            <Grid item xs={12} sm={4}>
                <FormikDropdown
                    fullWidth
                    name="documentTypeId"
                    data={data?.data ?? []}
                    label="ประเภทเอกสาร"
                    formik={formik}
                    valueFieldName="documentTypeId"
                    displayFieldName="documentTypeName"
                    selectedCallback={() => {
                        formik.setFieldValue("documentSubTypeId", undefined, true);
                        handleDisable();
                    }}
                    firstItemText="ทั้งหมด"
                    isLoading={isLoading}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormikDropdown
                    fullWidth
                    name="documentSubTypeId"
                    data={dataDocumentSubType?.data ?? []}
                    label="ประเภทย่อยเอกสาร"
                    formik={formik}
                    valueFieldName="documentSubTypeId"
                    displayFieldName="documentSubTypeName"
                    isLoading={isLoadingDocumentSubType}
                    firstItemText="โปรดระบุ"
                    disabled={disable}
                />
            </Grid>
        </Grid>
    );
};

export default DocumentAddSearch;
