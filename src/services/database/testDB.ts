import db from ".";
import { AdminRole, User, UserRole } from "./model/User";
import { ICompany, IUser } from "./model";
import { faker } from '@faker-js/faker';

const company1: ICompany = {
    id: 1,
    name: "Company 1",
    address: {
        id: 1,
        address: "Address 1",
        city: "City 1",
        state: "State 1"
    },
    contacts: [
        {
            id: 1,
            name: "Contact 1",
            email: "Contact1@exmaple.com",
            phone: "1234567890",
            mobile: "1234567890"
        }
    ],
    gst: "GST 1",
    email: "company1@example.com",
    configID: 1,
    lastBackupID: "1234",
    lastBackupName: "Backup 1",
    lastGSTInvoiceNo: 1,
    lastInvoiceNo: 1,
    userIDs: [1, 2],
}


const AdminUser: IUser = {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    roleID: 1,
    password: faker.internet.password(8),
    companyIDs: [1]
}

export const defaultUser: IUser = {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    roleID: 2,
    password: faker.internet.password(8),
    companyIDs: [1]
}

 export const testDB = () => {
    // let user = new User(defaultUser);
    // user.save();
    // db.companies.put(company1);
    // db.users.bulkPut([new User(AdminUser), new User(defaultUser)]);
    // db.roles.bulkPut([AdminRole, UserRole]);
}



