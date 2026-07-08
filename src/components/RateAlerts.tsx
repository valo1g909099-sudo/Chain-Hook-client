import { Bell } from 'lucide-react';

export default function RateAlerts() {
  return (
    <div className="bg-[#1C1C24]/20 backdrop-blur-sm p-4 rounded-2xl border border-[#1C1C24] shadow-lg">
      <h3 className="text-xs font-semibold text-white mb-3">Rate Alerts</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2.5 bg-[#0D0D12] rounded-lg">
            <span className="text-[10px] text-white">USD/EUR &gt; 0.95</span>
            <Bell size={14} className="text-[#9A9AA5]"/>
        </div>
      </div>
    </div>
  );
}
