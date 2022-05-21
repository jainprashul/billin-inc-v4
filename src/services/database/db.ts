import AppDB from ".";

const db = new AppDB();

// listeners for the database
db.on("populate", () => {
    console.log("Database populated");
});

db.on("ready", (dexie) => {
    console.log("Database ready", dexie);
});


// listeners for the database tables USERS
db.users.hook("creating", (id, user, trans) => {

});

db.users.hook('deleting', (id, user, trans) => {
    console.log('hook del', trans.active)
    db.transaction('rw', db.companies, (tx) => {
        db.companies.where('id').anyOf([...user.companyIDs]).modify((company) => {
            let index = company.userIDs.indexOf(user.id as number)
            if (index > -1) {
                company.userIDs.splice(index, 1);
                console.log('index deleted', index);
            }
        });
    })
})




export default db;