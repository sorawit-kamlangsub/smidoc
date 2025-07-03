import { FormControl, FormControlLabel, FormControlLabelProps, FormHelperText, Rating } from "@mui/material";
import { FormikProps } from "formik";

export type FormikRatingProps = Omit<FormControlLabelProps, "control"> & {
    name: string;
    label: string;
    formik: FormikProps<any>;
    disabled?: boolean;
};
export const FormikRating = ({ name, label, formik, ...formControlLabelProps }: FormikRatingProps) => {
    const { value, touched, error } = formik.getFieldMeta<number | undefined>(name);
    const { setFieldValue, setFieldTouched } = formik;

    return (
        <FormControl
            id={`${name}-formik-rating-container`}
            onBlur={() => setFieldTouched(name, true, true)}
            disabled={formControlLabelProps.disabled}
        >
            <FormControlLabel
                control={
                    <Rating
                        id={`${name}-formik-rating`}
                        name={name}
                        onChange={(_event, value) => setFieldValue(name, value, true)}
                        value={value ?? 0}
                    />
                }
                label={label}
                {...formControlLabelProps}
            />
            {error && touched && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default FormikRating;
