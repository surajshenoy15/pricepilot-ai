import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/common/StatCard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 style={styles.heading}>Dashboard</h1>

      <div style={styles.grid}>
        <StatCard title="Revenue" value="₹2.4L" />

        <StatCard title="Products" value="124" />

        <StatCard title="Recommendations" value="32" />

        <StatCard title="Price Alerts" value="18" />
      </div>
    </DashboardLayout>
  );
};

const styles = {
  heading: {
    marginBottom: "20px",
  },

  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
};

export default Dashboard;