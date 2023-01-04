import { getConfig } from "../services/database/db";
import { Backup } from "../services/database/model";
import { generateBackupFile, importData } from "./dbUtils";
import { useGoogle } from "./useGoogle"

export const useGDrive = () => {
    const {gapi, isSignedIn} = useGoogle();

    const uploadBackUpFile = async () => {
        console.log("uploading file");
        const blob = await generateBackupFile();
        const filename = `backup-file-${new Date().toISOString()}.zip`;
        const form = new FormData();
        const metadata = {
            name: filename,
            mimeType: blob.type,
            parents: ['appDataFolder'],
        };

        form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        form.append("data", blob, filename);

        const token = gapi.auth.getToken().access_token;
        // console.log("token", token);

        const response = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            }
        );

        const data = await response.json();

        SaveFileID(data);

        console.log("Resp", data);

        return {
            id: data.id,
            name: data.name,
            date: new Date().toLocaleDateString(),
        }
    }

    const restoreBackUpFile = async (fileId) => {
        if(!fileId){
            let backupFileId = localStorage.getItem("backupFileId");
            if(backupFileId){
                fileId = backupFileId;
            }else{
                throw new Error("No backup file ID found");
            }
        }
        console.log("restoring file", fileId);

        const token = gapi.auth.getToken().access_token;

        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const blob = await response.blob();
        let file = new File([blob], "backup.dbx", { type: blob.type });

        await importData(file);
        console.log("Restored");
    }

    const fileListfromDrive = async () => {
        const token = gapi.auth.getToken().access_token;

        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,createdTime,size)`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        console.log("fileListfromDrive", data);
        return data;
    }

    return {
        uploadBackUpFile, restoreBackUpFile, isSignedIn, fileListfromDrive
    }

}


function SaveFileID(data){

    const opts = {
        id: data.id,
        name : data.name,
        date: new Date(),
    }

    // save the object to the database
    getConfig().then((config) => {
        config.lastBackupID = opts.id;
        config.lastOnlineBackupDate = opts.date;
        config.save();
    });
    
    // save the object to the database
    const backup = new Backup({
        backupID: opts.id,
        name: opts.name,
        date: opts.date,
    });
    backup.save();
}