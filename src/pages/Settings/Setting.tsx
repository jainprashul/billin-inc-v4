
import GSTSettings from './GSTSettings';
import BackupSettings from './BackupSettings';
import CreateTab from '../../components/shared/CreateTab';

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