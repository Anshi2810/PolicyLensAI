import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  AlertTriangle, Users, IndianRupee, ShieldAlert, Eye,
  ChevronRight, ArrowUpRight, ArrowDownRight, X, Sparkles
} from 'lucide-react';
import { fetchAPI, formatCurrency } from '../lib/utils';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    const duration = 1200;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString('en-IN')}{suffix}</span>;
}

// Premium custom chart tooltip
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border border-indigo-500/20 shadow-xl bg-white/95 dark:bg-slate-950/95">
        <p className="font-heading font-bold text-slate-800 dark:text-white mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-4 text-xs font-semibold justify-between">
              <span className="flex items-center gap-1.5" style={{ color: item.fill || item.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill || item.color }} />
                {item.name}:
              </span>
              <span className="text-slate-900 dark:text-slate-200">
                {typeof item.value === 'number' && item.name.includes('Amount') ? formatCurrency(item.value) : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [riskScores, setRiskScores] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [drillDistrict, setDrillDistrict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAPI('/risk-score'),
      fetchAPI('/anomalies'),
      fetchAPI('/data'),
    ]).then(([risk, anom, data]) => {
      setRiskScores(risk);
      setAnomalies(anom);
      setAllData(data);
      setLoading(false);
    });
  }, []);

  const totalBeneficiaries = allData.length;
  const totalAnomalies = anomalies.length;
  const totalAmount = allData.reduce((s, r) => s + r.amount, 0);
  const anomalyAmount = anomalies.reduce((s, r) => s + r.amount, 0);

  // Scheme-wise chart data
  const schemes = [...new Set(allData.map(r => r.scheme))];
  const schemeData = schemes.map(s => ({
    name: s,
    total: allData.filter(r => r.scheme === s).length,
    anomalies: allData.filter(r => r.scheme === s && r.status === 'anomaly').length
  }));

  // Drill down data
  const districtData = drillDistrict
    ? allData.filter(r => r.district === drillDistrict)
    : [];

  // Top fraud cases
  const topFraud = [...anomalies].sort((a, b) => (b.confidence || 0) - (a.confidence || 0)).slice(0, 5);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-400 font-semibold text-sm">Synchronizing Governance Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Real-time governance analytics & anomaly monitoring</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Governance Stream
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <motion.div variants={item} className="stat-card hover:border-indigo-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/30">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="badge-info">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tight"><AnimatedCounter value={totalBeneficiaries} /></p>
          <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mt-1">Total Beneficiaries</p>
        </motion.div>

        <motion.div variants={item} className="stat-card hover:border-rose-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100/50 dark:border-rose-900/30">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <span className="badge-danger">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +8%
            </span>
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tight text-rose-500"><AnimatedCounter value={totalAnomalies} /></p>
          <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mt-1">Anomalies Flagged</p>
        </motion.div>

        <motion.div variants={item} className="stat-card hover:border-emerald-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30">
              <IndianRupee className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="badge-success">
              <ArrowDownRight className="w-3 h-3 mr-1" /> -3%
            </span>
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tight text-emerald-500">{formatCurrency(totalAmount)}</p>
          <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mt-1">Total Disbursed</p>
        </motion.div>

        <motion.div variants={item} className="stat-card hover:border-amber-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/30">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            <span className="badge-warning">
              Risk Level
            </span>
          </div>
          <p className="text-3xl font-extrabold font-heading tracking-tight text-amber-500">{formatCurrency(anomalyAmount)}</p>
          <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mt-1">Suspicious Volume</p>
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* District Risk Bar Chart */}
        <motion.div variants={item} initial="hidden" animate="show" className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold font-heading">District Risk Analytics</h3>
              <p className="text-xs text-slate-400">Click a bar to view detailed district data</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskScores} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, #e2e8f0)" opacity={0.15} vertical={false} />
              <XAxis dataKey="district" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 }} />
              <Bar dataKey="riskScore" name="Risk Score" radius={[6, 6, 0, 0]}>
                {riskScores.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.riskLevel === 'High' ? '#f43f5e' : entry.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'}
                    className="cursor-pointer transition-all duration-300 hover:brightness-110"
                    onClick={() => setDrillDistrict(entry.district)}
                  />
                ))}
              </Bar>
              <Bar dataKey="anomalyCount" name="Anomalies" fill="#a5b4fc" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scheme Pie Chart */}
        <motion.div variants={item} initial="hidden" animate="show" className="glass-card p-6">
          <h3 className="text-base font-bold font-heading mb-6">Anomalies by Scheme</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={schemeData.filter(s => s.anomalies > 0)}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                dataKey="anomalies"
                nameKey="name"
                paddingAngle={4}
              >
                {schemeData.filter(s => s.anomalies > 0).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} className="cursor-pointer transition-all duration-300 hover:brightness-105" />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Drill-down panel */}
      <AnimatePresence>
        {drillDistrict && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="glass-card mb-8 overflow-hidden border border-indigo-500/20"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200/40 dark:border-slate-800/40 bg-indigo-500/5">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold font-heading">Drill Down: {drillDistrict}</h3>
                <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold border border-indigo-200/50 dark:border-indigo-900/30 text-xs px-2.5 py-0.5 rounded-full ml-2">
                  {districtData.length} Records
                </span>
              </div>
              <button onClick={() => setDrillDistrict(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Scheme</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {districtData.map(row => (
                    <tr key={row.beneficiary_id} className="table-row" onClick={() => row.status === 'anomaly' && setSelectedAnomaly(row)}>
                      <td className="table-cell font-mono text-xs text-indigo-500">{row.beneficiary_id}</td>
                      <td className="table-cell font-bold">{row.name}</td>
                      <td className="table-cell">{row.scheme}</td>
                      <td className="table-cell font-semibold">{formatCurrency(row.amount)}</td>
                      <td className="table-cell text-slate-500">{row.date}</td>
                      <td className="table-cell">
                        <span className={row.status === 'anomaly' ? 'badge-danger' : 'badge-success'}>
                          {row.status === 'anomaly' ? '⚠ Anomaly' : '✓ Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anomaly Table + Top Fraud */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomaly Table */}
        <div className="lg:col-span-2 table-container border border-slate-200/40 dark:border-slate-800/40">
          <div className="p-5 border-b border-slate-200/40 dark:border-slate-800/40">
            <h3 className="text-base font-bold font-heading">Anomaly Detection Log</h3>
            <p className="text-xs text-surface-400 mt-1">Select any record to invoke explainable AI diagnostic</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">District</th>
                  <th className="table-header">Scheme</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map(row => (
                  <tr
                    key={row.beneficiary_id}
                    className={`table-row transition-all ${selectedAnomaly?.beneficiary_id === row.beneficiary_id ? 'bg-indigo-500/10 dark:bg-indigo-500/15 border-l-4 border-l-indigo-500' : ''}`}
                    onClick={() => setSelectedAnomaly(row)}
                  >
                    <td className="table-cell font-mono text-xs text-indigo-500">{row.beneficiary_id}</td>
                    <td className="table-cell font-bold">{row.name}</td>
                    <td className="table-cell">{row.district}</td>
                    <td className="table-cell">{row.scheme}</td>
                    <td className="table-cell font-bold text-rose-500">{formatCurrency(row.amount)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                            style={{ width: `${row.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-rose-500">{row.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainable AI Panel / Top Fraud */}
        <div className="space-y-6">
          {/* ExplainableAI Panel */}
          <motion.div
            className="glass-card overflow-hidden border border-indigo-500/20"
            initial={false}
            animate={{ height: selectedAnomaly ? 'auto' : 'auto' }}
          >
            <div className="p-5 border-b border-slate-200/40 dark:border-slate-800/40 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex items-center justify-between">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                Explainable AI Diagnostic
              </h3>
              {selectedAnomaly && (
                <button onClick={() => setSelectedAnomaly(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {selectedAnomaly ? (
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Subject Identity</p>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedAnomaly.name}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{selectedAnomaly.beneficiary_id} · {selectedAnomaly.district}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Isolation Risk Index</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-850 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-red-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedAnomaly.confidence}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-lg font-black text-rose-500">{selectedAnomaly.confidence}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Algorithmic Justifications</p>
                  <div className="space-y-2">
                    {selectedAnomaly.reasons.map((r, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">{r}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disbursed Scheme</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{selectedAnomaly.scheme}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claimed Amount</p>
                      <p className="text-sm font-bold text-rose-500 mt-1">{formatCurrency(selectedAnomaly.amount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-500" />
                <p className="text-sm font-semibold">Select an anomaly record to compile AI diagnostic report.</p>
              </div>
            )}
          </motion.div>

          {/* Top Fraud Cases */}
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-900/10">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                Top Fraud Targets
              </h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {topFraud.map((f, i) => (
                <div
                  key={f.beneficiary_id}
                  className="p-4 hover:bg-slate-100/30 dark:hover:bg-slate-900/30 transition cursor-pointer"
                  onClick={() => setSelectedAnomaly(f)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-xs font-bold text-rose-600 dark:text-rose-400">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{f.name}</p>
                        <p className="text-xs text-slate-400 font-semibold">{f.district} · {f.scheme}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-rose-500">{f.confidence}%</p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{formatCurrency(f.amount)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
