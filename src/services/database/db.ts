import AppDB from ".";
import CompanyDB from "./companydb";
import { defaultCompany } from "./model/Company";
import { AdminRole, defaultUser, UserRole } from "./model/User";

const db = new AppDB();
export const companyDB = new CompanyDB('Company_1');

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




export default db;