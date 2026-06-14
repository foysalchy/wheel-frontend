import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LuxuryNav from "../components/luxury-nav";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen   text-white bg-[#020814]   w-[100%] lg:w-[350px]  mx-auto p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        
          
         <button
              onClick={() => navigate("/profile")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
             Privacy Policy
        </h1>

        <div className="w-6" />
      </div>
      {/* Content */}
        <div className="space-y-5 px-3 mt-4 text-sm text-gray-300 leading-relaxed">

            <div
      style={{
        height: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>🔒 Game Closed</h1>

      <p
        style={{
          marginTop: "15px",
          fontSize: "22px",
          color: "#ffd700",
        }}
      >
        Game Open Time
      </p>

      <h2>09:15 AM - 06:00 PM</h2>
      <h3>India Time Zone</h3>
    </div>
        </div>
       <LuxuryNav />
    </div>
  );
}