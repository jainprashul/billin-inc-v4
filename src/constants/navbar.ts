import { COMPANY, HOME, INVOICES, INVOICE_CREATE, LEDGER, PURCHASE, PURCHASE_CREATE, SETTINGS, STOCKS, } from "./routes";
import AddTaskIcon from '@mui/icons-material/AddTask';
import TaskIcon from '@mui/icons-material/Task';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import authService from "../services/authentication/auth.service";

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