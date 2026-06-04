import { useState, useEffect } from "react";
import { account } from "../../appwrite/appwrite";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();

        if (user) {
          setUser(user);
          navigate("/");
        }
      } catch (error) {
        console.log("No active session");
      }
    };

    checkSession();
  }, [navigate, setUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // If already logged in, skip creating session
      try {
        const existingUser = await account.get();

        if (existingUser) {
          setUser(existingUser);
          navigate("/");
          return;
        }
      } catch {
        // No session exists, continue login
      }

      await account.createEmailPasswordSession(
        formData.email,
        formData.password
      );

      const currentUser = await account.get();

      setUser(currentUser);

      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h1>LIC Agent Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;