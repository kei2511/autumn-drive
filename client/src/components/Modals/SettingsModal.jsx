import { Info, LogOut, Monitor, Moon, Shield, Sun, User, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const SettingsModal = ({ open, onClose, user, onSignOut }) => {
  const { addToast } = useToast();

  if (!open) return null;

  const handleThemeChange = (theme) => {
    // 1. Set DaisyUI theme for compat
    document.documentElement.setAttribute("data-theme", theme);

    // 2. Set Catppuccin Class (flavours: latte, mocha) - REMOVING old ones first
    document.documentElement.classList.remove("latte", "mocha", "frappe", "macchiato");
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
    addToast(`Theme changed to ${theme}`, "success");
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-ctp-base w-full max-w-md rounded-2xl border border-ctp-surface0/10 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-ctp-surface0/10 flex justify-between items-center bg-ctp-mantle/50">
          <h2 className="text-xl font-bold text-ctp-text flex items-center gap-2">
            <Shield size={20} className="text-ctp-blue" />
            Settings
          </h2>
          <button onClick={onClose} className="text-ctp-subtext0 hover:text-ctp-red transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Account Section */}
          {user && (
            <div>
              <h3 className="text-xs font-bold text-ctp-subtext0/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={14} /> Account
              </h3>
              <div className="bg-ctp-crust/50 rounded-xl p-4 border border-ctp-surface0/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ctp-blue/20 rounded-full flex items-center justify-center text-ctp-blue">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ctp-text truncate">{user.email}</p>
                    <p className="text-xs text-ctp-subtext0">Logged in</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full btn btn-sm bg-ctp-red/10 border-ctp-red/20 text-ctp-red hover:bg-ctp-red hover:text-ctp-base hover:border-ctp-red transition-all"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Theme Section */}
          <div>
            <h3 className="text-xs font-bold text-ctp-subtext0/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Monitor size={14} /> Appearance
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleThemeChange("mocha")}
                className="btn btn-outline btn-sm border-ctp-surface1/50 bg-ctp-surface0/20 text-ctp-text hover:bg-ctp-mantle hover:text-ctp-blue"
              >
                <Moon size={14} /> Mocha (Dark)
              </button>
              <button
                onClick={() => handleThemeChange("latte")}
                className="btn btn-outline btn-sm border-ctp-surface1/50 bg-ctp-surface0/20 text-ctp-text hover:bg-ctp-base hover:text-ctp-blue"
              >
                <Sun size={14} /> Latte (Light)
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="text-xs font-bold text-ctp-subtext0/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Info size={14} /> System Info
            </h3>
            <div className="bg-ctp-crust/50 rounded-xl p-4 border border-ctp-surface0/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ctp-subtext0">Client Version</span>
                <span className="text-ctp-text font-mono">v3.2.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ctp-subtext0">Protocol</span>
                <span className="text-ctp-teal font-mono">Secure // Chunked</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ctp-subtext0">Encryption</span>
                <span className="text-ctp-green font-mono">AES-256-CTR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ctp-subtext0">Auth</span>
                <span className="text-ctp-blue font-mono">Supabase JWT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ctp-surface0/10 bg-ctp-crust/50 flex justify-end">
          <button onClick={onClose} className="btn btn-ghost btn-sm text-ctp-text hover:bg-ctp-surface0/10">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
