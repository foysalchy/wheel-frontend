import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

export default function BetHistory() {
  const navigate = useNavigate();
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const perPage = 20;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    socket.emit("get_bet_history", { token });

    socket.on("bet_history", (data) => {
      setBets(data);
      setCurrentPage(1);
    });

    return () => socket.off("bet_history");
  }, []);

  // FILTER LOGIC
  const filteredBets = bets.filter((bet) => {
    const statusMatch =
      filterStatus === "all" || bet.status === filterStatus;

    const dateMatch = filterDate
      ? new Date(bet.createdAt).toISOString().split("T")[0] === filterDate
      : true;

    return statusMatch && dateMatch;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredBets.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentBets = filteredBets.slice(startIndex, startIndex + perPage);

  return (
    <div
      className="min-h-screen w-[100%] lg:w-[350px] m-auto  text-white flex flex-col relative"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/024/632/483/large_2x/casino-gambling-background-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/75" />

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-yellow-500/30 bg-black/40 backdrop-blur-xl">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-xl font-bold text-yellow-400">Bet History</h1>
          <p className="text-xs text-gray-300">All your bets</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* FILTERS */}
      <div className="flex relative z-10 px-4 pt-3 flex   gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 rounded-lg bg-black border border-yellow-500/30"
        >
          <option value="all">All</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 rounded-lg flex-1 bg-black border border-yellow-500/30"
        />

        <button
          onClick={() => {
            setFilterStatus("all");
            setFilterDate("");
          }}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <main className="relative z-10 flex-1 px-4 py-4 pb-24 overflow-x-auto">
        <div className="bg-black/70 border border-yellow-500/30 rounded-2xl p-4">
          <table className="w-full text-sm text-left">
            <thead className="text-yellow-400 border-b border-yellow-500/20">
              <tr>
                <th className="py-3">Bet ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {currentBets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No bets found
                  </td>
                </tr>
              ) : (
                currentBets.map((bet) => (
                  <tr
                    key={bet.id}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="py-3">#{bet.id}</td>
                    <td className="text-yellow-400">₹{bet.amount}</td>
                    <td>{new Date(bet.createdAt).toLocaleString()}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          bet.status === "win"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {bet.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-3 mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg bg-yellow-500 text-black disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-300">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg bg-yellow-500 text-black disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 border-t border-yellow-500/20">
        <div className="grid grid-cols-3 py-3 text-center text-gray-400">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/game")}>Bet</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
      </footer>
    </div>
  );
}