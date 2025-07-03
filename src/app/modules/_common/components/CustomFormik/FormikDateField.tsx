import { DateField, DateFieldProps } from "@mui/x-date-pickers/DateField";
import { Dayjs } from "dayjs";
import { FormikMuiXDateTimeProps, MUIDateTimeThProvider } from ".";

export type FormikDateFieldProps = FormikMuiXDateTimeProps & DateFieldProps<Dayjs>;

const FormikDateField = ({
    name,
    label,
    formik,
    useThaiLanguage = true,
    useBuddhistEra = true,
    ...other
}: FormikDateFieldProps) => {
    const { value, error } = formik.getFieldMeta<Dayjs>(name);
    const { setFieldValue, setFieldTouched } = formik;

    const handleDateChange = (date: Dayjs | null) => setFieldValue(name, date);

    const handleBlur = () => setFieldTouched(name, true, false);

    return (
        <MUIDateTimeThProvider useThaiLanguage={useThaiLanguage} useBuddhistEra={useBuddhistEra}>
            <DateField
                {...other}
                value={value}
                label={label}
                onBlur={handleBlur}
                onChange={handleDateChange}
                slotProps={{
                    textField: {
                        helperText: error,
                        error: !!error,
                        FormHelperTextProps: {
                            style: {
                                position: "absolute",
                                top: "2.5rem",
                            },
                        },
                    },
                }}
            />
        </MUIDateTimeThProvider>
    );
};

export default FormikDateField;
