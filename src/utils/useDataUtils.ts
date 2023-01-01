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
  return {
    company, companyDB, companyID, setCompanyID,
    navigate,
    location,
    params,
    toast,
    backups,
    dispatch
  }
}