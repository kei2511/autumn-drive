import { useState, useRef } from "react";
import FileGrid from "./components/Files/FileGrid";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import FilePreviewModal from "./components/Modals/FilePreviewModal";
import SettingsModal from "./components/Modals/SettingsModal";
import Breadcrumbs from "./components/Navigation/Breadcrumbs";
import GlobalUploadProgress from "./components/Upload/GlobalUploadProgress";
import UploadWidget from "./components/Upload/UploadWidget";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useFileSystem } from "./hooks/useFileSystem";
import DragDropOverlay from "./components/UI/DragDropOverlay";
import { useUploadManager } from "./hooks/useUploadManager";
import AuthPage from "./components/Auth/AuthPage";

const API = import.meta.env.PROD ? "" : "http://localhost:3000";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const { session, signOut, user } = useAuth();

  // Core Logic extracted to Hook
  const {
    view,
    setView,
    stats,
    searchTerm,
    setSearchTerm,
    currentPath,
    setCurrentPath,
    refreshFiles,
    handleDelete,
    handleDeleteFolder,
    handleDownload,
    navigateToFolder,
    createFolder,
    displayFiles,
    displayFolders,
    activeOps,
  } = useFileSystem(API, session);

  // Upload Logic (Still complex, kept in its own hook)
  const uploadState = useUploadManager(API, () => {
    refreshFiles();
  }, session);

  // Drag Drop Logic
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      uploadState.processQueue(currentPath, droppedFiles);
    }
  };

  return (
    <div
      className="flex h-screen bg-[#0d0d12] overflow-hidden relative selection:bg-blue-500/30 selection:text-blue-200 font-sans"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <DragDropOverlay isDragging={isDragging} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onSignOut={signOut}
      />
      <FilePreviewModal file={previewFile} api={API} onClose={() => setPreviewFile(null)} />
      {view !== "dashboard" && <GlobalUploadProgress upload={uploadState} />}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Floating Island */}
      <div
        className={`fixed md:relative z-50 h-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <Sidebar
          stats={stats}
          view={view}
          setView={(v) => {
            setView(v);
            setCurrentPath("/");
          }}
          onSettingsClick={() => setSettingsOpen(true)}
        />
      </div>

      {/* Main Content - Floating Island */}
      <main className="flex-1 flex flex-col h-[calc(100%-2rem)] my-4 mr-4 rounded-3xl bg-glass-surface/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden relative z-10">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          view={view}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          stats={stats}
          api={API}
          user={user}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          <div className="max-w-7xl mx-auto">
            {/* Quick Actions / Navigation */}
            <div className="mb-8">
              {!searchTerm && view !== "recent" && (
                <Breadcrumbs
                  currentPath={currentPath}
                  setCurrentPath={setCurrentPath}
                  createFolder={createFolder}
                  view={view}
                />
              )}
            </div>

            {/* Upload Widget (Dashboard - Root) */}
            {view === "dashboard" && !searchTerm && currentPath === "/" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 animate-fade-in">
                  <div className="lg:col-span-2">
                    <div className="h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 relative overflow-hidden group shadow-lg shadow-blue-900/20">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
                      <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Upload Files</h2>
                        <p className="text-blue-100 mb-6 max-w-md">Drag and drop your files here or click to browse. We support images, videos, documents and more.</p>
                        <UploadWidget uploadState={uploadState} currentPath={currentPath} />
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white">Storage Status</h3>
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                      <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin duration-[3000ms]"></div>
                        <span className="text-3xl font-bold text-emerald-400">∞</span>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-white">Unlimited</p>
                        <p className="text-sm text-gray-400">Pro Plan Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    Recent Uploads
                  </h3>
                </div>
              </>
            )}

            {/* Upload Widget (Dashboard - Folder) */}
            {view === "dashboard" && !searchTerm && currentPath !== "/" && (
              <div className="mb-8 animate-fade-in">
                <UploadWidget uploadState={uploadState} currentPath={currentPath} />
              </div>
            )}

            {/* File Grids */}
            <div className={view !== "dashboard" ? "mt-0" : ""}>
              <FileGrid
                files={displayFiles}
                folders={displayFolders}
                api={API}
                onDelete={handleDelete}
                onFolderDelete={handleDeleteFolder}
                onDownload={handleDownload}
                activeOps={activeOps}
                onSelect={(file) => {
                  const ext = file.name.split(".").pop().toLowerCase();
                  if (["png", "jpg", "jpeg", "gif", "webp", "mp4", "webm", "mkv", "mov", "mp3", "wav", "ogg", "pdf"].includes(ext)) {
                    setPreviewFile(file);
                  }
                }}
                onFolderClick={navigateToFolder}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ctp-crust flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ctp-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthenticatedApp />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
