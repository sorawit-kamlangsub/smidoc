import { TimePicker, TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

import { FormikMuiXDateTimeProps, MUIDateTimeThProvider } from ".";

type FormikTimePickerProps = FormikMuiXDateTimeProps & TimePickerProps<Dayjs>;

const FormikTimePicker = ({
    name,
    label,
    formik,
    useThaiLanguage = true,
    useBuddhistEra = true,
    ...other
}: FormikTimePickerProps) => {
    const { value, error } = formik.getFieldMeta<Dayjs>(name);
    const { setFieldValue, setFieldTouched } = formik;

    const handleDateChange = (date: Dayjs | null) => setFieldValue(name, date);

    const handleBlur = () => setFieldTouched(name, true, true);

    return (
        <MUIDateTimeThProvider useThaiLanguage={useThaiLanguage} useBuddhistEra={useBuddhistEra}>
            <TimePicker
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

export default FormikTimePicker;
