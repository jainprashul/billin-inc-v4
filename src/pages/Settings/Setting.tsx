
import GSTSettings from './GSTSettings';
import BackupSettings from './BackupSettings';
import CreateTab from '../../components/shared/CreateTab';
import Auth from './Auth';
import UserAccounts from './UserAccounts';
import authService from '../../services/authentication/auth.service';

type Props = {}

const panels = [
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