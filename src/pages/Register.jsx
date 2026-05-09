import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

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
        "https://wheel-backend-omega.vercel.app/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Registration successful!");

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
    <div className="min-h-screen bg-[#07101b] text-white flex items-center justify-center  overflow-hidden relative">

      {/* BG GLOW */}
      <div className="absolute w-[350px] h-[350px] bg-yellow-500/10 blur-[120px]   top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-yellow-500/10 blur-[120px]   bottom-[-100px] right-[-100px]" />

      {/* CARD */}
      <div className="w-full max-w-md relative z-10">

        {/* TOP */}
       

        {/* FORM CARD */}
        <div className="bg-[#0d1725]   pt-0 p-6 shadow-[0_0_50px_rgba(255,215,0,0.08)]">
  <div className="flex items-center justify-between px-3 py-3">
        
          
             <button
              onClick={() => nav("/login")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

          <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
              Create Account
          </h1>

          <div className="w-6" />
      </div>
          
 
          {/* DIVIDER */}
          <div className="divider mb-6">
            <img src="/images/top.png" alt="" />
          </div>

          {/* FULL NAME */}
          <div className="mb-4">
            <label className="form-label">Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              onChange={handleChange}
              className="gold-input"
            />
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="form-label">Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              onChange={handleChange}
              className="gold-input"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="form-label">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              className="gold-input"
            />
          </div>

          {/* PHONE */}
          <div className="mb-4">
            <label className="form-label">Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="01XXXXXXXXX"
              onChange={handleChange}
              className="gold-input"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="form-label">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="gold-input"
            />
          </div>

          {/* PHOTO */}
          <div className="mb-5">
            <label className="form-label">Profile Photo</label>

            <input
              type="file"
              onChange={handleFile}
              className="gold-input file:bg-yellow-500 file:border-0 file:px-3 file:py-2 file:rounded-lg file:text-black"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={register}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-b from-[#d8c48f] to-[#9c7b45] text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200 shadow-[0_10px_25px_rgba(255,215,0,0.25)]"
          >
            {loading ? "Creating Account..." : "🎰 Register Now"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-gray-400 mt-5 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => nav("/")}
              className="text-yellow-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}