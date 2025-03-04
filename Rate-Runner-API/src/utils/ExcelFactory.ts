import ExcelJS from "exceljs";

export const exportExcel = async (sheetName: string, header: string[], data: any[][], workbook?: ExcelJS.Workbook) => {

        if(!workbook) {
            workbook = new ExcelJS.Workbook();
        }

        const worksheet = workbook.addWorksheet(sheetName);

        worksheet.insertRow(1, header);

        data.forEach((row: any, index) => {
            worksheet.insertRow(index + 2, row);
        });

        columnWidthOptimize(worksheet);
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).font = { bold: true };

        return workbook;
    }

const columnWidthOptimize = (worksheet: ExcelJS.Worksheet, exceptCol?: number[]) => {
    worksheet.columns.forEach((column, index) => {
        if(exceptCol && exceptCol.find(except => except === index)) {
            column.width = 10;
            return;
        }

        let maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, (cell) => {
                let columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength ) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
    });
}
