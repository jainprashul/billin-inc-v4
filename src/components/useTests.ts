import faker from "@faker-js/faker";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../services/database/db";
import { Client, Company, Expense, Ledger, NotificationLog, Product, Purchase, Stock, StockLog, User } from "../services/database/model";
import { Invoice } from "../services/database/model/Invoices";
// import { StockLog } from "../services/database/model/StockLogs";
// import { Stock } from "../services/database/model/Stocks";

export const useTests = () => {
    const data = useLiveQuery(async () => {
        return {
            users: (await db.users.toArray()).map(user => { user.loadRole(); return user; }),
            companies: await db.companies.toArray(),
            companyDB: db.companyDB,
            // invoices: await db.companyDB[Object.keys(db.companyDB)[0]]?.invoices.toArray(),
            invoices: (await db.companyDB[Object.keys(db.companyDB)[0]]?.invoices.toArray())?.map(invoice => {
                invoice.loadProducts();
                return invoice;
            }),
            // purchases : await db.companyDB[Object.keys(db.companyDB)[0]]?.purchases.toArray(),
            purchases: await (await db.companyDB[Object.keys(db.companyDB)[0]]?.purchases.toArray())?.map(purchase => {
                purchase.loadProducts();
                return purchase;
            }),
            clients: await db.companyDB[Object.keys(db.companyDB)[0]]?.clients.toArray(),
            notifications: await db.companyDB[Object.keys(db.companyDB)[0]]?.notificationlogs.orderBy("date").filter((x) => x.isVisible).reverse().toArray(),
            stocks: (await db.companyDB[Object.keys(db.companyDB)[0]]?.stocks.toArray())?.map(stock => {
                stock.loadStockLogs(); return stock;
            }),
            stockLogs: await db.companyDB[Object.keys(db.companyDB)[0]]?.stocklogs.toArray(),
            products: await db.companyDB[Object.keys(db.companyDB)[0]]?.products.toArray(),
            ledgers: await db.companyDB[Object.keys(db.companyDB)[0]]?.ledger.toArray(),
            expenses: await db.companyDB[Object.keys(db.companyDB)[0]]?.expenses.toArray(),
        }
    });
    // console.log(data?.purchases);


    const createUser = () => {
        const user = new User({
            name: faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            roleID: 2,
            password: faker.internet.password(8),
            companyIDs: [1]
        });
        user.save();
    }

    const createCompany = () => {
        const company = new Company({
            name: faker.company.companyName(),
            address: {
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
            },
            contacts: [
                {
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    phone: faker.phone.phoneNumber(),
                }
            ],
            gst: 'DGSH',
            lastGSTInvoiceNo: 0,
            lastInvoiceNo: 0,
            userIDs: new Set([]),
        })
        return company.save();
    }

    const createInvoice = () => {
        const inv = new Invoice({
            companyID: 1,
            voucherNo: `inv_${faker.random.number()}`,
            voucherType: 'NON_GST',
            clientID: 'c_1',
            productIDs: new Set([]),
            billingDate: new Date(),
            categoryID: 1,
            gstEnabled: false,
            gstTotal: 0,
            subTotal: faker.random.number({ min: 1000, max: 10000 }),
            discount: true,
            discountValue: faker.random.number({ min: 0, max: 500 }),
        })

        return inv.save();
    }

    const createPurchase = () => {
        const purchase = new Purchase({
            companyID: 1,
            voucherNo: `pur_${faker.random.number()}`,
            voucherType: 'NON_GST',
            clientID: 'c_1',
            productIDs: new Set([]),
            billingDate: new Date(),
            categoryID: 1,
            gstEnabled: false,
            gstTotal: 0,
            subTotal: faker.random.number({ min: 1000, max: 10000 }),
            discount: true,
            discountValue: faker.random.number({ min: 0, max: 500 }),
        });
        return purchase.save();
    }

    const createClient = () => {
        const client = new Client({
            name: faker.name.findName(),
            companyID: 1,
            details: faker.lorem.paragraph(),
            gst: 'DGSH',
            address: {
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
            },
            contacts: [
                {
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    phone: faker.phone.phoneNumber(),
                }
            ],
        });
        return client.save();
    }

    const createLedger = () => {
        const ledger = new Ledger({
            companyID: 1,
            voucherNo: `inv_${faker.random.number()}`,
            voucherType: 'SALES',
            clientID: 'c_1',
            cash: faker.random.number({ min: 1000, max: 10000 }),
            credit: faker.random.number({ min: 1000, max: 10000 }),
            debit: faker.random.number({ min: 1000, max: 10000 }),
            payable: faker.random.number({ min: 1000, max: 10000 }),
            receivable: faker.random.number({ min: 1000, max: 10000 }),
            clientType: "CUSTOMER",
            date: new Date(),
            payableType: "CASH",
            receivableType: "CASH",
        });
        return ledger.save();
    }

    const createNotification = () => {
        const notification = new NotificationLog({
            companyID: 1,
            clientID: 'c_1',
            message: faker.lorem.paragraph(),
            date: new Date(),
            notificationID: 'ntf_' + faker.random.number(),
            status: 'NEW',
            link: '/test',
        });

        return notification.save();
    }

    const createExpense = () => {
        const expense = new Expense({
            companyID: 1,
            amount: faker.random.number({ min: 1000, max: 10000 }),
            date: new Date(),
            description: faker.lorem.paragraph(),
            expenseType: 'ELECTRICITY',
        })
        return expense.save();
    }

    const createProduct = (voucherID: string) => {
        const product = new Product({
            companyID: 1,
            name: faker.commerce.productName(),
            gstRate: 12,
            categoryID: 1,
            hsn: `hsn_${faker.random.number()}`,
            price: faker.random.number({ min: 1000, max: 10000 }),
            quantity: faker.random.number({ min: 1, max: 100 }),
            unit: 'KG',
            voucherID,
        })
        return product.save();
    }

    const createStock = () => {
        const stock = new Stock({
            companyID: 1,
            gstRate: 12,
            logIDs: new Set([]),
            name: faker.commerce.productName(),
            quantity: faker.random.number({ min: 1, max: 100 }),
            purchasePrice: faker.random.number({ min: 1000, max: 10000 }),
            salesPrice: faker.random.number({ min: 1000, max: 10000 }),
            stockValue: faker.random.number({ min: 1000, max: 10000 }),
            unit: 'KG',
            hsn: `hsn_${faker.random.number()}`,
        })
        return stock.save();
    }

    const createStockLog = () => {
        const stockLog = new StockLog({
            companyID: 1,
            amount: faker.random.number({ min: 1000, max: 10000 }),
            clientID: 'c_1',
            clientName: faker.name.findName(),
            date: new Date(),
            logType: 'PURCHASE',
            quantity: faker.random.number({ min: 1, max: 100 }),
            rate: faker.random.number({ min: 1000, max: 10000 }),
            stockID: `stk_2HrNWu42`,
            voucherNo: `pur_${faker.random.number()}`,
        })
        return stockLog.save();
    }



    return {
        createUser,
        createCompany,
        createInvoice,
        createPurchase,
        createClient,
        createLedger,
        createNotification,
        createExpense,
        createProduct,
        createStock,
        createStockLog,
        data
    }
}