import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import BetHistory from "./pages/BetHistory";
import Profile from "./pages/Profile";
import DepositHistory from "./pages/DepositHistory";
import WithdrawHistory from "./pages/WithdrawHistory";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";

export default function App() {
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />

        <Route
          path="/game"
          element={user ? <Game /> : <Navigate to="/login" />}
          
        />
         <Route
          path="/privacy"
          element={user ? <Privacy /> : <Navigate to="/login" />}
          
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
          
        />
        <Route
          path="/deposit"
          element={user ? <Deposit /> : <Navigate to="/login" />}
          
        />
          <Route
          path="/deposit-history"
          element={user ? <DepositHistory /> : <Navigate to="/login" />}
          
        />
          <Route
          path="/withdraw"
          element={user ? <Withdraw /> : <Navigate to="/login" />}
          
        />
         <Route
          path="/withdraw-history"
          element={user ? <WithdrawHistory /> : <Navigate to="/login" />}
          
        />
          <Route
          path="/bet-history"
          element={user ? <BetHistory /> : <Navigate to="/login" />}
          
        />
         <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
          
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}