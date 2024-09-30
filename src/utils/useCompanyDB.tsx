import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect } from 'react'
import { useLocalStorage } from '.';
import CompanyDB from '../services/database/companydb';
import db from '../services/database/db';
import { Company } from '../services/database/model';
import { defaultCompany } from '../services/database/model/Company';

const CompanyDBContext = React.createContext<{
    companyDB: CompanyDB | null;
    companyID: number;
    setCompanyID: (id: number) => void;
    company: Company
}>({
    companyDB: null,
    companyID: 1,
    setCompanyID: (id: number) => { },
    company: defaultCompany
});

export const useCompanyDB = () => React.useContext(CompanyDBContext);


export const CompanyDBProvider = ({ children }: { children: React.ReactNode }) => {
    const [companyID, setCompanyID] = useLocalStorage("companyID", 1);
    const [companyDB, setCompanyDB] = React.useState<CompanyDB | null>(null);

    const company = useLiveQuery(async () => {
        // get the company keys from the database 
        const keys = await db.companies.toCollection().keys();
        // check the company keys if it includes the companyID
        let id = keys.includes(companyID) ? companyID : Number(keys[0]);
        if (!id) return;
        return db.companies.get(id);
    }, [companyID])!

    useEffect(() => {
        db.on('ready', () => {
            setTimeout(async () => {
                // get the company keys from the database 
                const keys = await db.companies.toCollection().keys();
                // check the company keys if it includes the companyID
                let id = keys.includes(companyID) ? companyID : Number(keys[0]);
                if (!id) return;
                setCompanyDB(db.getCompanyDB(id));
            }, 900);
        });
    }, [companyID]);

    const Context = {
        companyDB,
        companyID, setCompanyID,
        company
    }




    return (
        <CompanyDBContext.Provider value={Context}>
            {children}
        </CompanyDBContext.Provider>
    );
};
