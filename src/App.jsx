import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { account } from "./appwrite/appwrite";

import Home from "./pages/Home/Home";
import SendMessage from "./pages/SendMessage/SendMessage";
import Login from "./components/Login/Login";
import Customers from "./pages/CustomerList/Customers";
import ProtectedRoute from "./components/ProtectRoute/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setUser={setUser} />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <Home setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/send"
        element={
          <ProtectedRoute user={user}>
            <SendMessage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute user={user}>
            <Customers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;