import faker from "@faker-js/faker";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../services/database/db";
import { Client, Company, Ledger, NotificationLog, Purchase, User } from "../services/database/model";
import { Invoice } from "../services/database/model/Invoices";

export const useTests = () => {
    const data = useLiveQuery(async () => {
        return {
            users: await db.users.toArray(),
            companies: await db.companies.toArray(),
            companyDB: db.companyDB,
            invoices: await db.companyDB["Company_1"]?.invoices.toArray(),
            purchases : await db.companyDB["Company_1"]?.purchases.toArray(),
            clients: await db.companyDB["Company_1"]?.clients.toArray(),
            notifications : await db.companyDB["Company_1"]?.notificationlogs.toArray(),
        }
    });

    const createUser = () => {
        const user = new User({
            name: faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            roleID: 2,
            password: faker.internet.password(8),
            companyIDs: [1]
        });
        console.log(user);

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
            lastGSTInvoiceNo: 1,
            lastInvoiceNo: 1,
            userIDs: []
        })
        return company.save();
    }

    const createInvoice = () => {
        const inv = new Invoice({
            companyID: 1,
            voucherNo: `inv_${faker.random.number()}`,
            voucherType: 'NON_GST',
            clientID: 1,
            productIDs: [1, 2, 3],
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
            clientID: 1,
            productIDs: [1, 2, 3],
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
            clientID: 1,
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
            clientID: 1,
            message: faker.lorem.paragraph(),
            date: new Date(),
            notificationID: 'ntf_'+ faker.random.number(),
            status: 'NEW',
            link: '/test',
        });

        return notification.save();
    }
            


    return {
        createUser,
        createCompany,
        createInvoice,
        createPurchase,
        createClient,
        createLedger,
        createNotification,
        data
    }
}