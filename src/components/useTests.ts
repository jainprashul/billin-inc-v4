import faker from "@faker-js/faker";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../services/database/db";
import { Company, User } from "../services/database/model";

export const useTests = () => {
    const data = useLiveQuery(async () => {
        return {
            users: await db.users.toArray(),
            companies: await db.companies.toArray(),
            companyDB : await db.companyDB
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

    return {
        createUser,
        createCompany,
        data
    }
}