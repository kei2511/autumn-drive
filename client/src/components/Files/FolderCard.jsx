import { Folder, Trash2, Loader2, ChevronRight } from "lucide-react";

const FolderCard = ({ name, onClick, onDelete, isDeleting }) => {
  return (
    <div
      onClick={!isDeleting ? onClick : undefined}
      className={`group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-200 cursor-pointer relative overflow-hidden backdrop-blur-sm ${isDeleting ? "opacity-70 pointer-events-none" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center gap-4 relative z-10 min-w-0">
        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
          {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Folder size={20} fill="currentColor" />}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">
            {name}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Folder</p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(name);
          }}
          disabled={isDeleting}
          className="p-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
        <ChevronRight size={16} className="text-gray-600 group-hover:text-blue-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    </div>
  );
};

export default FolderCard;
