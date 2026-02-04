import "./dashboard.css";
import { useAuth } from "../../context/AuthContext";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import users from "../../data/users.json";
import reports from "../../data/reports.json";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
const Dashboard = () => {
  const { user } = useAuth();
  const totalUsers = users.length;
  const totalReports = reports.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;

  const roleCounts = users.reduce(
    (acc, currentUser) => {
      if (currentUser.role === "Admin") acc.admin += 1;
      else acc.user += 1;
      return acc;
    },
    { admin: 0, user: 0 }
  );

  const pieData = [
    { label: "Admin", value: roleCounts.admin, color: "#3b82f6" },
    { label: "User", value: roleCounts.user, color: "#a78bfa" },
  ];

  const months = ["January", "February", "March", "April", "May", "June"];
  const barData = months.map((month) => {
    const monthReports = reports.filter((r) => r.month === month);
    return {
      label: month.slice(0, 3),
      completed: monthReports.filter((r) => r.status === "Completed").length,
      pending: monthReports.filter((r) => r.status === "Pending").length,
    };
  });

  const activities = [
    {
      id: 1,
      action: "Logged in",
      user: user?.name ?? "User",
      time: "10:15 AM",
      status: "Success",
    },
    {
      id: 2,
      action: "Viewed reports",
      user: "Admin",
      time: "11:20 AM",
      status: "Info",
    },
    {
      id: 3,
      action: "Updated profile",
      user: "Admin",
      time: "12:05 PM",
      status: "Success",
    },
    {
      id: 4,
      action: "Created report",
      user: "Admin",
      time: "01:45 PM",
      status: "Pending",
    },
  ];

  return (
    <>
      <div className="title">Dashboard</div>
      <div className="dashboard-container">
        <div className="greeting">
          <AccountCircleOutlinedIcon /> Welcome, {user?.name ?? "User"}!
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Total Users</div>
            <div className="summary-value">{totalUsers}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Reports</div>
            <div className="summary-value">{totalReports}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Active Status</div>
            <div className="summary-value">{activeUsers}</div>
            <div className="summary-sub">Active users</div>
          </div>
        </div>

        <div className="charts-grid">
          <PieChart title="Users by Role" data={pieData} />
          <BarChart title="Reports by Month" data={barData} />
        </div>

        <div className="activities-card">
          <div className="section-title">Recent Activities</div>
          <div className="table-wrap">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item) => (
                  <tr key={item.id}>
                    <td>{item.action}</td>
                    <td>{item.user}</td>
                    <td>{item.time}</td>
                    <td>
                      <span
                        className={`status-pill status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
