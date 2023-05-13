import jsonata from "jsonata";
import moment from "moment";
import CompanyDB from "../database/companydb";
import { Purchase } from "../database/model";
import { Column } from '@material-table/core'
import PlaceOfSupply from "../../constants/PlaceOfSupply";
import { Invoice } from "../database/model/Invoices";
import { Excel, ExcelColumn, styleSheet } from "./Excel";

export interface GSTINFO {
    id: string;
    PartyGST: string;
    PartyName: string;
    PartyAddress: string;
    PartyState: string;
    PartyStateCode: string;

    BillingDate: string | Date;

    InvoiceNo: string;
    InvoiceValue: number;
    TaxableValue: number;
    TotalValue: number;

    ReverseCharge: string;
    PlaceOfSupply: string;
    InvoiceType: string;
    ECommerceGSTIN: string;

    Rate: number | string;
    CGST: number;
    SGST: number;
    IGST: number;
}

async function getGSTPurchases(companyDB: CompanyDB, from: Date, to: Date) {
    console.log('report', from, to);
    const Bills = await companyDB.purchases.where('billingDate').between(from, to).filter(b => b.gstEnabled).toArray();
    const promises = [];
    for (let i = 0; i < Bills.length; i++) {
        promises.push(Bills[i].loadClient());
        promises.push(Bills[i].loadProducts());
    }
    await Promise.all(promises)

    return Bills;
}
async function getGSTSales(companyDB: CompanyDB, from: Date, to: Date) {
    console.log('report', from, to);
    const Bills = await companyDB.invoices.where('billingDate').between(from, to).filter(b => b.gstEnabled).toArray();
    const promises = [];
    for (let i = 0; i < Bills.length; i++) {
        promises.push(Bills[i].loadClient());
        promises.push(Bills[i].loadProducts());
    }
    await Promise.all(promises)

    return Bills;
}


const GST_RATES = [0, 3, 5, 12, 18, 28];

