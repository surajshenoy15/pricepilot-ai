import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>PricePilot</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">
          Dashboard
        </Link>

        <Link style={styles.link} to="/products">
          Products
        </Link>

        <Link style={styles.link} to="/recommendations">
          Recommendations
        </Link>

        <Link style={styles.link} to="/reports">
          Reports
        </Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    minHeight: "100vh",
    backgroundColor: "#111827",
    color: "white",
    padding: "20px",
  },

  logo: {
    marginBottom: "40px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
};

export default Sidebar;