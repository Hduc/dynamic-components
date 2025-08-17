import { Check } from "@mui/icons-material";
import { formatMoney } from "src/commons/helpers/common";
import { formatDateString } from "src/commons/helpers/convert-date-to-string";

export const formatCell = (value: any, formart?: string) => {
    const columnType = formart?.toUpperCase() || "TEXT";
    switch (columnType) {
        case "DATE":
            return formatDateString(value, "dd/MM/yyyy");
        case "DATETIME":
            return formatDateString(value, "dd/MM/yyyy hh:mm");
        case "CURRENCY":
            return formatMoney(value);
        case "NUMBER":
            const inVal = parseInt(value);
            return new Intl.NumberFormat("vi-VN").format(inVal);
        case "BOOLEAN":
            return value == "1" || value == "true" ? (
                <Check color="primary" />
            ) : (
                ""
            );
        case "LINK":
            return (
                <div
                    style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                    <a
                        style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                        }}
                    >
                        {value}
                    </a>
                </div>
            );
        case "SELECT":
            return <div>{value}</div>;
        default:
            return value;
    }
}