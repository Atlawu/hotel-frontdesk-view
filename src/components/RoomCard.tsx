import { Room, RoomStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Info, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: Room;
  onCheckIn: (room: Room) => void;
  onCheckOut: (room: Room) => void;
}

const statusColors: Record<RoomStatus, string> = {
  "Occupied": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Vacant-Clean": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Vacant-Dirty": "bg-amber-50 text-amber-700 border-amber-200",
  "Out-of-Order": "bg-rose-50 text-rose-700 border-rose-200",
};

const dotColors: Record<RoomStatus, string> = {
  "Occupied": "bg-indigo-500",
  "Vacant-Clean": "bg-emerald-500",
  "Vacant-Dirty": "bg-amber-500",
  "Out-of-Order": "bg-rose-500",
};

export function RoomCard({ room, onCheckIn, onCheckOut }: RoomCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`relative p-5 rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-52 group`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-3xl font-black text-slate-800 tracking-tight">{room.number}</span>
          <span className="text-xs font-semibold text-slate-400 uppercase">{room.type}</span>
        </div>
        <Badge variant="outline" className={`${statusColors[room.status]} font-bold px-2.5 py-1 rounded-lg border-2 shadow-sm`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${dotColors[room.status]} animate-pulse`} />
          {room.status}
        </Badge>
      </div>

      <div className="mt-4 flex-grow">
        {room.guest ? (
          <div className="flex items-center gap-3">
            <img src={room.guest.avatar} alt={room.guest.name} className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover shadow-sm" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 line-clamp-1">{room.guest.name}</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{room.guest.confirmationNumber}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center h-10 italic text-slate-400 text-sm">
            Ready for next guest
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2 pt-4 border-t border-slate-50">
        {room.status === "Occupied" ? (
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 font-bold border border-rose-100 rounded-xl transition-all active:scale-95"
            onClick={() => onCheckOut(room)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Check Out
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-bold border border-indigo-100 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            disabled={room.status !== "Vacant-Clean"}
            onClick={() => onCheckIn(room)}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Check In
          </Button>
        )}
        <Button size="icon" variant="outline" className="w-10 h-10 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-colors">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}