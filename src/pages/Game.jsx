import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../socket";
import "./game.css";
import {  useNavigate } from "react-router-dom";
  const wheelNumbers = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];
export default function Game() {
  const navigate = useNavigate();
const wheelSoundRef = useRef(null);
const soundUnlockedRef = useRef(false);
  const firstLoadRef = useRef(true);
const rotationRef = useRef(0);
  const [time, setTime] = useState(60);
  const [betCount, setBetCount] = useState(0);
  const [bets, setBets] = useState([]);
const walletRef = useRef(0);
  const [result, setResult] = useState(null);
  const [myWin, setmyWin] = useState(0);
  const [resultTimer, setResultTimer] = useState(0);
const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [locked, setLocked] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
const [lastResults, setLastResults] = useState([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  

  const spinDuration = 3;
  const [betAmount, setBetAmount] = useState(10);
const [wallet, setWallet] = useState(0);
 
const [user, setUser] = useState(null);
 useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
useEffect(() => {
  wheelSoundRef.current = new Audio("/wheel.mp3");
  wheelSoundRef.current.volume = 0.5;

  const unlockAudio = () => {
    if (!soundUnlockedRef.current) {
      wheelSoundRef.current
        .play()
        .then(() => {
          wheelSoundRef.current.pause();
          wheelSoundRef.current.currentTime = 0;

          soundUnlockedRef.current = true;
          console.log("🔊 Audio unlocked");
        })
        .catch((e) => console.log(e));
    }

    document.removeEventListener("click", unlockAudio);
  };

  document.addEventListener("click", unlockAudio);

  return () => {
    document.removeEventListener("click", unlockAudio);
  };
}, []);
console.log(user,spinDuration)
 useEffect(() => {
  const token = localStorage.getItem("token");

  socket.emit("get_user", { token });

  socket.on("user_data", (data) => {
    console.log(data,'dat');
    setUser(data);
    setWallet(data.wallet);
  });

  socket.on("bet_count", (d) => {
    setBetCount(d.total);
  });

  return () => {
    socket.off("user_data");
    socket.off("bet_count");
  };
}, []);
useEffect(() => {
  socket.emit("get_last_results");

  socket.on("last_results", (data) => {

    // ✅ First page load = instant show
    if (firstLoadRef.current) {
      setLastResults(data);
      firstLoadRef.current = false;
    } 
    // ✅ Next socket updates = delay
    else {
      setTimeout(() => {
        setLastResults(data);
      }, 6000);
    }

  });

  return () => socket.off("last_results");
}, []);
const animateWallet = (end, duration = 2000) => {
  const start = walletRef.current;

  let startTime = null;

  const animate = (currentTime) => {
    if (!startTime) startTime = currentTime;

    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    const currentValue = Math.floor(
      start + (end - start) * progress
    );

    setWallet(currentValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      walletRef.current = end;
    }
  };

  requestAnimationFrame(animate);
};
useEffect(() => {
  socket.on("wallet_update", (data) => {
   
   const storedUser = JSON.parse(localStorage.getItem("user"));

    console.log(data, "dhit1");
    console.log(storedUser, "storedUser");

    if (data.userId === storedUser?.id) {
      if (data.wallet !== null) {
         setTimeout(() => {
     animateWallet(data.wallet, 1500);
        }, 5000);
        
      } else {
        // fallback refresh from server
        socket.emit("get_user", {
          token: localStorage.getItem("token"),
        });
      }
    }
  });
 
}, []);

useEffect(() => {
  walletRef.current = wallet;
}, [wallet]);
  // ======================
  // POSITION CALC
  // ======================
  const getNumberPosition = (index) => {
 const radius =
  screenWidth <= 780
    ? 70
    : screenWidth <= 1360
    ? 90
    : 130;
    const segmentSize = 360 / wheelNumbers.length;
    const angle = ((index + 0.5) * segmentSize - 90) * (Math.PI / 180);

    return {
      left: `calc(50% + ${radius * Math.cos(angle)}px)`,
      top: `calc(50% + ${radius * Math.sin(angle)}px)`,
    };
  };

  // ======================
  // ROTATION CALC
  // ======================
  
  // const calculateRotation = (num) => {
  //   const index = wheelNumbers.indexOf(num);
  //   const segmentSize = 360 / wheelNumbers.length;
  //   const targetAngle = (index + 0.5) * segmentSize;
  //   const base = 360 * 5;

  //   return base - targetAngle;
  // };

  const calculateRotation = useCallback((num) => {
  const index = wheelNumbers.indexOf(num);
  const segmentSize = 360 / wheelNumbers.length;

  // 🎯 EXACT CENTER POSITION FIX
  const targetAngle = index * segmentSize + segmentSize / 2;

  // full spins
  const fullSpins = 360 * 5;

  // 🎯 pointer top = 0 degree fix
  return fullSpins + (360 - targetAngle);
}, []);
  // ======================
  // SOCKET EVENTS
  // ======================
  useEffect(() => {
      socket.on("sync_state", (state) => {
        setTime(state.timeLeft);
        setResult(state.result);
        setLocked(!state.bettingOpen);

        setResultTimer(state.resultHoldTime);

        if (state.phase === "locked") {
          setIsSpinning(true);
        } else {
          setIsSpinning(false);
        }
      });

      socket.on("bet_count", (d) => {
        setBetCount(d.total);
      });

      socket.on("spinning", () => {
        setIsSpinning(true);
        setResult(null);
      });

   socket.on("result", (d) => {
    const rot = calculateRotation(d.result);

  // ❌ don't use ref add directly for casino wheel
  const newRot = rot; // RESET each round (IMPORTANT)

  rotationRef.current = newRot;
setIsSpinningWheel(true);
// 🔊 play wheel sound
wheelSoundRef.current.currentTime = 0;
wheelSoundRef.current.play();
  setIsSpinning(false);
  setResult(d.result);
console.log(d,'result')

    const storedUser = JSON.parse(localStorage.getItem("user"));
  const uid = String(storedUser?.id);
 
  const myWinx = d.userWins?.[uid] || 0;

  

  console.log("UID:", uid,);
  console.log("userWins:", d.userWins);
  console.log("myWin:", myWinx);

  console.log(uid,myWinx,d.userWins,'userWins')

  setBets([]);

 requestAnimationFrame(() => {
    setWheelRotation(newRot);
  });

  setTimeout(() => {
    setIsSpinningWheel(false);
      // 🔇 stop sound
  wheelSoundRef.current.pause();
  wheelSoundRef.current.currentTime = 0;
  }, 3000);
   setTimeout(() => {
    
    setmyWin(myWinx);
     socket.on("result_timer", (d) => {
      setResultTimer(d.timeLeft);
    });
  }, 6000);
});

   

    return () => socket.off();
  }, [calculateRotation]);

  // ======================
  // PLACE BET
  // ======================
const placeBet = (num) => {
  if (locked) return;

  const amount = Number(betAmount);
  if (!amount || amount <= 0) return;

  socket.emit("place_bet", {
    token: localStorage.getItem("token"),
    number: num,
    amount,
  });

  setBets((prev) => [
    ...prev,
    { num, amount, time: new Date().toLocaleTimeString() },
  ]);
};
const cancelBet = () => {
  console.log('go')
   if (locked) return;
  socket.emit("cancel_bet", {
    token: localStorage.getItem("token"),
  });
  console.log('end')

  setBets([]); // UI clear
};
const repeatBet = () => {
  if (locked) return;
 
  socket.emit("repeat_bet", {
    token: localStorage.getItem("token"),
  });
 
 

};

useEffect(() => {
  const handler = (data) => {
    console.log(data,'data')
    setBets(
      data.map(b => ({
        num: b.number,
        amount: b.amount
      }))
    );
  };
  socket.on("repeat_done", handler);
  return () => socket.off("repeat_done", handler);
}, []);


useEffect(() => {
  const token = localStorage.getItem("token");

  socket.emit("get_current_bets", { token });

  socket.on("current_bets", (data) => {
    setBets(
      data.map((b) => ({
        num: b.number,
        amount: b.amount,
      }))
    );
  });
  

  return () => socket.off("current_bets");
}, []);
 
  // ======================
  // UI
  // ======================
// useEffect(() => {
//   const handler = () => {
//     document.documentElement.requestFullscreen?.();
//     document.removeEventListener("click", handler);
//   };

//   document.addEventListener("click", handler);
// }, []);
  return (
    <div className="game-container"
        style={{
          backgroundImage:
            "url('/images/BG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          height:'100vh'
        }}
    >
   <style>
{`
  body {
    width: 100%;
    margin: 0;
    padding: 0;
    background:black
  }
`}
</style>

   <div className="grid grid-cols-3 gap-3 mb-6">
        <div>

       
    <div className="score w-[360px]  h-[175px]  m-auto"
    style={{
          backgroundImage:
            "url('/images/use/balance.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding:'37px',
        }}
    >
        <span
        style={{
          color: "black",
  fontWeight: "800",
  padding: "25px 0px",
  position: "relative",
  top: "50px",
  textAlign: "center",
  fontSize:"22px"
        }}
        > {wallet}</span>
    </div>
     <div className="score timer mt-6 w-[360px]  h-[175px]  m-auto"
    style={{
          backgroundImage:
            "url('/images/use/timmer.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding:'37px',
        }}
    >
        <span
                style={{
                color: "black",
          fontWeight: "800",
          padding: "25px 0px",
          position: "relative",
          top: "37px",
          textAlign: "center",
          fontSize:"22px"
                }}
        >⏱ {time}s</span>
    </div>
   <div 
   className="flex betamount-tigger mt-6  m-auto"
    >
     
      <div className="relative  m-auto">
        <img src="/images/use/ambutton-l.png" alt="" />
          <div className="number flex absolute left-[19px] top-[-26px] gap-4 right-0 z-999 index-999 ">
           <button
           className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(10)}
      >
        10
      </button>
       <button    className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(20)}
       >
        20
      </button>
       <button    className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(50)}
       >
      50
      </button>
       <button    className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(100)}
       >
       100
      </button>
        </div>
      </div>
     
    
    </div>
     </div>

     <div>
    
    

   
      

      

      {/* BET AMOUNT */}
       

      {/* WHEEL */}
      <div className="wheel-container relative">
        <div className="wheel-border"></div>
      <div className={`pointer ${
    result !== null &&
    resultTimer > 0 &&
    resultTimer < 8
      ? "glow"
      : ""
  }`}
        style={{
          backgroundImage:
            "url('/images/use/pointer.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
           
        }}
        />

        <div
          className={`wheel ${isSpinningWheel ? "spinning" : ""}`}
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            transition: `transform ${spinDuration}s cubic-bezier(0.15,0.83,0.66,1)`,
              willChange: "transform",
          }}
        >
          <div className="wheel-numbers">
            {wheelNumbers.map((num, i) => (
              <div
                key={num}
                className="number-item"
                style={{
                  position: "absolute",
                  ...getNumberPosition(i),
                  transform: `translate(-50%,-50%) rotate(${-wheelRotation}deg)`,
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
       </div>
       




        <div>

       
    <div className="score w-[360px]  h-[142px] m-auto"
    style={{
          backgroundImage:
            "url('/images/use/winner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding:'37px',
        }}
    >
        <span
        style={{
          color: "black",
  fontWeight: "800",
  padding: "25px 0px",
  position: "relative",
  top: "39px",
  textAlign: "center",
  fontSize:"22px"
        }}
        >  
         {result !== null && resultTimer > 0 &&  resultTimer < 8 && (
       <span> {result ?  myWin:'0'}</span>
         )}
        </span>
    </div>
     <div className="score last mt-12 w-[360px]  h-[100px]  m-auto"
    style={{
          backgroundImage:
            "url('/images/use/result pad.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding:'37px',
        }}
    >
     
        <span
        style={{
         color: "black",
  fontWeight: "800",
  padding: "25px 0px",
  position: "relative",
  top: "-4px",
  textAlign: "center",
  fontSize:"22px"
        }}
        >  <span>
  {lastResults.join(", ")}
</span></span>
    </div>
    <div className="score veiw  w-[160px]  h-[50px]  m-auto"
    style={{
          backgroundImage:
            "url('/images/use/result pad.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat:'no-repeat',
          padding:'37px',
        }}
    >
     
        <span
        style={{
         color: "black",
  fontWeight: "800",
  padding: "25px 0px",
  position: "relative",
  top: "-12px",
  textAlign: "center",
  fontSize:"14px"
        }}
        > View All</span>
    </div>

     <div 
   className="flex betamount-tigger betamount-tigger2 mt-9  m-auto"
    >
     
      <div className="relative  m-auto">
        <img src="/images/use/ambutton-l.png" alt="" />
          <div className="number flex absolute left-[19px] top-[-26px] gap-4 right-0 z-999 index-999 ">
           <button
           className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(200)}
      >
        200
      </button>
       <button    className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(500)}
       >
        500
      </button>
       <button    className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(1000)}
       >
      1000
      </button>
       <button    className="btnn w-[20%] h-[100px]"
        onClick={(e) => setBetAmount(2000)}
       >
       2000
      </button>
        </div>
      </div>
     
    
    </div>
     </div>

     
      </div>

  <div className="prev-centl cc flex  w-[80%] m-auto px-4 bottom-[20%] absolute left-0 right-0 justify-between">
  
  <button onClick={repeatBet} className="w-[200px] h-[80px]">
    <img
      src="/images/use/placebet.png"
      className="w-full h-full object-contain"
      alt=""
    />
  </button>

  <button onClick={cancelBet} className="w-[250px] h-[80px] ccn">
    <img
      src="/images/use/Cancel.png"
      className="w-full h-full object-contain"
      alt=""
    />
  </button>

</div>
      <div className="nm w-[100%] h-[120px] absolute left-0 right-0 w-[80%] m-auto bottom-[7%]">
  <img
    src="/images/use/numbring.png"
    className="w-[100%] absolute left-0 right-0"
    alt=""
  />

  <div className="number flex absolute left-0 right-0 z-999 cursor-pointer">
    {wheelNumbers.map((n) => {
      
      // 👉 এই নাম্বারের জন্য bet খুঁজতেছি
     const totalAmount = bets
  .filter((b) => b.num === n)
  .reduce((sum, b) => sum + b.amount, 0);
   const bet = bets.find((b) => b.num === n);

      return (
        <div
          key={n}
          className={`w-[10%] h-[120px]  flex flex-col items-center justify-center text-white ${
            locked ? "disabled" : ""
          }`}
          onClick={() => placeBet(n)}
        >
          {/* Number */}
          <div className="text-2xl font-bold opacity-[0.1]">{n}</div>

          {/* 👉 যদি bet থাকে তাহলে amount দেখাও */}
          {bet && (
            <div className="text-sm mt-1 absolute top-[11px] text-[20px] text-black font-[900] bm">
               {totalAmount}
            </div>
          )}
        </div>
      );
    })}
  </div>


 
</div>
 <div className="prev-centl flex  w-[80%] m-auto px-4 bottom-[0] absolute left-0 right-0 justify-between">
  
 

  <button className="relative w-[200px] h-[80px]">
    <img
      src="/images/use/total.png"
      className="w-full h-full object-contain"
      alt=""
    />
    <span className="absolute left-0 right-0 m-auto top-[21px]  text-lg font-bold">
      ৳ {bets.reduce((sum, b) => sum + b.amount, 0)}
    </span>
  </button>
   <div className="relative h-[80px]">
    <img
      src="/images/use/bar.png"
      className="w-full h-full object-contain"
      alt=""
    />
    <h3 className={`status-text absolute left-0 right-0 m-auto top-[21px] ${locked ? "status-closed" : "status-open"}`}>
          <span className="d-none hidden">  {betCount} </span>
 {
  isSpinning
    ? "🔴 Betting Closed"
    : locked
      ? (resultTimer < 7
          ? "🔴 Betting Closed, Waiting For Next Bet " + resultTimer + "s"
          : "🔴 Betting Closed")
      : "🟢 Betting Open"
}
 {/* {isSpinning ? "🔴 Betting Closed" : locked ? "🔴 Betting Closed" : "🟢 Betting Open"} */}

      </h3>
  </div>
   <button    onClick={() => navigate("/dashboard")} className="w-[220px] h-[80px]">
    <img
      src="/images/use/exit.png"
      className="w-full h-full object-contain"
      alt=""
    />
  </button>

</div>
     
    </div>
  );
}