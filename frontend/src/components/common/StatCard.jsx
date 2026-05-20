const StatCard = ({ title, value }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>

      <h1 style={styles.value}>{value}</h1>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minWidth: "220px",
  },

  title: {
    color: "#6b7280",
    marginBottom: "10px",
  },

  value: {
    fontSize: "32px",
    fontWeight: "bold",
  },
};

export default StatCard;