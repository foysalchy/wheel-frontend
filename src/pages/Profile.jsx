 import { useEffect, useState } from 'react';
import { ChevronRight, Lock, FileText, LogOut, ChevronLeft } from 'lucide-react';
import {useNavigate } from "react-router-dom";
import socket from '../socket';
import axios from 'axios';

 

export default function ProfilePage() {
 
  const navigate = useNavigate();
 const menuItems = [
  {
    icon: Lock,
    label: 'Change Password',
    path: '/change-password',
    badge: null,
  },
//   {
//     icon: Shield,
//     label: 'KYC Verification',
//     path: '/kyc',
//     badge: 'Verified',
//   },
  {
    icon: FileText,
    label: 'Privacy Policy',
    path: '/privacy',
    badge: null,
  },
  {
    icon: LogOut,
    label: 'Logout',
    badge: null,
    isLogout: true,
  },
];

  const [wallet, setWallet] = useState(0);
  const [profile, setProfile] = useState(0);
const handleLogout = () => {
  // remove auth data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // disconnect socket
  socket.disconnect();

  // redirect to login
  navigate("/");
};
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.emit("get_user", { token });
    socket.on("user_data", (data) => {
      setWallet(data.wallet || 0);
      console.log(data.data,'data')
      setProfile(data.data || []);
    });
    return () => socket.off("user_data");
  }, []);

const [showPassModal, setShowPassModal] = useState(false);

const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const passChange = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/change-password",
      {
        userId: profile.id,
        oldPassword,
        newPassword,
      }
    );

    alert(res.data.message);
    setShowPassModal(false)
  } catch (err) {
    alert(err.response?.data?.message);
    console.log(err.response?.data);
  }
};

  return (
    <div className="min-h-screen  bg-[#020814]   w-[100%] lg:w-[350px]  max-w-md mx-auto  text-white p-0">
      {/* Header */}
    <div className="flex items-center justify-between px-3 py-3">
        
          
         <button
              onClick={() => navigate("/dashboard")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
          Profile
        </h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info Card */}
        <div className="relative   overflow-hidden  p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/5 pointer-events-none" 
           style={{
    backgroundImage: "url('../../images/use/freame.png')",
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }}/>

          <div className="relative flex items-center gap-4"
          
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="  flex items-center justify-center shadow-lg">
             <img className='w-16 h-16 rounded-full'
  src={`http://localhost:5000/uploads/deposits/${profile.photo}`}
  alt=""
/>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{profile.name}  </h2>
                {/* <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-xs text-emerald-300 font-medium">
                  ✓ Verified
                </span> */}
              </div>
              <p className="text-xs text-gray-400 mb-2">User ID: {profile.username}  </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-300 flex items-center gap-1">
                  <span>📞</span> {profile.phone}  
                </p>
                <p className="text-xs text-gray-300 flex items-center gap-1">
                  <span>✉️</span> {profile.email}  
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="relative  overflow-hidden "
          style={{
    backgroundImage: "url('../../images/use/freame.png')",
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  }}
        >
          <div className="absolute  " />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-amber-400/20 to-transparent rounded-full blur-3xl" />

          <div className="relative h-full flex  justify-between p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-200 opacity-80">Wallet Balance</p>
              <p className="text-3xl font-bold text-amber-300 mt-2">
                ₹{wallet}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div />
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
  if (item.isLogout) {
    handleLogout();
  } else if (item.path === "/change-password") {
    setShowPassModal(true);
  } else {
    navigate(item.path);
  }
}}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all border ${
                  item.isLogout
                    ? 'border-red-500/30 hover:bg-red-500/10 group'
                    : 'border-amber-500/20 hover:bg-amber-500/10 group'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      item.isLogout ? 'text-red-400' : 'text-amber-400'
                    } group-hover:scale-110 transition-transform`}
                  />
                  <span className={`font-medium ${item.isLogout ? 'text-red-300' : 'text-gray-200'}`}>
                    {item.label}
                  </span>
                </div>

                {item.badge ? (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-xs text-emerald-300 font-medium">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-5 h-5 ${item.isLogout ? 'text-red-400' : 'text-amber-400'} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      {showPassModal && (
  <div className="fixed    w-[100%] lg:w-[350px] left-0 right-0 m-auto inset-0 bg-black/70 flex items-center justify-center z-50">
    
    <div className="bg-[#0b1220] w-[90%] max-w-sm p-5 rounded-xl border border-amber-500/30">

      <h2 className="text-xl font-bold text-amber-400 mb-4">
        Change Password
      </h2>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-gray-800 text-white"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
      />

      <div className="flex gap-2">
        
        <button
          onClick={() => setShowPassModal(false)}
          className="flex-1 bg-gray-600 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() =>passChange()}
          className="flex-1 bg-amber-500 text-black font-bold py-2 rounded"
        >
          Update
        </button>

      </div>
    </div>
  </div>
)}
    </div>
    
  );
}
