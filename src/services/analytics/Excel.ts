import { AddWorksheetOptions, Workbook , Column, Worksheet} from 'exceljs'

type ExcelColumn = Partial<Column>
export type {
    ExcelColumn
}

export class Excel {
    workbook: Workbook
    constructor() {
        const wb = new Workbook()
        wb.creator = `Billin' Inc`
        wb.created = new Date()
        wb.modified = new Date()
        wb.lastModifiedBy = `Billin' Inc`
        this.workbook = wb

    }

    addSheet(name: string, option?: Partial<AddWorksheetOptions>) {
        const sheet = this.workbook.addWorksheet(name, option)
        return sheet
    }

    get sheetNames()  {
        return this.workbook.worksheets.map(sheet => sheet.name)
    }

    getSheet(name: string) {
        return this.workbook.getWorksheet(name)
    }

    addRow(sheetName: string, row: any[]) {
        const sheet = this.workbook.getWorksheet(sheetName)
        sheet.addRow(row)
    }

    addRows(sheetName: string, rows: any[][]) {
        const sheet = this.workbook.getWorksheet(sheetName)
        sheet.addRows(rows)
    }

    saveAs(fileName=`Report.xlsx`) {
        return this.workbook.xlsx.writeFile(fileName)
    }

    async save(fileName=`Report.xlsx`) {
        const buffer = await this.workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        link.click();
        console.log('file downloaded');
    }      
}


export function styleSheet(sheet : Worksheet){
    const totalCount = sheet.rowCount - 4;
    const totalROw = sheet.getRow(totalCount)
    totalROw.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' },
      bgColor: { argb: 'FF000000' },
    };
    totalROw.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  
    const frontRow = sheet.getRow(1)
    frontRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffaaaaaa' },
      bgColor: { argb: 'ffffffff' },
    };
    frontRow.font = { bold: true };
    frontRow.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
}

