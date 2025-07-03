import {
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    FormControlProps,
    SelectChangeEvent,
} from "@mui/material";
import { FormikProps } from "formik";

export type FormikDropdownProps = {
    /**
     * ชื่อของ field ที่ต้องการใช้ (จำเป็นต้องใช้)
     *
     * ชื่อ field จะตรงกับ key ของ values ของ formik
     */
    name: string;

    /**
     * ป้ายกำกับที่ต้องการใช้
     */
    label: string;

    /**
     * ข้อมูลที่ต้องการใช้ในการสร้าง checkbox
     * ตัวอย่าง : `[{ id: 0, name: "Do not forget to set data" }]`
     **/
    data?: { [key: string]: any }[];
    isLoading?: boolean;

    /**
     * formik ที่ต้องการใช้
     */
    formik: FormikProps<any>;

    /**
     * ชื่อ key ของ data ที่ต้องการใช้เป็นค่า value
     *
     * default : `id`
     */
    valueFieldName?: string;

    /**
     * ชื่อ key ของ data ที่ต้องการใช้เป็นค่าแสดงผล
     *
     * default : `name`
     */
    displayFieldName?: string;
    selectedCallback?: (value: any) => void;
    firstItemText?: string;
    disableFirstItem?: boolean;
    disabledItemValue?: any[];
} & Omit<FormControlProps, "name" | "label" | "value" | "onChange" | "onBlur" | "input">;

const FormikDropdown = ({
    name,
    label,
    data,
    formik,
    valueFieldName = "id",
    displayFieldName = "name",
    selectedCallback,
    firstItemText,
    disableFirstItem = false,
    disabledItemValue,
    isLoading = false,
    ...formcontrolProps
}: FormikDropdownProps) => {
    const { value, touched, error } = formik.getFieldMeta<number | string>(name);
    const { setFieldValue, handleBlur } = formik;

    const handleOnChange = (event: SelectChangeEvent<string | number | undefined>) => {
        const setValue = event.target.value === "-1" ? undefined : event.target.value;
        setFieldValue(name, setValue, true);
        setFieldValue(
            `${name}_selectedText`,
            data?.find((item) => item[valueFieldName] === setValue)?.[displayFieldName] ?? undefined,
            true
        );
        selectedCallback && selectedCallback(setValue ?? undefined);
    };

    return (
        <FormControl {...formcontrolProps} error={touched && !!error} id={`${name}-formik-select`}>
            <InputLabel>{label}</InputLabel>
            <Select
                name={name}
                label={label}
                value={value ?? (firstItemText ? "-1" : null)}
                defaultValue={firstItemText ? "-1" : undefined}
                color={formcontrolProps.color}
                onChange={handleOnChange}
                onBlur={handleBlur}
                type="number"
                startAdornment={isLoading ? <CircularProgress color="inherit" size={20} /> : null}
            >
                {firstItemText && (
                    <MenuItem disabled={disableFirstItem} value={"-1"} color={formcontrolProps.color}>
                        <em>{firstItemText}</em>
                    </MenuItem>
                )}
                {data &&
                    data.map((item) => (
                        <MenuItem
                            color={formcontrolProps.color}
                            key={`${name}-${item[valueFieldName]}`}
                            value={item[valueFieldName]}
                            disabled={disabledItemValue && disabledItemValue.includes(item[valueFieldName])}
                        >
                            {item[displayFieldName]}
                        </MenuItem>
                    ))}
            </Select>
            {!!error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default FormikDropdown;
