import { OutlinedTextFieldProps, TextField } from "@mui/material";
import { FormikProps } from "formik";
import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CustomNumberProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export type FormikTextNumberProps = {
    name: string;
    label: string;
    formik: FormikProps<any>;
    value?: number;
    defaultValue?: number;
    variant?: "outlined";
} & NumericFormatProps &
    Omit<OutlinedTextFieldProps, "value" | "defaultValue" | "type" | "variant">;

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomNumberProps>(
    function NumericFormatCustom(props, ref) {
        const { name, onChange, ...other } = props;

        return (
            <NumericFormat
                inputMode="numeric"
                allowLeadingZeros={false}
                valueIsNumericString
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: name,
                            value: values.value,
                        },
                    });
                }}
            />
        );
    }
);

const FormikTextNumber = ({
    name,
    formik,
    label,
    thousandSeparator = true,
    valueIsNumericString = true,
    ...props
}: FormikTextNumberProps) => {
    const { value, error, touched, initialValue } = formik.getFieldMeta<number | undefined>(name);
    const { setFieldValue, handleBlur } = formik;

    const textFieldProps: Omit<OutlinedTextFieldProps, "value" | "defaultValue" | "type" | "variant"> = props;

    const numericCustomFormatProps: Omit<NumericFormatProps, "onChange"> = props;
    numericCustomFormatProps.thousandSeparator = thousandSeparator;
    numericCustomFormatProps.valueIsNumericString = valueIsNumericString;

    return (
        <TextField
            id={`${name}-formik-textnumber`}
            variant={"outlined"}
            {...textFieldProps}
            name={name}
            onChange={(e) => setFieldValue(name, Number(e.target.value))}
            onBlur={handleBlur}
            value={value || ""}
            error={!!error && !!touched}
            helperText={touched && error}
            label={label}
            defaultValue={initialValue}
            InputProps={{
                inputComponent: NumericFormatCustom as any,
                inputProps: numericCustomFormatProps as any,
                inputRef: props.inputRef,
            }}
            inputProps={{
                inputMode: "numeric",
            }}
        />
    );
};

export default FormikTextNumber;
