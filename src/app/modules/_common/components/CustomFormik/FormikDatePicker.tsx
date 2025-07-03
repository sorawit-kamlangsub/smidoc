import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FormikMuiXDateTimeProps, MUIDateTimeThProvider } from ".";
import { Dayjs } from "dayjs";

type FormikDatePickerProps = FormikMuiXDateTimeProps & DatePickerProps<Dayjs>;

const FormikDatePicker = ({
    name,
    label,
    formik,
    useThaiLanguage = true,
    useBuddhistEra = true,
    ...other
}: FormikDatePickerProps) => {
    const { value, error } = formik.getFieldMeta<Dayjs>(name);
    const { setFieldValue, setFieldTouched } = formik;

    const handleDateChange = (date: Dayjs | null) => setFieldValue(name, date);

    const handleBlur = () => setFieldTouched(name, true, true);

    return (
        <MUIDateTimeThProvider useThaiLanguage={useThaiLanguage} useBuddhistEra={useBuddhistEra}>
            <DatePicker
                {...other}
                value={value}
                label={label}
                onChange={handleDateChange}
                onClose={handleBlur}
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

export default FormikDatePicker;
