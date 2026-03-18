export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-3xl font-bebas tracking-tight">Dashboard <span className="italic-serif text-4xl lowercase select-none">Overview</span></h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Last Synchronized</p>
          <p className="text-xs font-medium">March 17, 2026 — 11:24 AM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue', value: '$24,500', trend: '+12%', icon: '01' },
          { label: 'Active Orders', value: '48', trend: '8 pending', icon: '02' },
          { label: 'Customers', value: '1,204', trend: '+45 recently', icon: '03' },
          { label: 'Cloud Status', value: 'Stable', trend: 'Latency 24ms', icon: '04' }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white border-thin relative group hover:border-ink/20 transition-colors">
            <span className="absolute top-2 right-4 font-bebas text-xl opacity-[0.05] group-hover:opacity-10">{stat.icon}</span>
            <p className="text-[12px] font-bold text-ink/40 uppercase tracking-wider mb-3">{stat.label}</p>
            <h3 className="text-3xl font-bebas tracking-tight">{stat.value}</h3>
            <p className="text-[10px] font-medium mt-4 tracking-widest opacity-40 uppercase">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-thin overflow-hidden">
          <div className="px-6 py-4 border-b border-ink/5 flex items-center justify-between">
            <h2 className="font-bebas text-xl tracking-wider">System Activity</h2>
            <button className="text-[12px] font-black text-ink/40 hover:text-ink uppercase tracking-widest">Full Log</button>
          </div>
          <div className="divide-y divide-ink/[0.03]">
            {[
              { msg: 'Global inventory synchronized with Cloudinary', time: '12m ago', type: 'System' },
              { msg: 'New membership approved: Sarah Jenkins', time: '1h ago', type: 'Audit' },
              { msg: 'Theme profile updated to "Editorial Premium"', time: '3h ago', type: 'Design' }
            ].map((log, i) => (
              <div key={i} className="px-6 py-4 flex justify-between items-center group hover:bg-cream/20 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-ink/5 group-hover:bg-ink group-hover:text-cream transition-colors">{log.type}</span>
                  <span className="text-sm font-medium tracking-tight text-ink/80">{log.msg}</span>
                </div>
                <span className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink text-cream p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <h1 className="text-[10vw] font-bebas">MANTRA</h1>
          </div>
          <div className="relative z-10">
            <h2 className="font-bebas text-3xl mb-4 tracking-widest">Mantra <br /> <span className="italic-serif text-2xl lowercase opacity-60">Intelligence</span></h2>
            <p className="text-sm leading-relaxed opacity-70 font-dm-sans">
              Algorithms are currently optimizing product placements based on customer interaction patterns.
            </p>
          </div>
          <button className="relative z-10 mt-8 border border-cream/20 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-cream hover:text-ink transition-all">
            Open Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
