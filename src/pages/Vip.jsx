import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import LuxuryNav from "../components/luxury-nav";
import {  useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function VipHistory() {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const limit = 5;
const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      "http://origensoft.com/api/auth/vip-history",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { from, to, page, limit },
      }
    );

    setData(res.data.data);
    setTotal(res.data.total);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [from, to, token, page]);

 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen w-[100%] lg:w-[350px] m-auto bg-[#020814] text-white flex flex-col pb-24">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        
          
         <button
              onClick={() => navigate("/dashboard")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
          Vip History
        </h1>

        <div className="w-6" />
      </div>


      {/* FILTER CARD */}
      <div className="px-4 mt-4">
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundImage: "url('/images/use/freame.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex gap-2">
            <input
              type="date"
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-2 rounded bg-black/40 text-white text-xs border border-gray-600"
            />
            <input
              type="date"
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2 rounded bg-black/40 text-white text-xs border border-gray-600"
            />
          </div>

          <button
            onClick={fetchData}
            className="w-full mt-3 py-2 rounded-lg bg-gradient-to-b from-yellow-400 to-yellow-700 text-black font-bold active:scale-95"
          >
            {loading ? "Loading..." : "Filter"}
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="px-4 mt-4 space-y-4">
        {data?.length === 0 && !loading && (
          <p className="text-gray-400 text-center text-sm mt-10">
            No data found
          </p>
        )}

    {data?.map((group) => (
          <div
            key={group.date}
            className="rounded-2xl p-4"
            style={{
              backgroundImage: "url('/images/use/freame.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* DATE */}
            <h3 className="flex justify-between text-center text-yellow-300 font-bold text-sm mb-3">
          <span>
  {new Date(group.date).toISOString().split("T")[0]}
</span>
              <span>
                 {group.totalPaid > 0 ? (
               <span className="text-green-400">Paid</span>
              ) : (
                <span className="text-red-400">Unpaid</span>
              )}
              </span>
            </h3>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/30 p-2 rounded">
                <p className="text-gray-400">Total Bet</p>
                <p className="text-white font-bold">
                  ₹ {group.totalBet.toLocaleString()}
                </p>
              </div>

              <div className="bg-black/30 p-2 rounded">
                <p className="text-gray-400">Total Bets</p>
                <p className="text-white font-bold">{group.totalBets}</p>
              </div>
    
             

              {/* <div className="bg-green-900/30 p-2 rounded">
                <p className="text-gray-400">Paid</p>
                <p className="text-green-400 font-bold">
                  ₹ {group.totalPaid.toLocaleString()}
                </p>
              </div>

              <div className="bg-red-900/30 p-2 rounded">
                <p className="text-gray-400">Unpaid</p>
                <p className="text-red-400 font-bold">
                  ₹ {group.totalUnpaid.toLocaleString()}
                </p>
              </div> */}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 mt-4 text-sm">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
  >
    Prev
  </button>

  <span className="text-gray-300">
    Page {page} / {Math.ceil(total / limit) || 1}
  </span>

  <button
    disabled={page * limit >= total}
    onClick={() => setPage((p) => p + 1)}
    className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
  >
    Next
  </button>
</div>
      </div>

      {/* NAV */}
      <LuxuryNav />
    </div>
  );
}