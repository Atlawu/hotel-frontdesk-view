import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isUp: boolean };
  color: string;
}

export function StatsCard({ label, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 relative overflow-hidden group border-none shadow-sm bg-white hover:shadow-md transition-shadow">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
          <Icon className={`w-12 h-12 text-${color}-600`} />
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {trend && (
              <span className={`flex items-center text-xs font-semibold mb-1 ${trend.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                {trend.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        
        <div className={`h-1.5 w-full bg-${color}-100 absolute bottom-0 left-0 rounded-full`}>
          <div className={`h-full bg-${color}-500 transition-all duration-1000`} style={{ width: '60%' }} />
        </div>
      </Card>
    </motion.div>
  );
}