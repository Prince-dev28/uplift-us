import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Brain, SmilePlus, BookOpen, User, Phone, LogOut, Menu, X, Activity, FileText, Wind, Flower2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/store";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assessment", label: "Assessment", icon: Brain },
  { to: "/mood", label: "Mood Tracker", icon: SmilePlus },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/insights", label: "Insights", icon: Activity },
  { to: "/weekly-report", label: "Weekly Report", icon: FileText },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
  { to: "/breathing", label: "Breathing", icon: Wind },
  { to: "/meditation", label: "Meditation", icon: Flower2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/emergency", label: "Emergency", icon: Phone },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-surface flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card shadow-card border-r border-border p-6 fixed h-full z-30 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MindCare</span>
        </Link>
        <nav className="flex-1 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? "gradient-calm text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all mt-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">MindCare</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -200 }}
          className="lg:hidden fixed inset-0 z-30 bg-card pt-16 p-6 overflow-y-auto"
        >
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? "gradient-calm text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </motion.div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
