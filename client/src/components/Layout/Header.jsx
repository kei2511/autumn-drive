import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

const Header = ({ setSidebarOpen, view, searchTerm, setSearchTerm, stats, user }) => {
  // Sync Status Logic (Mocked)
  const syncStatus = "Online";

  return (
    <header className="h-20 flex items-center justify-between px-8 shrink-0 z-20">
      {/* Search Bar - Floating & Centered (ish) */}
      <div className="flex items-center gap-6 flex-1">
        <button
          className="md:hidden p-2 text-ctp-text hover:bg-white/10 rounded-xl transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex flex-col">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {view === "dashboard" ? "Dashboard" : view === "files" ? "My Files" : "Recent Files"}
          </h2>
          <p className="text-xs text-gray-400 font-medium">Welcome back, {user?.email?.split('@')[0] || "User"}</p>
        </div>

        {/* Global Search */}
        <div className="relative max-w-lg w-full ml-12 hidden sm:block group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/5 text-sm text-white placeholder-gray-500 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg shadow-black/20"
            placeholder="Search files, folders, or types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 h-6 text-[10px] font-bold text-gray-500 bg-white/5 rounded border border-white/10">CTRL K</kbd>
          </div>
        </div>
      </div>

      {/* Profile / Actions */}
      <div className="flex items-center gap-5">

        {/* Sync Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 blur-sm animate-pulse"></div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">System {syncStatus}</span>
        </div>

        <button className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#1e1e2e]"></span>
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

        <button className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#1e1e2e] flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.email?.[0] || "U"}
            </div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-white leading-none group-hover:text-blue-400 transition-colors">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] text-gray-500 font-semibold tracking-wide">PRO PLAN</p>
          </div>
          <ChevronDown size={14} className="text-gray-500 group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Header;
