import { Archive, Download, FileImage, FileText, FileVideo, Music, Trash2, Loader2, MoreVertical } from "lucide-react";

const FileCard = ({ file, api, onDelete, onDownload, activeOps, onClick }) => {
  const size = (file.size / 1024 / 1024).toFixed(2);
  const ext = file.type || file.name.split(".").pop().toLowerCase();

  const isDeleting = activeOps?.deleting?.has(file.name);
  const isDownloading = activeOps?.downloading?.has(file.name);
  const isLoading = isDeleting || isDownloading;

  const getIcon = () => {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
      return { icon: <FileImage size={28} />, color: "text-blue-400", bg: "bg-blue-500/20", glow: "shadow-blue-500/20" };
    if (["mp4", "mkv", "webm", "mov"].includes(ext))
      return { icon: <FileVideo size={28} />, color: "text-pink-400", bg: "bg-pink-500/20", glow: "shadow-pink-500/20" };
    if (["mp3", "wav", "ogg"].includes(ext))
      return { icon: <Music size={28} />, color: "text-emerald-400", bg: "bg-emerald-500/20", glow: "shadow-emerald-500/20" };
    if (["zip", "rar", "7z"].includes(ext))
      return { icon: <Archive size={28} />, color: "text-yellow-400", bg: "bg-yellow-500/20", glow: "shadow-yellow-500/20" };

    return { icon: <FileText size={28} />, color: "text-gray-200", bg: "bg-white/10", glow: "shadow-white/10" };
  };

  const { icon, color, bg, glow } = getIcon();
  const dateStr = file.date
    ? new Date(file.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      onClick={!isLoading ? onClick : undefined}
      className={`group flex flex-col p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl h-full cursor-pointer relative overflow-hidden backdrop-blur-sm ${isLoading ? "opacity-70 pointer-events-none" : ""
        }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:translate-x-5 transition-transform duration-700`} />

      {/* Top: Icon + Info */}
      <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
        <div className={`p-3.5 rounded-2xl ${bg} ${color} shadow-lg ${glow} shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}>
          {isLoading ? <Loader2 size={28} className="animate-spin" /> : icon}
        </div>

        <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="mt-auto relative z-10">
        <h3 className="text-base font-bold text-gray-100 truncate mb-1 group-hover:text-blue-400 transition-colors" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400">{size} MB</span>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">{ext}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium">{dateStr}</span>
        </div>
      </div>

      {/* Hover Actions Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(file);
          }}
          disabled={isLoading}
          className="p-3 rounded-xl bg-white text-black hover:scale-110 transition-transform shadow-lg"
          title="Download"
        >
          {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.name);
          }}
          disabled={isLoading}
          className="p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all shadow-lg shadow-red-500/20"
          title="Delete"
        >
          {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default FileCard;
