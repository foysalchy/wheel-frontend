import { useCallback, useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LuxuryNav from "../components/luxury-nav";

export default function BetHistory() {
  const navigate = useNavigate();

  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const limit = 20;

  // ✅ FIXED: memoized fetch function
  const fetchBets = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://api.luckynumber.fun/api/auth/bet-history?page=${page}&limit=${limit}&status=${filterStatus}&from=${filterDate}&to=${filterDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setBets(data.data || []);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    },
    [filterStatus, filterDate]
  );

  // ✅ FIXED: socket + initial load
  useEffect(() => {
    fetchBets(1);

    const handler = () => {
      fetchBets(1); // always safe (no stale page issue)
    };

    socket.on("bet_history", handler);

    return () => {
      socket.off("bet_history", handler);
    };
  }, [fetchBets]);

  return (
    <div className="min-h-screen w-full lg:w-[350px] m-auto text-white flex flex-col relative">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        <button onClick={() => navigate("/dashboard")} className="gold-icon">
          <ChevronLeft size={32} />
        </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
          Bet History
        </h1>

        <div className="w-6" />
      </div>

      <div className="divider">
        <img src="/images/top.png" alt="" />
      </div>

      {/* FILTERS */}
      <div className="flex relative z-10 px-4 pt-3 gap-3">
        <select
          value={filterStatus}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterStatus(e.target.value);
          }}
          className="p-2 rounded-lg bg-black border border-yellow-500/30"
        >
          <option value="all">All</option>
          <option value="0">Pending</option>
          <option value="1">Win</option>
          <option value="2">Loss</option>
          <option value="3">Cancel</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterDate(e.target.value);
          }}
          className="p-2 rounded-lg flex-1 bg-black border border-yellow-500/30"
        />

        <button
          onClick={() => {
            setFilterStatus("all");
            setFilterDate("");
            setCurrentPage(1);
            fetchBets(1);
          }}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <main className="relative z-10 flex-1 px-4 py-4 pb-24 overflow-x-auto">
        <div className="bg-black/70 border border-yellow-500/30 rounded-2xl p-4">

          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Loading...
            </div>
          ) : (
            <table className="w-full text-sm text-left">

              <thead className="text-yellow-400 border-b border-yellow-500/20">
                <tr>
                  <th className="py-3">Bet</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {bets.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-10 text-gray-400">
                      No bets found
                    </td>
                  </tr>
                ) : (
                  bets.map((bet) => (
                    <tr
                      key={bet.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-3">
                        #{bet.id}
                        <p>{new Date(bet.created_at).toLocaleString()}</p>
                      </td>

                      <td className="text-yellow-400 text-right">
                        <p>₹{bet.amount}</p>

                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            bet.status === 1
                              ? "bg-green-500/20 text-green-400"
                              : bet.status === 2
                              ? "bg-red-500/20 text-red-400"
                              : bet.status === 0
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {bet.status === 1
                            ? "WIN"
                            : bet.status === 2
                            ? "LOSS"
                            : bet.status === 0
                            ? "PENDING"
                            : "CANCEL"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-3 mt-5">

            <button
              disabled={currentPage === 1}
              onClick={() => fetchBets(currentPage - 1)}
              className="px-3 py-1 rounded-lg bg-yellow-500 text-black disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchBets(currentPage + 1)}
              className="px-3 py-1 rounded-lg bg-yellow-500 text-black disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <LuxuryNav />
    </div>
  );
}