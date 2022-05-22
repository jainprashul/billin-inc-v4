import faker from "@faker-js/faker";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../services/database/db";
import { Company, User } from "../services/database/model";
import { Invoices } from "../services/database/model/Invoices";

export const useTests = () => {
    const data = useLiveQuery(async () => {
        return {
            users: await db.users.toArray(),
            companies: await db.companies.toArray(),
            companyDB: db.companyDB,
            invoices: await db.companyDB["Company_1"].invoices.toArray(),
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
        const inv = new Invoices({
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

    return {
        createUser,
        createCompany,
        createInvoice,
        data
    }
}