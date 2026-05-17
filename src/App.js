import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Game from "./pages/Game";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import BetHistory from "./pages/BetHistory";
import Profile from "./pages/Profile";
import Vip from "./pages/Vip";
import DepositHistory from "./pages/DepositHistory";
import WithdrawHistory from "./pages/WithdrawHistory";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";

export default function App() {

  const [user, setUser] = useState(
    localStorage.getItem("user")
  );

  // LISTEN STORAGE CHANGE
  useEffect(() => {

    const checkAuth = () => {
      setUser(localStorage.getItem("user"));
    };

    window.addEventListener("storage", checkAuth);

    // CUSTOM EVENT
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };

  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* GAME */}
        <Route
          path="/game"
          element={user ? <Game /> : <Navigate to="/login" />}
        />

        {/* PRIVACY */}
        <Route
          path="/privacy"
          element={user ? <Privacy /> : <Navigate to="/login" />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* VIP */}
        <Route
          path="/vip"
          element={user ? <Vip /> : <Navigate to="/login" />}
        />

        {/* DEPOSIT */}
        <Route
          path="/deposit"
          element={user ? <Deposit /> : <Navigate to="/login" />}
        />

        {/* DEPOSIT HISTORY */}
        <Route
          path="/deposit-history"
          element={user ? <DepositHistory /> : <Navigate to="/login" />}
        />

        {/* WITHDRAW */}
        <Route
          path="/withdraw"
          element={user ? <Withdraw /> : <Navigate to="/login" />}
        />

        {/* WITHDRAW HISTORY */}
        <Route
          path="/withdraw-history"
          element={user ? <WithdrawHistory /> : <Navigate to="/login" />}
        />

        {/* BET HISTORY */}
        <Route
          path="/bet-history"
          element={user ? <BetHistory /> : <Navigate to="/login" />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

      </Routes>
    </BrowserRouter>
  );
}