import { useMediaQuery, useTheme } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import db from "../services/database/db";
import { useCompanyDB } from "./useCompanyDB";

export const useDataUtils = () => {
  const dispatch = useAppDispatch();
  const { company, companyDB, companyID, setCompanyID } = useCompanyDB()
  const backups = useLiveQuery(async () => {
    return db.backups.toArray();
  })!;

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const toast = useSnackbar();

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  async function getAccountDetails() {
    const accountID = company?.bankAccountID
    if (!accountID) return
    const account = await companyDB?.bankAccounts.get(accountID)
    return account?.toJSON() 
  }

  return {
    company, companyDB, companyID, setCompanyID,
    navigate,
    location,
    params,
    toast,
    backups,
    getAccountDetails,
    isMobile,
    dispatch
  }
}