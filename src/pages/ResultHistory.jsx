import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResultHistory() {
  const [type, setType] = useState("1min");
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // =====================
  // SETTINGS (AUTO TYPE)
  // =====================
  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        "https://origensoft.com/api/auth/settings"
      );

      const data = res.data;

      if (data.game_time_mode == 1) {
        setType("1min");
      } else {
        setType("15min");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================
  // FETCH ROUND DATA
  // =====================
  const fetchData = useCallback(
    async (newPage = 1, newType = type) => {
      try {
        const res = await axios.get(
          `https://origensoft.com/api/auth/round-history?type=${newType}&page=${newPage}&limit=20`
        );

        const allRounds = res.data.data.flat();

        // GROUP BY DATE
        const groupedByDate = {};

        allRounds.forEach((round) => {
          const date = new Date(round.created_at).toLocaleDateString("en-GB");

          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }

          groupedByDate[date].push(round);
        });

        const finalGroups = Object.entries(groupedByDate).map(
          ([date, rounds]) => ({
            date,
            rounds,
          })
        );

        setGroups(finalGroups);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    },
    [type]
  );

  // =====================
  // LOAD DATA WHEN TYPE CHANGES
  // =====================
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // =====================
  // FORMAT TIME
  // =====================
  const formatTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen w-full lg:px-16 px-4 bg-[#020814] text-white flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="gold-icon"
        >
          <ChevronLeft size={32} />
        </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
          Result History
        </h1>

        <div className="w-6" />
      </div>

      {/* GROUPS */}
      <div className="space-y-4">

        {groups.map((group, idx) => (
          <div
            key={idx}
            className="py-8 px-6"
            style={{
              backgroundImage: "url('/images/use/freame.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >

            {/* DATE */}
            <div className="text-center text-yellow-400 font-bold mb-3">
              {group.date}
            </div>

            {/* RESULTS GRID */}
            <div className="flex flex-wrap gap-3 lg:gap-4 justify-start">

              {group.rounds.map((round) => (
                <div
                  key={round.id}
                  className="text-sm text-center flex flex-col items-center w-[13%] lg:w-[5.55%]"
                >
                  <div className="mb-1 text-xs">
                    {formatTime(round.created_at)}
                  </div>

                  <div className="bg-white/5 rounded-full w-[30px] h-[30px] border border-yellow-500 flex items-center justify-center text-green-400 text-lg">
                    {round.result}
                  </div>
                </div>
              ))}

            </div>
          </div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-5">

        <button
          disabled={page === 1}
          onClick={() => fetchData(page - 1)}
          className="px-3 py-1 bg-yellow-500 text-black rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => fetchData(page + 1)}
          className="px-3 py-1 bg-yellow-500 text-black rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>
    </div>
  );
}