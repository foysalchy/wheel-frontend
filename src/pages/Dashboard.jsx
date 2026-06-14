import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import LuxuryNav from "../components/luxury-nav";
import {  ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import axios from "axios";

export default function CasinoDashboard() {
  const navigate = useNavigate();
  // const [userStore] = useState(JSON.parse(localStorage.getItem("user")));
  const [wallet, setWallet] = useState(0);
  const [isVip, setIsVip] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.emit("get_user", { token });
    socket.on("user_data", (data) => {
      setWallet(data.wallet || 0);
      setIsVip(data.data.is_vip || 0);
      console.log(data,'datdad')
    });
    return () => socket.off("user_data");
  }, []);

   

  const actionCards = [
    { title: "Deposit", icon: "/images/use/deposit.png ", path: "/deposit", color: "from-green-400 to-green-700" },
    { title: "Withdraw", icon: "/images/use/withdraw.png", path: "/withdraw", color: "from-purple-400 to-purple-700" },
    { title: "Deposit History", icon: "/images/use/depohis.png", path: "/deposit-history", color: "from-orange-400 to-orange-700" },
    { title: "Withdrawal History", icon: "/images/use/withhis.png", path: "/withdraw-history", color: "from-blue-400 to-blue-700" },
  ];
  useEffect(() => {
  fetchSummary();
}, []);

const fetchSummary = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://api.luckynumber.fun/api/auth/dashboard-summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSummary(res.data);
  } catch (error) {
    console.log(error);
  }
};
  const [summary, setSummary] = useState({
  totalDeposit: 0,
  totalWithdraw: 0,
});
const summaryCards = [
  {
    title: "Total Deposit",
    amount: `₹ ${Number(summary.totalDeposit).toLocaleString()}`,
    icon: ArrowDownToLine,
    color: "bg-green-600",
  },
  {
    title: "Total Withdraw",
    amount: `₹ ${Number(summary.totalWithdraw).toLocaleString()}`,
    icon: ArrowUpFromLine,
    color: "bg-purple-600",
  },
];

  return (
    <div className="min-h-screen w-[100%] lg:w-[350px] m-auto  bg-[#020814] text-white flex flex-col pb-24 font-sans">
      <main className="flex-1 px-4 py-5">
        
        {/* Balance Card Section */}
        <div className="relative mb-6">
          <img className="w-full rounded-2xl shadow-2xl  " src="/images/use/home-bng.png" alt="Banner" />
          <div className="absolute top-[56%] left-[30px]">
            <p className="text-xs text-gray-300 uppercase tracking-wider">Balance</p>
            <p className="text-2xl font-bold text-yellow-400 drop-shadow-md">₹{wallet}</p>
            <button
              onClick={() => navigate("/deposit")}
              className="mt-2 py-1.5 px-5 text-sm rounded-lg bg-gradient-to-b from-[#cfc893] to-[#b59c71] text-black font-bold shadow-lg active:scale-95 transition"
            >
              New Deposit
            </button>
          </div>
        </div>

        {/* Summary Cards with Golden Borders */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl px-4 py-3"
             style={{
    backgroundImage: "url('../../images/use/freame.png')",
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }}
            >
              <div className="flex items-center gap-3">
                <div className={`${card.color} p-2 rounded-full shadow-inner`}>
                   <card.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400">{card.title}</p>
                  <p className="text-sm font-bold text-white leading-none">{card.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Action Grid (IMG-20260502-WA0030.jpg Style) */}
        <div className="grid grid-cols-2 gap-4">
           
          {actionCards.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="relative group overflow-hidden transition-all active:scale-95"
            >
              {/* Inner Glow/Highlight */}
              {/* <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center justify-center">
                <div className={`mb-4 p-4 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-white/20`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-100 text-center tracking-tight leading-tight">
                  {item.title}
                </h3>
              </div> */}
               <img src={item.icon} alt="" />
            </button>
          ))}
        </div>
 <button
      onClick={() => navigate('/profile')}
      className="mt-6 w-full active:scale-[0.98] transition-transform"
    >
      <img src="/images/use/profilenav.png" alt="" />
    </button>
        {/* Profile Card Section */}
      {isVip === 1 ? (
  <>
   

    <button
      onClick={() => navigate('/vip')}
      className="mt-6 w-full active:scale-[0.98] transition-transform"
    >
      <img src="/images/use/vip-portal.png" alt="" />
    </button>
  </>
) : null}
      </main>

      <LuxuryNav />
    </div>
  );
}