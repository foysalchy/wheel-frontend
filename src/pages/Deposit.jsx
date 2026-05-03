import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LuxuryNav from "../components/luxury-nav";
import { ChevronLeft } from "lucide-react";

export default function Deposit() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const submitDeposit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("method", method);
      formData.append("accountNumber", accountNumber);
      formData.append("trxId", trxId);
      formData.append("screenshot", screenshot);

     await axios.post(
  "https://wheel-backend-red.vercel.app/api/auth/deposit",
  formData,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  }
);

      setPopup({
        show: true,
        type: "success",
        message: "Deposit request submitted successfully!",
      });

      setAmount("");
      setAccountNumber("");
      setTrxId("");
      setScreenshot(null);
      setMethod("bkash");

    } catch (err) {
      setPopup({
        show: true,
        type: "error",
        message:
          err?.response?.data?.message || "Something went wrong! Try again.",
      });
    }
  };

  return (
    <div className="  text-white flex flex-col overflow-hidden">

      {/* HEADER */}
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

      <div className="divider">
        <img src="/images/top.png" alt="" />
      </div>

      {/* FORM */}
      <main className="flex-1 flex items-center justify-center px-5 py-8">
        <form onSubmit={submitDeposit} className="w-full max-w-md">

          {/* Amount */}
          <div className="mb-4">
            <label className="form-label">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="gold-input"
            />
          </div>

          {/* Method Cards */}
          <div className="mb-4">
            <label className="form-label">Payment Method</label>

            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setMethod("bkash")}
                className={`method-card ${method === "bkash" ? "active" : ""}`}
              >
                <img src="/images/bkash.png" alt="bkash" />
              </div>

              <div
                onClick={() => setMethod("nagad")}
                className={`method-card ${method === "nagad" ? "active" : ""}`}
              >
                <img src="/images/nagad.png" alt="nagad" />
              </div>

              <div
                onClick={() => setMethod("rocket")}
                className={`method-card ${method === "rocket" ? "active" : ""}`}
              >
                <img src="/images/rocket.png" alt="rocket" />
              </div>
            </div>
          </div>

          {/* Account Number */}
          <div className="mb-4">
            <label className="form-label">Account Number</label>
            <input
              type="text"
              placeholder="01XXXXXXXXX"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="gold-input"
            />
          </div>

          {/* Transaction ID */}
          <div className="mb-4">
            <label className="form-label">Transaction ID</label>
            <input
              type="text"
              placeholder="Enter trx id"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className="gold-input"
            />
          </div>

          {/* Screenshot */}
          <div className="mb-5">
            <label className="form-label">Payment Screenshot</label>
            <input
              type="file"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="gold-input"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-b from-[#cfc893] to-[#b59c71] text-black font-bold hover:scale-105 transition"
          >
            Submit Deposit
          </button>

        </form>
      </main>

      {/* POPUP */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#07101b] border border-yellow-500/30 p-6 rounded-3xl w-[90%] max-w-sm text-center">
            <h2
              className={`text-xl font-bold mb-3 ${
                popup.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {popup.type === "success" ? "Success" : "Warning"}
            </h2>

            <p className="text-gray-300 mb-5">{popup.message}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setPopup({ show: false })}
                className="flex-1 py-2 rounded-xl bg-gray-700"
              >
                Close
              </button>

              {popup.type === "success" && (
                <>
                  <button
                    onClick={() => navigate("/deposit")}
                    className="flex-1 py-2 rounded-xl bg-yellow-500 text-black font-bold"
                  >
                    New Deposit
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 py-2 rounded-xl bg-green-500 text-black font-bold"
                  >
                    Home
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <LuxuryNav />
    </div>
  );
}