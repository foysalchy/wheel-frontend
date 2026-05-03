import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://wheel-backend-red.vercel.app/api/auth/login", {
      username,
      password,
    });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       backgroundColor: "#634e23",
background: "linear-gradient(90deg, #634e23 0%, #a88e5b 50%, #634e23 100%)",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "3px",
          borderRadius: "28px",
         backgroundColor: "#634e23",
background: "linear-gradient(90deg, #634e23 0%, #a88e5b 50%, #634e23 100%)",
          boxShadow:
            "0 0 20px rgba(255,215,0,0.5), 0 20px 50px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(145deg, rgba(107, 65, 0, 0.96), rgba(39, 22, 0, 0.98))",
            borderRadius: "25px",
            padding: "40px 35px",
            boxShadow:
              "inset 0 2px 8px rgba(255,255,255,0.08), inset 0 -2px 8px rgba(0,0,0,0.5)",
            transform: "perspective(1000px) rotateX(2deg)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "60px", marginBottom: "10px" }}>🎰</div>
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "bold",
                background:
                  "linear-gradient(180deg, #fff8dc, #ffd700, #ffb700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 10px rgba(255,215,0,0.4)",
              }}
            >
              Casino Royale
            </h1>
            <p
              style={{
                color: "#d1d5db",
                marginTop: "8px",
                fontSize: "15px",
              }}
            >
              Enter the game and test your luck
            </p>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "18px",
              borderRadius: "14px",
              border: "2px solid rgba(255,215,0,0.35)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "25px",
              borderRadius: "14px",
              border: "2px solid rgba(255,215,0,0.35)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
            }}
          />

          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(180deg, #ffe27a 0%, #ffd700 40%, #ffb700 100%)",
              color: "#111827",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow:
                "0 8px 0 #b8860b, 0 12px 25px rgba(255,215,0,0.4)",
              transition: "all 0.2s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(4px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {loading ? "Logging in..." : "🎮 Play Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
