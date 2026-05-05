import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LuxuryNav from "../components/luxury-nav";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen   text-white bg-[#020814]   w-[100%] lg:w-[350px]  mx-auto p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        
          
         <button
              onClick={() => navigate("/profile")}
             className="gold-icon"
            >
               <ChevronLeft size={32} />
            </button>

        <h1 className="text-2xl font-semibold gold-text flex-1 text-center">
             Privacy Policy
        </h1>

        <div className="w-6" />
      </div>
      {/* Content */}
      <div className="space-y-5 px-3 mt-4 text-sm text-gray-300 leading-relaxed">

        <section>
          <h2 className="text-white font-semibold mb-1">1. Information We Collect</h2>
          <p>
            We collect basic user information such as name, username, email, phone number,
            and profile photo during registration. We also store wallet balance and transaction history.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">2. How We Use Your Data</h2>
          <p>
            Your information is used to provide account access, manage wallet balance,
            process transactions, and improve user experience in the platform.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">3. Data Security</h2>
          <p>
            We use secure encryption and authentication methods to protect your account.
            However, no system is 100% secure, so users are responsible for keeping credentials safe.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">4. Wallet & Transactions</h2>
          <p>
            All wallet transactions are recorded. We do not allow unauthorized withdrawals or manipulation of balances.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">5. Cookies & Tracking</h2>
          <p>
            We may use cookies or local storage to improve user experience and maintain login sessions.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">6. Third-Party Services</h2>
          <p>
            We may use third-party services for payments, analytics, or hosting. These services have their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">7. Account Responsibility</h2>
          <p>
            Users are responsible for all activities under their account. Sharing account access is not recommended.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">8. Changes to Policy</h2>
          <p>
            We may update this Privacy Policy at any time. Users will be notified when major changes occur.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold mb-1">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact our support team.
          </p>
        </section>

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Casino Royale. All rights reserved.
        </p>
      </div>
       <LuxuryNav />
    </div>
  );
}