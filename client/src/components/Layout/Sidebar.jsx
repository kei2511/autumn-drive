import { Clock, Cloud, HardDrive, LayoutDashboard, Settings, Video, Image as ImageIcon, Music, FileText, ChevronRight } from "lucide-react";

const Sidebar = ({ stats, view, setView, onSettingsClick }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "files", label: "My Files", icon: <HardDrive size={20} /> },
    { id: "recent", label: "Recent", icon: <Clock size={20} /> },
  ];

  return (
    <aside className="glass-panel w-full md:w-64 h-[calc(100%-2rem)] m-4 rounded-3xl flex flex-col relative overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:bg-glass-surface/80">

      {/* Brand */}
      <div className="p-6 relative z-10 flex flex-col items-center">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-3 animate-float">
          <Cloud size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">autumn<span className="text-blue-400">drive</span></h1>
        <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-1">Personal Cloud</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto relative z-10 scrollbar-hide py-2">
        <div className="text-[10px] uppercase font-bold text-gray-500 px-4 mb-2 tracking-widest mt-2">Menu</div>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 group/btn relative overflow-hidden ${view === item.id
              ? "bg-white/10 text-white shadow-lg border border-white/5"
              : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
          >
            <div className={`absolute inset-0 bg-blue-500/10 blur-xl transition-opacity duration-300 ${view === item.id ? 'opacity-100' : 'opacity-0'}`} />
            <div className="flex items-center gap-3 relative z-10">
              <div className={`transition-transform duration-300 ${view === item.id ? 'scale-110 text-blue-400' : 'group-hover/btn:scale-110'}`}>
                {item.icon}
              </div>
              <span className="tracking-wide">{item.label}</span>
            </div>
            {view === item.id && <ChevronRight size={14} className="text-blue-400" />}
          </button>
        ))}

        <div className="text-[10px] uppercase font-bold text-gray-500 px-4 mt-8 mb-3 tracking-widest">
          Storage
        </div>

        {/* Improved Storage Widget */}
        <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-5 border border-white/5 relative overflow-hidden mx-1">
          <div className="flex justify-between items-end mb-3">
            <span className="text-2xl font-bold text-white">{formatSize(stats.size)}</span>
            <span className="text-[10px] text-gray-400 mb-1">used of 50 GB</span>
          </div>

          <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((stats.size / (50 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
            />
          </div>

          <div className="space-y-3">
            <SimpleStorageItem icon={<Video size={10} />} label="Videos" count={stats.types?.video} color="text-pink-400" />
            <SimpleStorageItem icon={<ImageIcon size={10} />} label="Images" count={stats.types?.image} color="text-blue-400" />
            <SimpleStorageItem icon={<FileText size={10} />} label="Docs" count={stats.types?.other} color="text-emerald-400" />
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 relative z-10">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-white transition-all text-sm hover:bg-white/5 border border-transparent hover:border-white/5 group"
        >
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

const SimpleStorageItem = ({ icon, label, count = 0, color }) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-2.5 text-gray-400 group-hover:text-gray-300 transition-colors">
      <div className={`${color} p-1.5 rounded-lg bg-white/5`}>{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 py-0.5 rounded-md min-w-[24px] text-center">{count}</span>
  </div>
);

const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export default Sidebar;
