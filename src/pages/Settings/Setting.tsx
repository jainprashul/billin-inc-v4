
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

    return (
        <div id="setting" className="setting">
            <CreateTab panels={panels}/>
        </div>
    )
}

export default Setting