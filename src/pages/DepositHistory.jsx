import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowDownCircle, ChevronDown } from "lucide-react";
import LuxuryNav from "../components/luxury-nav";

export default function DepositHistory() {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://origensoft.com/api/auth/deposit-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeposits(res.data || []);
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
    }
  };

  const statusMap = {
    approved: "success",
    rejected: "failed",
    pending: "pending",
  };

  const filteredDeposits = deposits.filter((deposit) => {
    if (filterStatus === "all") return true;
    return statusMap[deposit.status] === filterStatus;
  });

  const visibleDeposits = filteredDeposits.slice(0, visibleCount);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Success";
      case "rejected":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "success", label: "Success" },
    { key: "pending", label: "Pending" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="min-h-screen w-[100%] lg:w-[350px] m-auto  text-white pb-24 bg-gradient-to-b from-[#020b1a] via-[#06152c] to-[#020814]">
      <div className="max-w-md mx-auto px-3 py-4">
        {/* Header */}
         <div className="flex items-center justify-between px-3 py-3">
        
          
         <button
              onClick={() => navigate("/dashboard")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
          Deposit
        </h1>

        <div className="w-6" />
      </div>

      
        {/* Card */}
        <div className="mt-3 rounded-3xl border border-yellow-500/30 bg-[#04101f]/95 shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-4 m-2 rounded-2xl border border-yellow-500/20 overflow-hidden bg-black/30">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setFilterStatus(tab.key);
                  setVisibleCount(10);
                }}
                className={`py-3 text-sm font-semibold transition-all ${
                  filterStatus === tab.key
                    ? "bg-gradient-to-b from-green-500/20 to-green-700/20 text-green-400 border-b-2 border-green-400"
                    : "text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-3 px-4 py-3 text-sm   bg-black/20">
            <div>Amount</div>
            <div className="text-center">Date & Time</div>
            <div className="text-right">Status</div>
          </div>

          {/* List */}
          <div>
            {visibleDeposits.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                No deposits found
              </div>
            ) : (
              visibleDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="grid grid-cols-3 items-center px-4 py-4 border-b border-yellow-500/10"
                >
                  <div className="flex items-center gap-3">
                    <ArrowDownCircle className="text-green-400" size={30} />
                    <span className="text-lg font-semibold text-yellow-100">
                      ৳{Number(deposit.amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {new Date(deposit.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(deposit.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className={`text-right font-semibold ${getStatusStyle(deposit.status)}`}>
                    {getStatusText(deposit.status)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
          {visibleCount < filteredDeposits.length && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="w-full py-4 flex items-center justify-center gap-2 text-yellow-300 font-semibold border-t border-yellow-500/20 hover:bg-yellow-500/5 transition"
            >
              Load More
              <ChevronDown size={20} />
            </button>
          )}
        </div>
      </div>

      <LuxuryNav />
    </div>
  );
}