import { useState, useMemo, useEffect } from "react";
import { Sidebar, Header } from "./components/Navigation";
import { StatsCard } from "./components/StatsCard";
import { RoomCard } from "./components/RoomCard";
import { CheckInModal } from "./components/CheckInModal";
import { CheckOutModal } from "./components/CheckOutModal";
import { Room, Guest } from "./types";
import { Users, LogIn, LogOut, BedDouble, ChevronRight } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./lib/supabase";
import { toast } from "sonner";

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          bookings!bookings_room_id_fkey (
            id,
            status,
            check_in,
            check_out,
            guests (
              id,
              full_name,
              email
            )
          )
        `)
        .order('number', { ascending: true });

      if (error) throw error;

      const mappedRooms: Room[] = (data || []).map(room => {
        const activeBooking = room.bookings?.find((b: any) => b.status === 'Checked-in');
        return {
          id: room.id,
          number: room.number,
          type: room.type,
          status: room.status,
          guest: activeBooking ? {
            id: activeBooking.guests.id,
            name: activeBooking.guests.full_name,
            email: activeBooking.guests.email,
            confirmationNumber: activeBooking.id.split('-')[0].toUpperCase(),
            checkIn: activeBooking.check_in,
            checkOut: activeBooking.check_out,
            avatar: `https://i.pravatar.cc/150?u=${activeBooking.guests.id}`
          } : undefined
        };
      });

      setRooms(mappedRooms);
    } catch (error: any) {
      console.error("Error fetching rooms:", error.message);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Subscribe to changes in rooms and bookings to make it reactive
    const roomsChannel = supabase.channel('room_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => fetchRooms())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchRooms())
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
    };
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const occupied = rooms.filter(r => r.status === "Occupied").length;
    const arrivals = 8; // Mocked or could be fetched from bookings
    const departures = 5; // Mocked or could be fetched from bookings
    const stayovers = occupied - arrivals;
    const occupancyRate = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

    return [
      { label: "Arrivals", value: arrivals, icon: LogIn, color: "indigo" },
      { label: "Departures", value: departures, icon: LogOut, color: "rose" },
      { label: "Stay-overs", value: Math.max(0, stayovers), icon: Users, color: "emerald" },
      { label: "Occupancy %", value: `${occupancyRate}%`, icon: BedDouble, color: "blue", trend: { value: 12, isUp: true } },
    ];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return rooms;
    return rooms.filter(room => 
      room.number.includes(query) || 
      room.guest?.name.toLowerCase().includes(query) || 
      room.guest?.confirmationNumber.toLowerCase().includes(query)
    );
  }, [rooms, searchQuery]);

  const handleCheckIn = async (roomId: string, guestData: any) => {
    try {
      // 1. Create guest or get existing
      const { data: guest, error: guestError } = await supabase
        .from('guests')
        .upsert({ 
          full_name: guestData.name, 
          email: guestData.email 
        }, { onConflict: 'email' })
        .select()
        .single();

      if (guestError) throw guestError;

      // 2. Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          room_id: roomId,
          guest_id: guest.id,
          check_in: guestData.checkIn,
          check_out: guestData.checkOut,
          status: 'Checked-in'
        });

      if (bookingError) throw bookingError;

      // 3. Update room status
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ status: 'Occupied' })
        .eq('id', roomId);

      if (roomError) throw roomError;

    } catch (error: any) {
      console.error("Error during check-in:", error.message);
      toast.error("Check-in failed");
    }
  };

  const handleCheckOut = async (roomId: string) => {
    try {
      // 1. Find the active booking for this room
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', roomId)
        .eq('status', 'Checked-in')
        .single();

      if (fetchError) throw fetchError;

      // 2. Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'Checked-out' })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // 3. Update room status to Vacant-Dirty
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ status: 'Vacant-Dirty' })
        .eq('id', roomId);

      if (roomError) throw roomError;

    } catch (error: any) {
      console.error("Error during check-out:", error.message);
      toast.error("Check-out failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Sidebar />
      
      <main className="flex-1 pl-72">
        <Header onSearch={setSearchQuery} />
        
        <div className="p-8 max-w-[1600px] mx-auto space-y-10">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Front Office Dashboard</h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                Good morning, Receptionist! <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> Today is {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                New Booking <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </section>

          {/* Room Status Legend & Grid */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-4 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
              <h2 className="text-xl font-black text-slate-800">Room Status Grid</h2>
              <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" /> Occupied
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" /> Vacant-Clean
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" /> Vacant-Dirty
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" /> Out-of-Order
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRooms.map((room) => (
                    <RoomCard 
                      key={room.id} 
                      room={room} 
                      onCheckIn={(r) => { setSelectedRoom(r); setIsCheckInOpen(true); }}
                      onCheckOut={(r) => { setSelectedRoom(r); setIsCheckOutOpen(true); }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BedDouble className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-bold">No rooms match your search query.</p>
                <button onClick={() => setSearchQuery("")} className="mt-4 text-indigo-600 font-black hover:underline underline-offset-4">
                  Clear Search
                </button>
              </div>
            )}
          </section>
        </div>

        <CheckInModal 
          room={selectedRoom} 
          isOpen={isCheckInOpen} 
          onClose={() => setIsCheckInOpen(false)} 
          onCheckIn={handleCheckIn}
        />
        
        <CheckOutModal 
          room={selectedRoom} 
          isOpen={isCheckOutOpen} 
          onClose={() => setIsCheckOutOpen(false)} 
          onCheckOut={handleCheckOut}
        />
        
        <Toaster position="top-right" expand={true} richColors theme="light" />
      </main>
    </div>
  );
}