import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import LuxuryNav from "../components/luxury-nav";

export default function Withdraw() {
  const navigate = useNavigate();

  const [method, setMethod] = useState("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  

  const submitWithdraw = async (e) => {
    e.preventDefault();

    try {
    await axios.post(
        "https://wheel-backend-red.vercel.app/api/auth/withdraw",
        {
          method,
          accountNumber,
          accountName,
          amount,
        },
         {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    },
  }
      );

      setPopup({
        show: true,
        type: "success",
        message: "Withdraw request submitted successfully!",
      });

      setMethod("bkash");
      setAccountNumber("");
      setAccountName("");
      setAmount("");

    } catch (err) {
      setPopup({
        show: true,
        type: "error",
        message: err?.response?.data?.message || "Withdraw failed!",
      });
    }
  };

  return (
    <div
      className="  relative overflow-hidden"
      
    >
       

      {/* HEADER */}
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        
          
         <button
              onClick={() => navigate("/dashboard")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
          Withdraw
        </h1>

        <div className="w-6" />
      </div>
      
      <div className="divider">
        <img src="/images/top.png" alt="" />
      </div>

      {/* FORM */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <form onSubmit={submitWithdraw} className="w-full max-w-md">

          {/* Amount */}
         

          {/* Method Cards */}
          <div className="mb-4">
            <label className="form-label">Payment Method</label>

            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setMethod("bkash")}
              className={`method-card text-white ${method === "bkash" ? "active" : ""}`}
              >
                <img src="/images/bkash.png" alt="bkash" />
              </div>

              <div
                onClick={() => setMethod("nagad")}
                className={`method-card text-white ${method === "nagad" ? "active" : ""}`}
              >
                <img src="/images/nagad.png" alt="nagad" />
              </div>

              <div
                onClick={() => setMethod("rocket")}
                className={`method-card text-white ${method === "rocket" ? "active" : ""}`}
              >
                <img src="/images/rocket.png" alt="rocket" />
              </div>
            </div>
          </div>
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
            <label className="form-label">Account Name  </label>
            <input
               type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
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
          <div className="bg-black border border-yellow-500/30 p-6 rounded-3xl w-[90%] max-w-sm text-center">
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
                    onClick={() => navigate("/withdraw")}
                    className="flex-1 py-2 rounded-xl bg-yellow-500 text-black font-bold"
                  >
                    New
                  </button>

                  <button
                    onClick={() => navigate("/")}
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
