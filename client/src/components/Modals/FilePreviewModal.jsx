import { Download, Music, X } from "lucide-react";
import { useEffect, useState } from "react";

const FilePreviewModal = ({ file, api, onClose }) => {
  const [objectUrl, setObjectUrl] = useState(null);

  // Close on Escape & Cleanup
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (file) {
      setObjectUrl(`${api}/download/${file.name}`);
    }
  }, [file, api]);

  if (!file) return null;

  const getExt = (name) => name.split(".").pop().toLowerCase();
  const ext = getExt(file.name);
  const isVideo = ["mp4", "webm", "mkv", "mov"].includes(ext);
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
  const isPdf = ["pdf"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg"].includes(ext);

  const renderContent = () => {
    if (!objectUrl) return null;

    if (isVideo) return <video src={objectUrl} controls autoPlay className="max-w-full max-h-full shadow-2xl rounded-lg" />;
    if (isImage) return <img src={objectUrl} alt={file.name} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />;
    if (isAudio)
      return (
        <div className="w-full max-w-md p-8 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/5 flex flex-col items-center gap-6 animate-scale-in">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center animate-pulse relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
            <Music size={48} className="text-blue-400 relative z-10" />
          </div>
          <div className="text-center">
            <h3 className="text-white font-bold truncate max-w-xs">{file.name}</h3>
            <p className="text-sm text-gray-500">Audio Preview</p>
          </div>
          <audio src={objectUrl} controls className="w-full" />
        </div>
      );
    if (isPdf) return <iframe src={objectUrl} className="w-full h-full bg-white rounded-lg" title="PDF Preview" />;

    return (
      <div className="text-center">
        <p className="text-gray-400 mb-6">Preview not supported for this file type.</p>
        <a href={`${objectUrl}?download=true`} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 inline-flex items-center gap-2">
          <Download size={18} /> Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-6xl h-[85vh] flex flex-col bg-[#181825] rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-white/5">
        {/* Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-black/20 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              {isImage ? <span className="text-xs font-bold uppercase">IMG</span> :
                isVideo ? <span className="text-xs font-bold uppercase">VID</span> :
                  isAudio ? <span className="text-xs font-bold uppercase">AUD</span> :
                    <span className="text-xs font-bold uppercase">FILE</span>}
            </div>
            <div className="font-bold text-gray-200 truncate">{file.name}</div>
          </div>
          <div className="flex items-center gap-2">
            {objectUrl && (
              <a
                href={`${objectUrl}?download=true`}
                download={file.name}
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
                title="Download"
              >
                <Download size={20} />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e1e2e] to-[#0d0d12] flex items-center justify-center relative overflow-hidden p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
