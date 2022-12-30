import DashBoardPage from "./Dashboard";
import { DashboardProvider } from "./useDashboard";

const Dashboard = () => (
    <DashboardProvider>
        <DashBoardPage />
    </DashboardProvider>
)
export default Dashboard