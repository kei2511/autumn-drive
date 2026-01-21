import { Info, LogOut, Monitor, Moon, Shield, Sun, User, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const SettingsModal = ({ open, onClose, user, onSignOut }) => {
  const { addToast } = useToast();

  if (!open) return null;

  const handleThemeChange = (theme) => {
    // Legacy support or just mock for now as we are enforcing dark mode premium
    addToast(`Theme switching is managed by system`, "info");
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
      addToast("Signed out successfully", "success");
      onClose();
    } catch (e) {
      addToast("Failed to sign out", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#181825] w-full max-w-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative animate-scale-in">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

        {/* Header */}
        <div className="p-6 flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            <Shield size={22} className="text-blue-500" />
            Settings
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-6 relative z-10">
          {/* Account Section */}
          {user && (
            <div>
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={12} /> Account
              </h3>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    <p className="text-xs text-gray-400">Pro Plan Member</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Info size={12} /> System Info
            </h3>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
              <InfoRow label="Client Version" value="v4.0.0-beta" valueColor="text-gray-300" />
              <InfoRow label="Protocol" value="Secure // Chunked" valueColor="text-emerald-400" />
              <InfoRow label="Encryption" value="AES-256-CTR" valueColor="text-blue-400" />
              <InfoRow label="Auth Provider" value="Supabase JWT" valueColor="text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, valueColor }) => (
  <div className="flex justify-between text-sm items-center">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`${valueColor} font-mono font-bold tracking-tight bg-white/5 px-2 py-0.5 rounded text-xs`}>{value}</span>
  </div>
);

export default SettingsModal;
