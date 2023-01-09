import { useLiveQuery } from 'dexie-react-hooks';
import React, {} from 'react'
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
    setCompanyID: (id: number) => {},
    company: defaultCompany
});

export const useCompanyDB = () => React.useContext(CompanyDBContext);


export const CompanyDBProvider = ({ children }: { children: React.ReactNode }) => {
    const [ companyID , setCompanyID ] = useLocalStorage("companyID", 1);
    // const [companyDB, setCompanyDB] = React.useState<CompanyDB | null>(null);

    const company = useLiveQuery( async ()=> {
        return db.companies.get(companyID);
    }, [companyID])!

    const companyDB = React.useMemo(() => {
        let dataBase = db.getCompanyDB(companyID);
        db.on('ready', () => {
            setTimeout(() => {
                dataBase = db.getCompanyDB(companyID);
            }, 500);
        });
        return dataBase;
    }, [companyID]);

        

    // useEffect(() => {
    //     db.on('ready', () => {
    //       setTimeout(() => {
    //         setCompanyDB(db.getCompanyDB(companyID));
    //       }, 500);
    //     });
    //   }, [companyID]);

    const Context = {
        companyDB,
        companyID , setCompanyID,
        company
    }




    return (
        <CompanyDBContext.Provider value={Context}>
            {children}
        </CompanyDBContext.Provider>
    );
};
