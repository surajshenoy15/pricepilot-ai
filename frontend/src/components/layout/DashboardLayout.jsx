import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar />

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
  },

  main: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },

  content: {
    padding: "20px",
  },
};

export default DashboardLayout;