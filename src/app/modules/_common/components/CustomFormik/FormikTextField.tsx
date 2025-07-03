import { TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";

export type FormikTextFieldProps = {
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
     * formik ที่ต้องการใช้
     */
    formik: FormikProps<any>;
} & Omit<TextFieldProps, "name" | "label" | "value" | "error" | "helperText" | "variant">;

/**
 * `FormikTextField` เป็น Component ที่ใช้เป็นส่วนขยายจาก `TextField` ของ MUI
 *
 * หากใส่ `formik` จะเชื่อมต่อกับ Formik ให้อัตโนมัติ โดยไม่ต้องเขียน `onChange`, `error`, `helperText` และ `value` ใหม่
 *
 * หากใช้ formik แต่ต้องการเขียน props ข้างต้นเอง สามารถส่ง props เข้ามาทับได้
 *
 * ## การใช้งานขั้นสูง
 *
 * เพื่อให้เข้าใจการทำงาน ควรอ่านเนื้อหาต่างๆ ดังต่อไปนี้
 * -   [TextField](https://material-ui.com/components/text-fields/)
 * -   [Formik](https://jaredpalmer.com/formik/docs/api/formik)
 *
 * ## การใช้งาน
 *
 * ```jsx
 * const formik = useFormik({..})
 *
 * return <FormikTextField name="firstname" label="Firstname" formik={formik} />;
 * ```
 *
 * API:
 *
 * - [TextField API](https://mui.com/material-ui/api/text-field/)
 */
const FormikTextField = ({ name, formik, ...textFieldProps }: FormikTextFieldProps) => {
    const { value, error, touched } = formik.getFieldMeta<string>(name);
    const { handleChange, handleBlur } = formik;

    return (
        <TextField
            id={`${name}-formik-textfield`}
            name={name}
            value={value}
            variant="outlined"
            error={!!error && !!touched}
            helperText={touched && error}
            onChange={handleChange}
            onBlur={handleBlur}
            {...textFieldProps}
        />
    );
};

FormikTextField.defaultProps = {
    fullWidth: true,
};

export default FormikTextField;
