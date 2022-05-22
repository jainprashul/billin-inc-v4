import { nanoid } from "@reduxjs/toolkit";
import AppDB from ".";
import CompanyDB from "./companydb";
import { INotificationLog } from "./model";
import { defaultCompany } from "./model/Company";
import { AdminRole, defaultUser, UserRole } from "./model/User";

const db = new AppDB();

// listeners for the database
db.on("populate", () => {
    db.roles.bulkPut([AdminRole, UserRole]);
    // defaultCompany.save();
    defaultUser.save();
    console.log("Database populated");
});

db.on("ready", (dexie) => {
    console.log("Database ready", dexie);
});


// listeners for the database tables USERS
db.users.hook("creating", (id, user, trans) => {

});

db.users.hook('deleting', (id, user, trans) => {
    // console.log('hook del', trans.active)
    db.transaction('rw', db.companies, (tx) => {
        // should delete the user id from the companies when deleted
        db.companies.where('id').anyOf([...user.companyIDs]).modify((company) => {
            let index = company.userIDs.indexOf(user.id as number)
            if (index > -1) {
                company.userIDs.splice(index, 1);
                // console.log('index deleted', index);
            }
        });
    })
})

Object.values(db.companyDB).forEach((companyDB) => {
    companyDB.invoices.hook('creating', (id, invoice, tx) => {
        // console.log('creating invoice', id, invoice, tx)
        // console.log('creating invoice', tx.active)
        const notify : INotificationLog = {
            companyID: invoice.companyID,
            clientID: invoice.clientID,
            date: new Date(),
            message: `Invoice ${invoice.voucherNo} created`,
            notificationID : `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/invoice/${invoice.id}`
        }
        companyDB.notificationlogs.put(notify);
    })
    companyDB.invoices.hook('deleting', (id, invoice, tx) => {
        // console.log('deleting invoice', id, invoice, tx)
        // console.log('deleting invoice', tx.active)
        const notify : INotificationLog = {
            companyID: invoice.companyID,
            clientID: invoice.clientID,
            date: new Date(),
            message: `Invoice ${invoice.voucherNo} deleted`,
            notificationID : `ntf-${nanoid(8)}`,
            status: "NEW",
        }
        companyDB.notificationlogs.put(notify);
            
    })
    companyDB.ledger.hook('creating', (id, ledger, tx) => {
        // console.log('creating ledger', id, ledger, tx)
        // console.log('creating ledger', tx.active)
    })
})


export default db;