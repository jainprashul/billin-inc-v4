import { HOME, INVOICES, INVOICE_CREATE, PROFILE , SETTINGS ,  } from "./routes";
import AddTaskIcon from '@mui/icons-material/AddTask';
import TaskIcon from '@mui/icons-material/Task';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';

type DrawerMenu = {
    name: string
    icon?: any
    route: string
    subMenu?: DrawerMenu[]
}

type UserMenu = {
    name: string
    icon?: any
    route?: string
    subMenu?: UserMenu[]
}

export const NAV_WIDTH = 240;
export const USER_MENU = ['Profile', 'Account', 'Dashboard', 'Logout'];
// export const USER_MENU : UserMenu[] = [
//     {
//         name: 'Profile',
//         route: '/profile',
//     },
//     {
//         name: 'Account',
//         route: '/account',
//     },
//     {
//         name: 'Dashboard',
//         route: '/dashboard',
//     },
// ]

export const DRAWER_MENU : DrawerMenu[] = [
    {
        name: 'Dashboard',
        icon: DashboardIcon,
        route: HOME
    },
    {
        name: "Invoices",
        icon: TaskIcon,
        route: INVOICES
    },
    {
        name: "Create Invoice",
        icon: AddTaskIcon,
        route: INVOICE_CREATE
    },
    {
        name: "Settings",
        icon: SettingsIcon,
        route: '/settings'
    }
]