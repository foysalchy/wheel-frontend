import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "https://api.luckynumber.fun/api/auth/login",
        {
          username,
          password,
        }
      );

      // SAVE AUTH DATA
    localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));

window.dispatchEvent(new Event("authChange"));

      // SMALL DELAY ENSURES STORAGE IS READY
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 100);

    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07101b] text-white flex items-center justify-center px-5 overflow-hidden relative">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[350px] h-[350px] bg-yellow-500/10 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-yellow-500/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* LOGIN CARD */}
      <div className="w-full max-w-md relative z-10">

        {/* LOGO */}
        <div className="text-center mb-6">
          <img
            className="w-[240px] m-auto"
            src="/logo.png"
            alt="Logo"
          />
        </div>

        {/* CARD */}
        <div className="bg-[#0d1725] border border-yellow-500/20 rounded-[30px] p-6 shadow-[0_0_50px_rgba(255,215,0,0.08)]">

          {/* TITLE */}
          <h1 className="text-2xl mb-4 font-semibold gold-text text-center">
            Login
          </h1>

          {/* DIVIDER */}
          <div className="divider mb-6">
            <img src="/images/top.png" alt="" />
          </div>

          {/* FORM */}
          <form onSubmit={login}>

            {/* USERNAME */}
            <div className="mb-4">
              <label className="form-label block mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="gold-input w-full"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="form-label block mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gold-input w-full"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-b from-[#d8c48f] to-[#9c7b45] text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200 shadow-[0_10px_25px_rgba(255,215,0,0.25)] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "🎮 Play Now"}
            </button>

          </form>

          {/* REGISTER */}
        

        </div>
      </div>
    </div>
  );
}