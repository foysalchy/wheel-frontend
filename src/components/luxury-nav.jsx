import { useLocation, useNavigate } from "react-router-dom";
import { Home, Gamepad2, Settings, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: <Home size={28} /> },
  { href: "/game", label: "Game", icon: <Gamepad2 size={28} /> },
  { href: "/profile", label: "Profile", icon: <User size={28} /> },
];

export default function LuxuryNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="w-[100%] lg:w-[350px] m-auto  m-auto  fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-slate-900 border-t"
      
       style={{
        
     
          borderColor: "#cfc893"
        }}
    >
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>

              {isActive && (
                <div className="h-1 w-6 bg-yellow-400 mt-1 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}