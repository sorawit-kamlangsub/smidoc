import FormikTextMask, { FormikTextMaskProps } from "./FormikTextMask";

type FormikTextMaskCardIdProps = {
    value?: string;
    defaultValue?: string;
} & Omit<FormikTextMaskProps, "value" | "defaultValue" | "format" | "patternChar" | "inputMode">;

const FormikTextMaskCardId = ({ ...props }: FormikTextMaskCardIdProps) => {
    const { name, formik } = props;
    const { setFieldValue } = formik;

    return (
        <FormikTextMask
            inputMode="numeric"
            format="%-%%%%-%%%%%-%%-%"
            allowEmptyFormatting
            patternChar="%"
            mask="_"
            onValueChange={(values) => {
                setFieldValue(name, values.value);
            }}
            {...props}
        />
    );
};

export default FormikTextMaskCardId;
