import { useLiveQuery } from "dexie-react-hooks";
import { useSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import db from "../services/database/db";
import { Company } from "../services/database/model";

export const useDataUtils = () => {

    const company = useLiveQuery( async ()=> {
        return db.companies.get(1);
    }) as Company;

    const navigate = useNavigate();

    const toast = useSnackbar();


    return {
        company,
        navigate,
        toast,
    }
}