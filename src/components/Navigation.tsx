import { Search, Bell, User, Calendar, Settings, LayoutDashboard, DoorOpen, Users, ClipboardList, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            placeholder="Search by Guest Name or Confirmation Number..." 
            className="pl-12 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 text-md"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 ml-8">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-sm font-bold text-slate-800">Reception Desk #1</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Front Office</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-slate-500 relative bg-slate-50 hover:bg-slate-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-100">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: DoorOpen, label: "Rooms" },
    { icon: Users, label: "Guests" },
    { icon: Calendar, label: "Bookings" },
    { icon: ClipboardList, label: "Housekeeping" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen flex flex-col border-r border-slate-800 fixed left-0 top-0 z-20 overflow-hidden">
      <div className="p-8 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden bg-white">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/80277211-d054-43ce-8e9f-cba0aefbcf32/hotel-logo-2d4c90b4-1776106232281.webp" 
            alt="InnSync Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-white font-black text-xl tracking-tight uppercase">Inn<span className="text-indigo-400">Sync</span></span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
              item.active 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? "text-white" : "text-slate-500 group-hover:text-indigo-400"} transition-colors`} />
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-sm">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}