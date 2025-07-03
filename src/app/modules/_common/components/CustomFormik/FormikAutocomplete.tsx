import { Autocomplete, CircularProgress, FormControl, FormControlProps, TextField } from "@mui/material";
import { FormikProps } from "formik";

export type FormikAutocompleteProps = {
    name: string;
    label?: string;
    labelColor?: FormControlProps["color"];
    data?: { [key: string]: any }[];
    isLoading?: boolean;
    valueFieldName?: string;
    displayFieldName?: string;
    formik: FormikProps<any>;
    selectedCallback?: (value: any) => void;
    firstItemText?: string;
    disableFirstItem?: boolean;
    filterSelectedOptions?: boolean;
} & FormControlProps;

const FormikAutocomplete = ({
    name,
    label,
    labelColor,
    data,
    isLoading = false,
    valueFieldName = "id",
    displayFieldName = "name",
    formik,
    selectedCallback,
    filterSelectedOptions,
    ...formControlProps
}: FormikAutocompleteProps) => {
    const { touched, value, error, initialValue } = formik.getFieldMeta<string | number | undefined>(name);
    const { setFieldValue, setFieldTouched } = formik;

    const handleChange = (_event: any, newValue: { [key: string]: any }) => {
        if (!newValue) {
            setFieldValue(name, initialValue, true);
            setFieldValue(`${name}_selectedText`, undefined, true);
            selectedCallback && selectedCallback(undefined);

            return;
        }

        setFieldValue(name, newValue[valueFieldName], true);
        setFieldValue(`${name}_selectedText`, newValue[displayFieldName] ?? undefined, true);
        selectedCallback && selectedCallback(newValue[valueFieldName]);
    };

    return (
        <FormControl
            fullWidth
            error={touched && !!error}
            onBlur={() => setFieldTouched(name, true, true)}
            {...formControlProps}
        >
            <Autocomplete
                id={`${name}-formik-autocomplete`}
                filterSelectedOptions={filterSelectedOptions}
                options={data ?? []}
                getOptionLabel={(option) => option[displayFieldName]}
                value={value ? data?.find((item) => item[valueFieldName] == value) : null}
                onChange={handleChange}
                isOptionEqualToValue={(option, value) => option[valueFieldName] === value[valueFieldName]}
                onBlur={() => setFieldTouched(name, true, true)}
                color={formControlProps.color}
                renderInput={(params) => (
                    <TextField
                        label={label}
                        color={formControlProps.color}
                        placeholder={formControlProps.placeholder}
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: isLoading ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : (
                                params.InputProps.endAdornment
                            ),
                        }}
                    />
                )}
            />
        </FormControl>
    );
};

export default FormikAutocomplete;