async function generateGSTReportData(data: Purchase[] | Invoice[], excel = false) {
    const gstData: GSTINFO[] = [];
    for (let i = 0; i < data.length; i++) {
        const bill = data[i];
        const discountSplit = bill.discountValue ? Number((bill.discountValue / bill.products.length).toFixed(2)) : 0;

        GST_RATES.forEach(rate => {
            const products = bill.products.filter(p => p.gstRate === rate);
            if (products.length > 0) {
                const invValue = products.reduce((a, b) => a + b.grossAmount, 0) - discountSplit;
                const gstValue = products.reduce((a, b) => a + b.gstAmount, 0);
                const totalValue = invValue + gstValue;

                let [cGST, sGST, iGST] = [0, 0, 0]

                console.log(bill.voucherType);

                // CGST , SGST , IGST
                if (bill.voucherType === 'INTER_STATE') {
                    iGST = gstValue;
                } else {
                    cGST = gstValue / 2;
                    sGST = gstValue / 2;
                }

                const pos = parseInt(bill.client?.gst.substring(0, 2) ?? '0');

                const gstInfo = {
                    id: bill.id + rate,
                    PartyGST: bill.client?.gst || '',
                    PartyName: bill.client?.name || '',
                    PartyAddress: `${bill.client?.address.address || ''} ${bill.client?.address.city || ''} ${bill.client?.address.state || ''}`,
                    PartyState: bill.client?.address.state || '',
                    PartyStateCode: bill.client?.gst.substring(0, 2) || 'XX',

                    BillingDate: excel ? moment(bill.billingDate).format('DD/MM/YYYY') : moment(bill.billingDate).toDate(),
                    InvoiceNo: bill.voucherNo,
                    InvoiceValue: Number(invValue.toFixed(2)),
                    TaxableValue: Number(gstValue.toFixed(2)),
                    TotalValue: Number(totalValue.toFixed(2)),

                    PlaceOfSupply: pos ? PlaceOfSupply[pos] : '',
                    ReverseCharge: 'N',
                    InvoiceType: 'Regular',
                    ECommerceGSTIN: '',

                    Rate: rate,
                    IGST: Number(iGST.toFixed(2)),
                    CGST: Number(cGST.toFixed(2)),
                    SGST: Number(sGST.toFixed(2)),
                }

                gstData.push(gstInfo);
            }
        })
    }
    console.log(gstData);

    const column: Array<Column<GSTINFO>> = [
        { title: 'GSTIN/UIN of Party', field: 'PartyGST', width: 20, },
        { title: 'Party Name', field: 'PartyName', width: 20, },
        { title: 'Party Address', field: 'PartyAddress', width: 20, hidden: true },
        { title: 'State', field: 'PartyState', width: 20, hidden: true },
        { title: 'State Code', field: 'PartyStateCode', width: 20, },

        { title: 'Place Of Supply', field: 'PlaceOfSupply', width: 20, },
        { title: 'Reverse Charge', field: 'ReverseCharge', width: 20, hidden: true },
        { title: 'Invoice Type', field: 'InvoiceType', width: 20, hidden: true },
        { title: 'E-Commerce GSTIN', field: 'ECommerceGSTIN', width: 20, hidden: true },

        { title: 'Invoice Date', field: 'BillingDate', width: 20, type: 'date', },
        { title: 'Invoice Number', field: 'InvoiceNo', width: 20, },
        { title: 'Invoice Value', field: 'InvoiceValue', width: 20, type: 'currency', currencySetting: { currencyCode: 'INR', }, },

        { title: 'Rate', field: 'Rate', width: 20, },
        { title: 'IGST', field: 'IGST', width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
        { title: 'CGST', field: 'CGST', width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
        { title: 'SGST', field: 'SGST', width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },

        { title: 'Taxable Value', field: 'TaxableValue', width: 20, type: 'currency', currencySetting: { currencyCode: 'INR', }, },
        { title: 'Total Value', field: 'TotalValue', width: 20, type: 'currency', currencySetting: { currencyCode: 'INR', } },
    ];

    // For EXCEL TOTALS

    async function getTotals() {
        let total: GSTINFO = {
            id: '',
            PartyGST: '',
            PartyName: '',
            PartyAddress: '',
            PartyState: '',
            PartyStateCode: '',

            BillingDate: '',
            InvoiceNo: '',
            InvoiceValue: await jsonata('$sum(InvoiceValue)').evaluate(gstData) || 0,
            TaxableValue: await jsonata('$sum(TaxableValue)').evaluate(gstData) || 0,
            TotalValue: await jsonata('$sum(TotalValue)').evaluate(gstData) || 0,

            PlaceOfSupply: '',
            ReverseCharge: '',
            InvoiceType: '',
            ECommerceGSTIN: '',

            Rate: 'TOTAL',
            IGST: await jsonata('$sum(IGST)').evaluate(gstData) || 0,
            CGST: await jsonata('$sum(CGST)').evaluate(gstData) || 0,
            SGST: await jsonata('$sum(SGST)').evaluate(gstData) || 0,
        }

        const GSTTotals = GST_RATES.map(async (rate) => {
            const rateData = gstData.filter(g => g.Rate === rate);
            const x: GSTINFO = {
                id: '',
                PartyGST: '',
                PartyName: '',
                PartyAddress: '',
                PartyState: '',
                PartyStateCode: '',

                BillingDate: '',
                InvoiceNo: '',
                InvoiceValue: await jsonata('$sum(InvoiceValue)').evaluate(rateData) || 0,
                TaxableValue: await jsonata('$sum(TaxableValue)').evaluate(rateData) || 0,
                TotalValue: await jsonata('$sum(TotalValue)').evaluate(rateData) || 0,

                PlaceOfSupply: '',
                ReverseCharge: '',
                InvoiceType: '',
                ECommerceGSTIN: '',

                Rate: `@${rate} %`,
                IGST: await jsonata('$sum(IGST)').evaluate(rateData) || 0,
                CGST: await jsonata('$sum(CGST)').evaluate(rateData) || 0,
                SGST: await jsonata('$sum(SGST)').evaluate(rateData) || 0,
            }
            return x;
        })

        return {
            total,
            GSTTotals: await Promise.all(GSTTotals)
        }
    }

    const { total, GSTTotals } = await getTotals();

    return {
        gstData,
        total,
        column,
        GSTTotals
    }
}

export type GSTReportResult = {
    gstData: GSTINFO[];
    total: GSTINFO;
    column: Column<GSTINFO>[];
    GSTTotals: GSTINFO[];
}
export type Adjustments = {
    title: string;
    IGST: number;
    CGST: number;
    SGST: number;
}
export interface OverallAdjustments {
    purchaseReports: {
        data: GSTINFO[];
        column: Column<GSTINFO>[];
    };
    salesReports: {
        data: GSTINFO[];
        column: Column<GSTINFO>[];
    };
    adjustments: {
        data: Adjustments[];
        column: Column<Adjustments>[];
    }
}

async function getAdjustments(companyDB: CompanyDB, from: Date, to: Date){
    const purchase = getGSTPurchases(companyDB, from, to);
    const sales = getGSTSales(companyDB, from, to);
    const [_purchase, _sales] = await Promise.all([purchase, sales]);
    const _purchaseReport = await generateGSTReportData(_purchase);
    const _salesReport = await generateGSTReportData(_sales);
    const [purchaseReport, salesReport] = await Promise.all([_purchaseReport, _salesReport]);
    
    const daysDiff = moment(to).diff(moment(from), 'days') + 1

    console.log('daysDiff', daysDiff, moment(from).subtract(daysDiff, 'days').startOf('day').toDate(), moment(to).subtract(daysDiff, 'days').endOf('day').toDate())
    
    const prev = await companyDB.reports.get({
        from: moment(from).subtract(daysDiff, 'days').startOf('day').toDate(),
        to: moment(to).subtract(daysDiff, 'days').endOf('day').toDate(),
        type : 'ADJUSTMENTS'
    })

    console.log('prev', prev)

    const prevAdjustments = prev?.data as OverallAdjustments

    const adjustments = await calculateAdjustments(purchaseReport, salesReport, prevAdjustments);
    return adjustments
}
// calculate the GST sales and purchase adjustments
async function calculateAdjustments(purchaseReport : GSTReportResult , salesReport : GSTReportResult, prevAdjustments?: OverallAdjustments) {
    console.log('prevAdjustments', prevAdjustments)
    const less = {
        IGST: purchaseReport.total.IGST - salesReport.total.IGST,
        CGST: purchaseReport.total.CGST - salesReport.total.CGST,
        SGST: purchaseReport.total.SGST - salesReport.total.SGST,
    }
    const cross = {
        IGST: prevAdjustments ? prevAdjustments?.adjustments.data[4].IGST : 0,
        CGST: prevAdjustments ? prevAdjustments?.adjustments.data[4].CGST : 0,
        SGST: prevAdjustments ? prevAdjustments?.adjustments.data[4].SGST : 0,
    }

    
    const netPayable = {
        IGST: less.IGST - cross.IGST,
        CGST: less.CGST - cross.CGST,
        SGST: less.SGST - cross.SGST,
    }
    return {
        purchaseReports: {
            data: [
                ...purchaseReport.GSTTotals, purchaseReport.total
            ],
            column: [
                { title: "Input Adjustments", field: "Rate", width: 20, },
                { title: "IGST", field: "IGST", width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
                { title: "CGST", field: "CGST", width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
                { title: "SGST", field: "SGST", width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
            ] as Array<Column<GSTINFO>>
        },
        salesReports: {
            data: [
                ...salesReport.GSTTotals, salesReport.total
            ],
            column: [
                { title: "Output Adjustments", field: "Rate", width: 20, },
                { title: "IGST", field: "IGST", width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
                { title: "CGST", field: "CGST", width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
                { title: "SGST", field: "SGST", width: 20, type: 'currency', currencySetting: { currencyCode: 'INR' } },
            ] as Array<Column<GSTINFO>>
        },
        adjustments: {
            data: [
                {
                    title: "Current ITC",
                    IGST: purchaseReport.total.IGST,
                    CGST: purchaseReport.total.CGST,
                    SGST: purchaseReport.total.SGST,
                }, {
                    title: "Less : Output Tax",
                    IGST: -1 * salesReport.total.IGST,
                    CGST: -1 * salesReport.total.CGST,
                    SGST: -1 * salesReport.total.SGST,
                }, {
                    title: "Less : Adjustments",
                    IGST: -1 * less.IGST,
                    CGST: -1 * less.CGST,
                    SGST: -1 * less.SGST,
                }, {
                    title: "Less : Cross Charge",
                    IGST: -1 * cross.IGST,
                    CGST: -1 * cross.CGST,
                    SGST: -1 * cross.SGST,
                },
                {
                    title: "Net Payable / Receivable (ITC Carried Forward)",
                    IGST: netPayable.IGST,
                    CGST: netPayable.CGST,
                    SGST: netPayable.SGST,
                }
            ] as Adjustments[],
            column: [
                { title: 'GST Payable', field: 'title', cellStyle: { width: 300 } },
                { title: 'IGST', field: 'IGST', type: 'currency', currencySetting: { currencyCode: 'INR' } },
                { title: 'CGST', field: 'CGST', type: 'currency', currencySetting: { currencyCode: 'INR' } },
                { title: 'SGST', field: 'SGST', type: 'currency', currencySetting: { currencyCode: 'INR' } },
            ] as Array<Column<Adjustments>>
        }
    }

}


function ReportToSheet(workBook: Excel, report: GSTReportResult, sheetName: string) {
    // add the sales report sheet
    const sheet = workBook.addSheet(`${sheetName}`, {
        headerFooter: {
            firstFooter: `&L&B&16${sheetName}`,
            oddHeader: `&L&B&16${sheetName}`,
            oddFooter: `&L&B&16${sheetName}`,
        }
    })

    sheet.columns = report.column.map((col) => {
        const column: ExcelColumn = {
            header: col.title as string,
            key: col.field as string,
            width: col.width as number,
        }
        if (col.type === 'currency') {
            column.style = { numFmt: '#,##0.00' }
        }
        return column
    })

    sheet.addRows(report.gstData)
    sheet.addRow(report.total)
    sheet.addRows(report.GSTTotals)

    styleSheet(sheet)

    return sheet
}

async function getReportSheet(companyDB: CompanyDB, from: Date, to: Date){
    const purchase = getGSTPurchases(companyDB, from, to);
    const sales = getGSTSales(companyDB, from, to);
    const [_purchase, _sales] = await Promise.all([purchase, sales]);
    const _purchaseReport = await generateGSTReportData(_purchase);
    const _salesReport = await generateGSTReportData(_sales);
    const [purchaseReport, salesReport] = await Promise.all([_purchaseReport, _salesReport]);

    return generateReportSheet(salesReport, purchaseReport, { from, to });
}

async function generateReportSheet(salesReport: GSTReportResult, purchaseReport: GSTReportResult, date?: {
    from: Date,
    to: Date
}) {

    const reportSheet = new Excel();

    // add the sales report sheet
    ReportToSheet(reportSheet, salesReport, 'Sales Report')

    // add the purchase report sheet
    ReportToSheet(reportSheet, purchaseReport, 'Purchase Report')

    // add the Adjustments 
    const adj = await calculateAdjustments(salesReport, purchaseReport);

    const sheet = reportSheet.addSheet('GST Adjustments');
    sheet.columns = adj.adjustments.column.map((col) => {
        const column: ExcelColumn = {
            header: col.title as string,
            key: col.field as string,
            width: col.width as number,
        }
        return column
    })
    sheet.addRows(adj.adjustments.data);
  
    const sheet2 = reportSheet.addSheet('Output GST Adjustments');
    sheet2.columns = adj.salesReports.column.map((col) => {
        const column: ExcelColumn = {
            header: col.title as string,
            key: col.field as string,
            width: col.width as number,
        }
        return column
    })

    sheet2.addRows(adj.salesReports.data);
  
    const sheet3 = reportSheet.addSheet('Input GST Adjustments');
    sheet3.columns = adj.purchaseReports.column.map((col) => {
        const column: ExcelColumn = {
            header: col.title as string,
            key: col.field as string,
            width: col.width as number,
        }
        return column
    })

    sheet3.addRows(adj.purchaseReports.data);

    // save the report
    const fileName = `GST Report ${date?.from?.toLocaleDateString()}-${date?.to?.toLocaleDateString()}.xlsx`
    await reportSheet.save(fileName)

}
export {
    getGSTPurchases,
    getGSTSales,
    generateGSTReportData,
    calculateAdjustments,
    getAdjustments,
    getReportSheet,
}