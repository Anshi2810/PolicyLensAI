import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, CheckCircle2, XCircle, IndianRupee, Calendar, Users, Percent } from 'lucide-react';

const schemeRules = [
  {
    name: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000/year to small & marginal farmer families',
    maxIncome: 200000,
    minAge: 18,
    maxAge: 70,
    categories: ['General', 'OBC', 'SC', 'ST'],
    amount: '₹6,000/year',
    icon: '🌾',
  },
  {
    name: 'MGNREGA',
    description: 'Guaranteed 100 days of wage employment per year to rural households',
    maxIncome: 300000,
    minAge: 18,
    maxAge: 65,
    categories: ['General', 'OBC', 'SC', 'ST'],
    amount: '₹202/day (100 days)',
    icon: '👷',
  },
  {
    name: 'PM Ujjwala Yojana',
    description: 'Free LPG connections to women from BPL families',
    maxIncome: 120000,
    minAge: 18,
    maxAge: 60,
    categories: ['OBC', 'SC', 'ST'],
    amount: '₹1,600 (one-time)',
    icon: '🔥',
  },
  {
    name: 'Ayushman Bharat (PM-JAY)',
    description: 'Health insurance cover of ₹5 lakh/family/year for hospitalization',
    maxIncome: 180000,
    minAge: 0,
    maxAge: 100,
    categories: ['General', 'OBC', 'SC', 'ST'],
    amount: '₹5,00,000/year',
    icon: '🏥',
  },
  {
    name: 'Sukanya Samriddhi Yojana',
    description: 'Savings scheme for girl child with 8.2% interest rate',
    maxIncome: 500000,
    minAge: 0,
    maxAge: 10,
    categories: ['General', 'OBC', 'SC', 'ST'],
    amount: '8.2% interest',
    icon: '👧',
  },
  {
    name: 'PM Awas Yojana',
    description: 'Housing subsidy for construction/renovation of houses',
    maxIncome: 300000,
    minAge: 21,
    maxAge: 65,
    categories: ['OBC', 'SC', 'ST'],
    amount: '₹1,20,000 - ₹1,50,000',
    icon: '🏠',
  },
  {
    name: 'National Pension Scheme (NPS)',
    description: 'Pension scheme for citizens in unorganized sector',
    maxIncome: 200000,
    minAge: 18,
    maxAge: 40,
    categories: ['General', 'OBC', 'SC', 'ST'],
    amount: '₹1,000 - ₹5,000/month',
    icon: '👴',
  },
];

export default function Eligibility() {
  const [income, setIncome] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState(null);
  const [checked, setChecked] = useState(false);

  const checkEligibility = (e) => {
    e.preventDefault();
    const inc = parseInt(income);
    const ag = parseInt(age);

    const eligible = schemeRules.filter(s =>
      inc <= s.maxIncome &&
      ag >= s.minAge &&
      ag <= s.maxAge &&
      s.categories.includes(category)
    );

    const ineligible = schemeRules.filter(s =>
      !eligible.includes(s)
    );

    setResults({ eligible, ineligible });
    setChecked(true);
  };

  const scorePct = results
    ? Math.round((results.eligible.length / schemeRules.length) * 100)
    : 0;

  // SVG parameters for radial gauge
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scorePct / 100) * circumference;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">Eligibility Engine</h1>
        <p className="page-subtitle">Check which government welfare schemes you qualify for</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card sticky top-4 border border-white/20 dark:border-slate-800/40"
          >
            <div className="p-5 border-b border-slate-200/40 dark:border-slate-800/40 bg-indigo-500/5">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500" />
                Enter Details
              </h3>
            </div>
            <form onSubmit={checkEligibility} className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                  Annual Income (₹)
                </label>
                <div className="relative group">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-sm"
                    placeholder="e.g. 150000"
                    value={income}
                    onChange={e => setIncome(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                  Age (Years)
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-sm"
                    placeholder="e.g. 35"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    required
                    min="0"
                    max="120"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                  Social Category
                </label>
                <div className="relative group">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <select
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-sm appearance-none cursor-pointer"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <ShieldCheck className="w-4 h-4" />
                Check Eligibility
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!checked ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-16 text-center border border-slate-200/40 dark:border-slate-800/40"
              >
                <ShieldCheck className="w-16 h-16 mx-auto mb-5 text-indigo-500 opacity-20" />
                <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Enter Details to Match</h4>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">We will calculate your profiles matching score against {schemeRules.length} registered governance welfare schemes.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Radial Matching Score Gauge */}
                <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-indigo-500/5 to-teal-500/5 border border-indigo-500/10">
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        className="text-slate-200 dark:text-slate-800"
                        strokeWidth={stroke}
                        stroke="currentColor"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                      <motion.circle
                        className="text-indigo-500"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black font-heading">{scorePct}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Match</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold font-heading">Scheme Compatibility Score</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on your details, you qualify for **{results.eligible.length} out of {schemeRules.length}** government schemes.</p>
                  </div>
                </div>

                {/* Eligible */}
                {results.eligible.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <CheckCircle2 className="w-5 h-5" />
                      Eligible Schemes ({results.eligible.length})
                    </h3>
                    <div className="space-y-4">
                      {results.eligible.map((s, i) => (
                        <motion.div
                          key={s.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="glass-card p-5 border-l-4 border-l-emerald-500 hover:-translate-y-1 hover:shadow-md duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/30">{s.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <h4 className="font-bold text-slate-800 dark:text-white text-base">{s.name}</h4>
                                <span className="badge-success">✓ Eligible</span>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{s.description}</p>
                              <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 flex-wrap">
                                <span className="flex items-center gap-1">💰 {s.amount}</span>
                                <span className="flex items-center gap-1">👤 Age: {s.minAge}-{s.maxAge}</span>
                                <span className="flex items-center gap-1">📊 Max Income: ₹{s.maxIncome.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ineligible */}
                {results.ineligible.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-base font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <XCircle className="w-5 h-5 text-slate-400" />
                      Incompatible Schemes ({results.ineligible.length})
                    </h3>
                    <div className="space-y-3">
                      {results.ineligible.map((s, i) => (
                        <motion.div
                          key={s.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: results.eligible.length * 0.08 + i * 0.04 }}
                          className="glass-card p-4 opacity-55 border-l-4 border-l-slate-300 dark:border-l-slate-800"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl opacity-75">{s.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.name}</h4>
                                <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/30 text-xs px-2.5 py-0.5 rounded-full">✗ Ineligible</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 font-medium">{s.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {results.eligible.length === 0 && (
                  <div className="glass-card p-12 text-center border border-slate-200/40 dark:border-slate-800/40">
                    <XCircle className="w-12 h-12 mx-auto mb-4 text-rose-500 opacity-40" />
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No matching schemes discovered</p>
                    <p className="text-sm text-slate-400 mt-1.5">Try altering your parameters to broaden match compatibility.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
