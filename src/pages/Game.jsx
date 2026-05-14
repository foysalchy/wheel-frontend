import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../socket";
import "./game.css";
import {  useNavigate } from "react-router-dom";
  const wheelNumbers = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];
export default function Game() {
  const navigate = useNavigate();
const wheelSoundRef = useRef(null);
const placeBetSoundRef = useRef(null);
const timerSoundRef = useRef(null);
const soundUnlockedRef = useRef(false);
  const firstLoadRef = useRef(true);
  const [isPageActive, setIsPageActive] = useState(true);
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
 const [showFsAlert, setShowFsAlert] = useState(false);
const [user, setUser] = useState(null);

 useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
 
const stopAllSounds = () => {
  [wheelSoundRef, placeBetSoundRef, timerSoundRef].forEach((ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;

      // force reload without self-assign warning
      const src = ref.current.src;
      ref.current.src = "";
      ref.current.load();
      ref.current.src = src;
    }
  });
};
useEffect(() => {

  const handleHide = () => {
    setIsPageActive(false);
    stopAllSounds();
  };

  const handleShow = () => {
    setIsPageActive(true);
  };

  const visibilityHandler = () => {
    if (document.hidden) {
      handleHide();
    } else {
      handleShow();
    }
  };

  document.addEventListener("visibilitychange", visibilityHandler);

  window.addEventListener("blur", handleHide);
  window.addEventListener("focus", handleShow);

  window.addEventListener("pagehide", handleHide);
  window.addEventListener("pageshow", handleShow);

  return () => {
    document.removeEventListener("visibilitychange", visibilityHandler);

    window.removeEventListener("blur", handleHide);
    window.removeEventListener("focus", handleShow);

    window.removeEventListener("pagehide", handleHide);
    window.removeEventListener("pageshow", handleShow);
  };

}, []);
useEffect(() => {

  // ❌ page inactive হলে কিছুই play হবে না
  if (!isPageActive) {
    stopAllSounds();
    return;
  }

  // ✅ only active page
  if (time > 1 && !locked) {

    if (timerSoundRef.current?.paused) {
      timerSoundRef.current.play().catch(() => {});
    }

  } else {

    timerSoundRef.current?.pause();
    timerSoundRef.current.currentTime = 0;
  }

}, [locked, time, isPageActive]);
useEffect(() => {
  wheelSoundRef.current = new Audio("/wheel.mp3");

  // ✅ place bet sound
  placeBetSoundRef.current = new Audio("/placebet.mp3");

  // ✅ timer sound
  timerSoundRef.current = new Audio("/timmer.mp3");

  wheelSoundRef.current.volume = 0.5;
  placeBetSoundRef.current.volume = 0.7;
  timerSoundRef.current.volume = 0.3;

  // timer loop
  timerSoundRef.current.loop = true;

  const unlockAudio = () => {
    if (!soundUnlockedRef.current) {

      Promise.all([
        wheelSoundRef.current.play(),
        placeBetSoundRef.current.play(),
        timerSoundRef.current.play()
      ])
        .then(() => {
          // reset all
          wheelSoundRef.current.pause();
          wheelSoundRef.current.currentTime = 0;

          placeBetSoundRef.current.pause();
          placeBetSoundRef.current.currentTime = 0;

          timerSoundRef.current.pause();
          timerSoundRef.current.currentTime = 0;

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
console.log(d,'resultx')
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
      
  }, 3000);
setTimeout(() => {
  let volume = wheelSoundRef.current.volume;

  const fadeOut = setInterval(() => {
    if (volume > 0.05) {
      volume -= 0.05;
      wheelSoundRef.current.volume = volume;
    } else {
      clearInterval(fadeOut);

      wheelSoundRef.current.pause();
      wheelSoundRef.current.currentTime = 0;

      // reset volume for next spin
      wheelSoundRef.current.volume = 0.5;
    }
  }, 80);
}, 3000);
  
  setTimeout(() => {
    setmyWin(myWinx);
     socket.on("result_timer", (d) => {
      setResultTimer(d.timeLeft);
    });
  }, 6000);
  setTimeout(() => {
    setmyWin(0);
    
    
  }, 12000);
});

   

    return () => socket.off();
  }, [calculateRotation]);

  // ======================
  // PLACE BET
  // ======================
//   useEffect(() => {

//   // ✅ betting open থাকলে timer sound play
//   if (time > 1) {

//     if (timerSoundRef.current.paused) {
//       timerSoundRef.current.play().catch(() => {});
//     }

//   } else {

//     // ❌ betting closed হলে stop
//     timerSoundRef.current.pause();
//     timerSoundRef.current.currentTime = 0;
//   }

// }, [locked, time]);
const placeBet = (num) => {
  if (locked) return;
  // 🔊 play sound
  placeBetSoundRef.current.currentTime = 0;
  placeBetSoundRef.current.play();
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

const toggleFullscreen = () => {
  const elem = document.documentElement;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // iOS Safari
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen(); // old IE
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
   setShowFsAlert(false);
};
 useEffect(() => {
 setShowFsAlert(true);
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
          {/* <div className="light-group-left">
            <div className="light-1"><img src="/images/use/light.webp" alt="" /> </div>
            <div className="light-2"><img src="/images/use/light.webp" alt="" /> </div>
            <div className="light-3"><img src="/images/use/light.webp" alt="" /> </div>
          </div> */}
          {showFsAlert && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
    }}
  >
    <div
      onClick={toggleFullscreen}
      style={{
        background: "#111",
        padding: "30px 40px",
        borderRadius: "12px",
        textAlign: "center",
        cursor: "pointer",
        border: "2px solid #fff",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "10px" }}>
        🔳 Enter Fullscreen Mode
      </h2>
      <p style={{ color: "#aaa" }}>
        Click to continue
      </p>
    </div>
  </div>
)}
       <div
  onClick={toggleFullscreen}
  style={{
    position: "absolute",
    top: "15px",
    right: "15px",
    zIndex: 9999,
    cursor: "pointer",
  }}
>
  <svg
    width="42"
    height="42"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 9V4H9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 9V4H15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 15V20H9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 15V20H15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>

       
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
    result == null &&
   
    time > 11
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
         
       <span> {myWin ?? ''}</span>
        
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
      ? (resultTimer < 3
          ? "🔴 Betting Closed, Waiting For Next Bet  "
          : "🔴 Betting Closed")
      : "🟢 Betting Open"
}
 {/* { isSpinning ? "🔴 Betting Closed" : locked ? "🔴 Betting Closed" : "🟢 Betting Open"} */}

      </h3>
  </div>
   <button     onClick={() => {
    stopAllSounds();
    navigate("/dashboard");
  }} className="w-[220px] h-[80px]">
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