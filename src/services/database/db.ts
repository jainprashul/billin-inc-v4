import { nanoid } from "@reduxjs/toolkit";
import Dexie from "dexie";
import AppDB from ".";
import CompanyDB from "./companydb";
import { INotificationLog, NotificationLog } from "./model";

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
    db.loadCompanyDBs().then(() => {
        console.log("Database ready", db);
        subscribeCompany();
    });
});


// listeners for the database tables USERS
db.users.hook("creating", (id, user, trans) => {

});
db.companies.hook("creating", (id, company, trans) => {
    //  console.log(company)
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

function subscribeCompany() {
    // console.log('subscribeCompany', db.companyDB);
    Object.values(db.companyDB).forEach((companyDB) => {
        companyDB.open().catch((err) => {
            console.log('error opening db', err);
        });

        companyDB.on('ready', () => {
            console.log('companyDB ready', companyDB.name);
        });

        // companyDB.ledger.hook('creating', (id, ledger, tx) => {
        //     // console.log('creating ledger', tx.active)
        // })

        // companyDB.invoices.hook('creating', (id, invoice, tx) => {
        //     console.log('creating invoice', id, invoice, tx)
        //     console.log('creating invoice', tx.active)
        //     const notify = new NotificationLog({
        //         companyID: invoice.companyID,
        //         clientID: invoice.clientID,
        //         date: new Date(),
        //         message: `Invoice ${invoice.voucherNo} created`,
        //         notificationID: `ntf-${nanoid(8)}`,
        //         status: "NEW",
        //         link: `/invoice/${invoice.id}`
        //     })
        //     notify.save();
        //     console.log('notify', notify)
        // })


    })
}


export default db;