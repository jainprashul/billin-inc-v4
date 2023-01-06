
import GSTSettings from './GST/GSTSettings';
import BackupSettings from './BackupRestore/BackupSettings';
import CreateTab, { Panel } from '../../components/shared/CreateTab';
import Auth from './Auth/Auth';
import UserAccounts from './User/UserAccounts';
import authService from '../../services/authentication/auth.service';
import About from './About';

type Props = {}

const panels : Panel[] = [
    {
        name: "GST Settings",
        content: () => (
            <GSTSettings />
        )
    },
    {
        name: "Backup & Restore",
        content: () => (
            <BackupSettings />
        )
    },
    {
        name: "Users",
        content: () => (
            <UserAccounts />
        ),
        hidden: authService.getUser()?.roleID !== 1
    },
    {
        name: "Authentication",
        content: () => (
            <Auth />
        )
    }, 
    {
        name: "About",
        content: () => (
            <About/>
        )
    }
]

const Setting = (props: Props) => {

    const params = new URLSearchParams(window.location.search)
    const tabIndex = panels.indexOf(panels.find(panel => panel.name.toLowerCase() === params.get("tab")) ?? panels[0])
    return (
        <div id="setting" className="setting">
            <CreateTab panels={panels} tabIndex={tabIndex}/>
        </div>
    )
}

export default Setting