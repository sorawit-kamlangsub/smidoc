import FormikTextMask, { FormikTextMaskProps } from "./FormikTextMask";

type FormikTextMaskPhoneProps = {
    value?: string;
    defaultValue?: string;
} & Omit<FormikTextMaskProps, "value" | "defaultValue" | "format" | "patternChar" | "inputMode">;

const FormikTextMaskPhone = ({ name, formik, ...textMaskProps }: FormikTextMaskPhoneProps) => {
    const { setFieldValue } = formik;

    return (
        <FormikTextMask
            name={name}
            formik={formik}
            {...textMaskProps}
            inputMode="numeric"
            format="###-###-####"
            allowEmptyFormatting
            onValueChange={(values) => {
                setFieldValue(name, values.value);
            }}
        />
    );
};

export default FormikTextMaskPhone;
