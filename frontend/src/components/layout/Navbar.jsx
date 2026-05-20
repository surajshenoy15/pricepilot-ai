const Navbar = () => {
  return (
    <div style={styles.navbar}>
      <h2>PricePilot AI</h2>

      <div>Welcome User</div>
    </div>
  );
};

const styles = {
  navbar: {
    height: "70px",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #ddd",
  },
};

export default Navbar;