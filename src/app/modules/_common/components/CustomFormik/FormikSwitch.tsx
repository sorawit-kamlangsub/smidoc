import { FormControlLabel, FormControlLabelProps, FormHelperText, Switch, SwitchProps } from "@mui/material";
import { FormikProps } from "formik";

type FormikSwitchProps = {
    name: string;
    label: string;
    formik: FormikProps<any>;
} & SwitchProps &
    Omit<FormControlLabelProps, "control">;

const FormikSwitch = ({ name, label, formik, ...props }: FormikSwitchProps) => {
    const { value, touched, error } = formik.getFieldMeta<boolean | undefined>(name);
    const { setFieldValue, setFieldTouched } = formik;

    const switchProps: SwitchProps = props;
    const formControlLabelProps: Omit<FormControlLabelProps, "control" | "label"> = props;

    return (
        <>
            <FormControlLabel
                id={`${name}-formik-switch-container`}
                {...formControlLabelProps}
                control={
                    <Switch
                        id={`${name}-formik-switch`}
                        name={name}
                        onBlur={() => setFieldTouched(name, true, true)}
                        onChange={(_, value) => setFieldValue(name, value, true)}
                        checked={value}
                        {...switchProps}
                    />
                }
                label={label}
            />
            {error && touched && <FormHelperText>{error}</FormHelperText>}
        </>
    );
};

export default FormikSwitch;
