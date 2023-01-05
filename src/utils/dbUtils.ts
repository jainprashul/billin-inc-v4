import { importDB, exportDB } from "dexie-export-import";
import { saveAs } from "file-saver";
import db from '../services/database/db';
import Dexie from 'dexie';
import JSZip from "jszip";


export async function exportDatabase(db: Dexie) {
    const blob = await exportDB(db, {
        progressCallback: (progress) => {
            console.log("Progress: ", progress);
            return false;
        }
    });
    return blob;
}

export const generateBackupFile = async () => {

    const DBBLob = await exportDatabase(db);
    const companyDbs = Object.values(db.companyDB);

    let blobs : Blob[] = [];
    for (let i = 0; i < companyDbs.length; i++) {
        const companyDB = companyDbs[i];
        const companyDBBlob = await exportDatabase(companyDB);
        blobs.push(companyDBBlob);
    }

    const zip = new JSZip();
    zip.file("db.json", DBBLob);
    for (let i = 0; i < companyDbs.length; i++) {
        const companyDB = companyDbs[i];
        zip.file(`${companyDB.name}.json`, blobs[i]);
    }
    const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    return zipBlob;
}

/** Export and Saves A DB Backup File */
export const exportData = async () => {
    try {
        const zipBlob = await generateBackupFile();

        let time = new Date().toISOString().split('T')[0];
        saveAs(zipBlob, `db-backup-${time}.dbx`)
        console.log('Backup taken successfully');
    } catch (error) {
        console.error(error);
    }
}

/** Import and Saves A DB Backup File */
export const importData = async (file: File, online=false) => {
    console.log('Importing Data', file);
    await importDatabase(file, online);
}

async function importDatabase(file: File, online: boolean) {
    try {
        const zip = await JSZip.loadAsync(file, {
            base64: online,
        });
        await deleteDatabase();

        // loop through all files and import
        for (const fileName in zip.files) {
            const file = zip.files[fileName];
            const dbJson = await file.async("string");
            const dbName = fileName.split('.')[0];
            console.log(`Importing ${dbName}...`);

            const dbBlob = new Blob([dbJson], { type: "application/json" });
            await importDB(dbBlob);
        }

        console.log('Data Imported Successfully');
    } catch (error) {
        console.error(error);
    }
}


/** Delete DB */
export const deleteData = async () => {
    await deleteDatabase();
    console.log('Database Deleted Successfully');
}

async function deleteDatabase() {
    try {
        // Delete all company DBs
        const companyDbs = Object.values(db.companyDB);
        for (let i = 0; i < companyDbs.length; i++) {
            const companyDB = companyDbs[i];
            await companyDB.delete();
        }
        // Delete main DB
        await db.delete();
        console.log('Database Deleted Successfully');
    } catch (error) {
        console.error(error);
    }
}


/** 
 * Clear all cache data from app and unregister service worker
*/
export async function clearALLCache() {
    try {
        if (navigator.onLine) {
            if ('serviceWorker' in navigator) {
                await navigator.serviceWorker.getRegistrations().then(function (registrations) {
                    for (let registration of registrations) {
                        registration.unregister();
                    }
                });
            }
            if (window.caches) {
                await window.caches.keys().then(function (cacheNames) {
                    return Promise.all(cacheNames.map(function (cacheName) {
                        return window.caches.delete(cacheName);
                    }));
                });
            }
            return true;
        } else {
            console.log('No internet connection');
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}
