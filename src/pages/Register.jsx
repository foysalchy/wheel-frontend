import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle file
  const handleFile = (e) => {
    setPhoto(e.target.files[0]);
  };

  // submit
  const register = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("photo", photo);

      const res = await axios.post(
        "https://lite.fenixcoder.com/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Registration successful!");

      // auto login after register (optional)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      nav("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Register failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#1a1a1a" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "30px", background: "#111", borderRadius: "15px" }}>
        
        <h2 style={{ color: "gold", textAlign: "center", marginBottom: "20px" }}>
          Create Account
        </h2>

        {/* Inputs */}
        <input name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
        <input name="username" placeholder="Username" onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
        <input name="phone" placeholder="Phone" onChange={handleChange} style={inputStyle} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} />

        {/* File */}
        <input type="file" onChange={handleFile} style={{ marginBottom: "20px", color: "white" }} />

        {/* Button */}
        <button onClick={register} disabled={loading} style={btnStyle}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ color: "#aaa", marginTop: "15px", textAlign: "center" }}>
          Already have account?{" "}
          <span onClick={() => nav("/")} style={{ color: "gold", cursor: "pointer" }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  background: "#222",
  color: "white",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  background: "gold",
  fontWeight: "bold",
  cursor: "pointer",
};