import { useLiveQuery } from "dexie-react-hooks";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from ".";
import CompanyDB from "../services/database/companydb";
import db from "../services/database/db";
import { Company } from "../services/database/model";

export const useDataUtils = () => {

    const [ companyID , setCompanyID ] = useLocalStorage("companyID", 1);

    const [companyDB, setCompanyDB] = React.useState<CompanyDB | null>(null);
  
    useEffect(() => {
      db.on('ready', () => {
        setTimeout(() => {
          setCompanyDB(db.getCompanyDB(companyID));
        }, 200);
      });
    }, [companyID]);

    const company = useLiveQuery( async ()=> {
        return db.companies.get(companyID);
    }) as Company;

    const navigate = useNavigate();
    const location  = useLocation();
    const params = useParams();

    const toast = useSnackbar();


    return {
        company, companyID, setCompanyID,
        companyDB,
        navigate,
        location,
        params,
        toast,
    }
}