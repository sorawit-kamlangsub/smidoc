import { OutlinedTextFieldProps, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { PatternFormat, PatternFormatProps } from "react-number-format";

export type FormikTextMaskProps = {
    name: string;
    label: string;
    formik: FormikProps<any>;
    value?: any;
    defaultValue?: any;
    variant?: "outlined";
} & PatternFormatProps<Omit<OutlinedTextFieldProps, "value" | "defaultValue" | "type" | "variant">>;

const FormikTextMask = ({
    name,
    formik,
    label,
    inputMode,
    valueIsNumericString = true,
    ...props
}: FormikTextMaskProps) => {
    const { value, error, touched, initialValue } = formik.getFieldMeta<any>(name);
    const { handleChange, handleBlur } = formik;

    const textFieldProps: PatternFormatProps<
        Omit<OutlinedTextFieldProps, "value" | "defaultValue" | "type" | "variant">
    > = props;

    const patternFormatProps: Omit<FormikTextMaskProps, "formik"> = {
        ...textFieldProps,
        id: `${name}-formik-textmask`,
        variant: "outlined",
        name: name,
        value: value,
        onChange: textFieldProps.onValueChange ? undefined : handleChange,
        onBlur: handleBlur,
        error: !!error && !!touched,
        helperText: touched && error,
        label: label,
        defaultValue: initialValue,
    };

    return (
        <PatternFormat value={value} customInput={TextField} inputMode={inputMode} {...patternFormatProps} {...props} />
    );
};

export default FormikTextMask;
