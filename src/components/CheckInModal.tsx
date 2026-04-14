import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Room } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Calendar, Hash, Loader2 } from "lucide-react";

interface CheckInModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (roomId: string, guestData: any) => Promise<void>;
}

export function CheckInModal({ room, isOpen, onClose, onCheckIn }: CheckInModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    duration: "2",
  });

  if (!room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all guest details");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const guestData = {
        name: formData.name,
        email: formData.email,
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 86400000 * parseInt(formData.duration)).toISOString(),
      };

      await onCheckIn(room.id, guestData);
      toast.success(`Guest ${formData.name} checked into Room ${room.number} successfully!`);
      onClose();
      setFormData({ name: "", email: "", duration: "2" });
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
            New Guest Check-In
            <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl text-sm font-bold">Room {room.number}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium pt-1">
            Fill in the guest information to complete the check-in process.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <User className="w-3 h-3" /> Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rachel Zane"
                className="h-12 bg-slate-50 border-none rounded-xl"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rachel@specterlitt.com"
                className="h-12 bg-slate-50 border-none rounded-xl"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Nights
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Room Type
                </Label>
                <div className="h-12 bg-slate-100 rounded-xl flex items-center px-4 font-bold text-slate-600 text-sm">
                  {room.type}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold h-12 text-slate-500" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl font-bold h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 px-8" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Check-In"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}