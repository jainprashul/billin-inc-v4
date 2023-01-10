import { BANK_ACCOUNT, COMPANY, EXPENSES, HOME, INVOICES, INVOICE_CREATE, LEDGER, PURCHASE, PURCHASE_CREATE, REPORTS, SETTINGS, STOCKS, } from "./routes";
import AddTaskIcon from '@mui/icons-material/AddTask';
import TaskIcon from '@mui/icons-material/Task';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import authService from "../services/authentication/auth.service";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
type DrawerMenu = {
    name: string
    icon?: any
    route: string
    subMenu?: DrawerMenu[]
    admin?: boolean
}

// type UserMenu = {
//     name: string
//     icon?: any
//     route?: string
//     subMenu?: UserMenu[]
// }

export const NAV_WIDTH = 240;
export const USER_MENU = [ {
    name: 'Logout',
    action: () => {
        authService.logout();
    }
}];


export const DRAWER_MENU: DrawerMenu[] = [
    {
        name: 'Dashboard',
        icon: DashboardIcon,
        route: HOME
    },
    {
        name: "Invoices",
        icon: TaskIcon,
        route: INVOICES,
        admin: true

    },
    {
        name: "Create Invoice",
        icon: AddTaskIcon,
        route: INVOICE_CREATE
    },
    {
        name: "Purchase Orders",
        icon: TaskIcon,
        route: PURCHASE,
        admin: true
    },
    {
        name: "Purchase Entry",
        icon: AddTaskIcon,
        route: PURCHASE_CREATE
    },
    {
        name: "Ledger",
        icon: AutoStoriesIcon,
        route: LEDGER,
        admin: true
    },
    {
        name: "Stocks & Inventory",
        icon: InventoryIcon,
        route: STOCKS,
    },
    {
        name: "Expenses",
        icon: RequestQuoteIcon,
        route: EXPENSES,
        admin: true
    },
    {
        name: "Reports",
        icon: AssessmentIcon,
        route: REPORTS,
        admin: true
    },
    {
        name: "Bank Accounts",
        icon: AccountBalanceIcon,
        route: BANK_ACCOUNT,
        admin: true
    },
    {
        name: "Companies",
        icon: BusinessIcon,
        route: COMPANY,
    },
    {
        name: "Settings",
        icon: SettingsIcon,
        route: SETTINGS,
    }
]

export const RoutesHasSettings = [
    INVOICE_CREATE, PURCHASE_CREATE
]