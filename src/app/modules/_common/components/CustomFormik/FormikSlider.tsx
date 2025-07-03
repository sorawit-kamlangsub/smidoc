import { FormControl, SliderProps, FormLabel, Slider, FormHelperText } from "@mui/material";
import { FormikProps } from "formik";

type FormikSliderProps = {
    name: string;
    label: string;
    formik: FormikProps<any>;
} & SliderProps;

const FormikSlider = ({ name, label, formik, ...sliderProps }: FormikSliderProps) => {
    const { value, touched, error, initialValue } = formik.getFieldMeta<number | undefined>(name);
    const { setFieldValue, setFieldTouched } = formik;

    return (
        <FormControl
            fullWidth
            component="fieldset"
            error={touched && !!error}
            color={sliderProps.color}
            disabled={sliderProps.disabled}
        >
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <Slider
                id={`${name}-formik-slider`}
                name={name}
                onBlur={() => setFieldTouched(name, true, true)}
                onChange={(_, value) => setFieldValue(name, value, true)}
                value={value ?? 0}
                defaultValue={initialValue ?? 0}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="on"
                {...sliderProps}
            />
            {error && touched && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default FormikSlider;
