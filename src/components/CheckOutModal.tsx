import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Room } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Receipt, AlertCircle, Loader2 } from "lucide-react";

interface CheckOutModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckOut: (roomId: string) => Promise<void>;
}

export function CheckOutModal({ room, isOpen, onClose, onCheckOut }: CheckOutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!room || !room.guest) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onCheckOut(room.id);
      toast.success(`Guest ${room.guest?.name} checked out from Room ${room.number}. Housekeeping alerted.`);
      onClose();
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
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <DialogTitle className="text-center text-2xl font-black text-slate-900">
            Confirm Check-Out?
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 font-medium">
            Room <span className="font-bold text-slate-900">{room.number}</span> will be marked as <span className="font-bold text-amber-600 underline underline-offset-4">Vacant-Dirty</span> for housekeeping.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-50 p-6 rounded-2xl my-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-bold uppercase tracking-tight">Guest</span>
            <span className="font-black text-slate-800">{room.guest.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-bold uppercase tracking-tight">Confirmation</span>
            <span className="font-mono text-slate-800 font-bold">{room.guest.confirmationNumber}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-slate-900 font-bold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" /> Total Balance
            </span>
            <span className="text-indigo-600 font-black text-lg">$450.00</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            onClick={handleConfirm} 
            disabled={isSubmitting}
            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Process Payment & Check Out"}
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="w-full h-12 font-bold text-slate-500 rounded-xl">
            Go Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}