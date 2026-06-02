import { useNavigate } from "react-router-dom";
import "./Home.css";
import { account } from "../../appwrite/appwrite";

function Home({ setUser }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await account.deleteSession("current");

      setUser(null);

      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">LIC Agent Management System</h1>

      <button onClick={logout}  className="logout-btn">Logout</button>

      <div className="card-container">
        <div
          className="home-card"
          onClick={() => navigate("/send")}
        >
          <h2>Send Message</h2>
          <p>Send WhatsApp receipt and generate PDF.</p>
        </div>

        <div
          className="home-card"
          onClick={() => navigate("/customers")}
        >
          <h2>Show Customers</h2>
          <p>View customer payment history and receipts.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;