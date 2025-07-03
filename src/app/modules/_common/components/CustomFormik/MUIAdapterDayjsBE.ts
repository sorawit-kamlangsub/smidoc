import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

export default class MUIAdapterDayjsBE extends AdapterDayjs {
    formatByString = (value: Dayjs, formatString: string) => {
        if (formatString.includes("YY")) {
            formatString = formatString.replace("YYYY", "BBBB").replace("YY", "BB");
        }

        return value.format(formatString);
    };

    setYear = (value: Dayjs, year: number) => {
        if (year > 2200) value = value.set("year", year - 543);
        else value = value.set("year", year);

        return value;
    };
}
