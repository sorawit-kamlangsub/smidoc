import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    RadioProps,
    useTheme,
} from "@mui/material";
import { FormikProps } from "formik";
import { ThemeColorList } from "../../../../layout/theme.d";

export type FormikRadioGroupProps = {
    /**
     * ชื่อของ field ที่ต้องการใช้ (จำเป็นต้องใช้)
     *
     * ชื่อ field จะตรงกับ key ของ values ของ formik
     */
    name: string;

    /**
     * ป้ายกำกับที่ต้องการใช้
     */
    label?: string;

    /**
     * สีของป้ายกำกับ
     */
    labelColor?: ThemeColorList;

    /**
     * ข้อมูลที่ต้องการใช้ในการสร้าง checkbox
     * ตัวอย่าง : `[{ id: 0, name: "Do not forget to set data" }]`
     **/
    data: { [key: string]: any }[];

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

    /**
     * ปรับให้ checkbox แสดงแบบแนวนอน
     *
     * default : `false`
     */
    row?: boolean;

    /**
     * ปรับให้แสดงแบบเต็มความกว้างของ container
     */
    fullwidth?: boolean;
} & Omit<RadioProps, "onChange">;

const FormikRadioGroup = ({
    name,
    label,
    labelColor,
    data,
    valueFieldName = "id",
    displayFieldName = "name",
    formik,
    row = false,
    fullwidth = false,
    id,
    ...radioProps
}: FormikRadioGroupProps) => {
    const theme = useTheme();

    const { value, error, touched } = formik.getFieldMeta<any>(name);
    const { setFieldValue, setFieldTouched } = formik;
    const { required, ...rest } = radioProps;

    const labelColorCode = labelColor ? theme.palette[labelColor].main : undefined;

    const handleChange = (item: { [key: string]: any }) => setFieldValue(name, item[valueFieldName]);
    const handleBlur = () => setFieldTouched(name, true, true);

    return (
        <FormControl
            component="fieldset"
            required={required}
            id={`${name}-formik-radio-group`}
            error={touched && !!error}
            onBlur={handleBlur}
        >
            {label && (
                <FormLabel style={{ color: labelColorCode }} component="legend">
                    {label}
                </FormLabel>
            )}
            <RadioGroup row={row}>
                {data.map((item, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Radio
                                name={name}
                                checked={value === item[valueFieldName]}
                                onChange={() => handleChange(item)}
                                {...rest}
                            />
                        }
                        label={item[`${displayFieldName}`]}
                        value={item[`${valueFieldName}`]}
                    />
                ))}
            </RadioGroup>
            {touched && !!error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default FormikRadioGroup;
