import React, { useEffect, useState } from "react";
import axios from "axios";

const VipHistory = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // ----------------------------
  // GROUP BY DATE FUNCTION
  // ----------------------------
  const groupByDate = (list) => {
    const grouped = {};

    list.forEach((item) => {
      if (!item.date) return;

      const key = new Date(item.date).toISOString().split("T")[0];

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          totalBet: 0,
          totalPaid: 0,
          totalUnpaid: 0,
          totalBets: 0,
        };
      }

      grouped[key].totalBet += Number(item.totalBet || 0);
      grouped[key].totalPaid += Number(item.totalPaid || 0);
      grouped[key].totalUnpaid += Number(item.totalUnpaid || 0);
      grouped[key].totalBets += Number(item.totalBets || 0);
    });

    return Object.values(grouped);
  };

  // ----------------------------
  // FETCH DATA
  // ----------------------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/api/vip-history?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);

      const grouped = groupByDate(res.data);
      setGroupedData(grouped);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>VIP History</h2>

      {/* FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button onClick={fetchData}>Filter</button>
      </div>

      {/* CARDS */}
      <div style={{ display: "grid", gap: "10px" }}>
        {groupedData.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h3>Date: {item.date}</h3>

            <p>Total Bet: {item.totalBet} TK</p>
            <p>Paid: {item.totalPaid} TK</p>
            <p>Unpaid: {item.totalUnpaid} TK</p>
            <p>Total Bets: {item.totalBets}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VipHistory;