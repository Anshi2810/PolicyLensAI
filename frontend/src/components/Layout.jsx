import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Map, Lightbulb, MessageSquareWarning, ShieldCheck,
  FlaskConical, Sun, Moon, Bell, Menu, X, ChevronDown, Shield, Users,
  AlertTriangle, LogOut, Globe
} from 'lucide-react';

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/heatmap', label: 'Risk Heatmap', icon: Map },
  { to: '/insights', label: 'AI Insights', icon: Lightbulb },
  { to: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/simulation', label: 'Simulation', icon: FlaskConical },
];

const citizenLinks = [
  { to: '/eligibility', label: 'Check Eligibility', icon: ShieldCheck },
  { to: '/complaints', label: 'File Complaint', icon: MessageSquareWarning },
];

const notifications = [
  { id: 1, text: '3 new anomalies detected in Moradabad', time: '2 min ago', type: 'danger' },
  { id: 2, text: 'Risk score updated for Kanpur district', time: '15 min ago', type: 'warning' },
  { id: 3, text: 'New complaint filed from Agra', time: '1 hr ago', type: 'info' },
  { id: 4, text: 'Monthly report generated successfully', time: '3 hr ago', type: 'success' },
];

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const mode = role === 'Citizen' ? 'citizen' : 'admin';
  const links = mode === 'admin' ? adminLinks : citizenLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`glass-sidebar fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/40 dark:border-slate-800/40">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-400 flex items-center justify-center shadow-glow cursor-pointer"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold font-heading bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">PolicyLens AI</h1>
              <p className="text-[10px] text-surface-400 dark:text-surface-500 font-semibold uppercase tracking-wider">Governance Intelligence</p>
            </div>
          </div>
        </div>

        {/* Role Display */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2 py-2 px-3.5 rounded-xl text-sm font-semibold bg-indigo-50/50 dark:bg-indigo-950/20 w-full border border-indigo-100/50 dark:border-indigo-900/30">
            {mode === 'admin' ? (
              <>
                <Shield className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400">
                  {t("authority_portal") || "Authority Portal"}
                </span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 text-teal-500" />
                <span className="text-teal-600 dark:text-teal-400">
                  {t("citizen_portal") || "Citizen Portal"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 mt-4">
          <p className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-3 px-3">
            {mode === 'admin' ? 'Administration' : 'Citizen Services'}
          </p>
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-slate-100/40 dark:hover:bg-slate-900/40 hover:text-surface-900 dark:hover:text-surface-200'
                  }`
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarTab"
                    className="absolute inset-0 bg-indigo-50/60 dark:bg-indigo-950/25 border-l-4 border-indigo-500 dark:border-indigo-400 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{t(link.label.toLowerCase().replace(' ', '_')) || link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/40">
          <div className="glass-card p-4 bg-gradient-to-br from-indigo-500/5 to-teal-500/5 dark:from-indigo-500/10 dark:to-teal-500/10 rounded-xl border border-indigo-500/10">
            <p className="text-xs font-semibold text-surface-400 dark:text-surface-500">{t("system_status") || "System Status"}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{t("active") || "Active"} — Monitoring</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Alert Banner */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-rose-500 to-orange-500 text-white overflow-hidden shadow-md"
            >
              <div className="flex items-center justify-between px-6 py-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>⚠ High-risk alert: Moradabad district shows 30% higher anomaly rate than state average</span>
                </div>
                <button onClick={() => setShowAlert(false)} className="hover:bg-white/20 rounded p-1 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200/40 dark:border-slate-800/40 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-base font-bold font-heading text-surface-900 dark:text-surface-100">
                {t(links.find(l => l.to === location.pathname)?.label.toLowerCase().replace(' ', '_')) || 'PolicyLens AI'}
              </h2>
              <p className="text-[10px] text-surface-400 dark:text-surface-500 font-medium">Uttar Pradesh Governance Monitor</p>
            </div>
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-surface-600 dark:text-surface-400 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-all font-bold flex items-center gap-2 text-xs shadow-sm border border-slate-200/40 dark:border-slate-800/30"
              title={t("language") || "Language"}
            >
              <Globe className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">{i18n.language === 'en' ? 'EN' : 'HI'}</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-all duration-300 group border border-slate-200/40 dark:border-slate-800/30"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-45 transition-transform duration-500" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-all relative border border-slate-200/40 dark:border-slate-800/30"
              >
                <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 glass-card overflow-hidden z-50 shadow-xl border border-slate-200/40 dark:border-slate-800/50"
                  >
                    <div className="p-3.5 border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3.5 border-b border-slate-100 dark:border-slate-800/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition cursor-pointer">
                          <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{n.text}</p>
                          <p className="text-[10px] text-surface-400 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar & Logout */}
            <div className="flex items-center gap-2 border-l border-slate-200/40 dark:border-slate-800/40 pl-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/10">
                {mode === 'admin' ? 'A' : 'C'}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                title="Sign Out"
                className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page content with animated transitions */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
