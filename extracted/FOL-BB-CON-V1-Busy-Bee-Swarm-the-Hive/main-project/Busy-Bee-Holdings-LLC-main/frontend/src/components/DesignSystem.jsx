import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  FiHome,
  FiDollarSign,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiBell,
  FiSearch,
  FiGrid,
  FiTarget,
  FiCheckSquare,
  FiTrendingUp,
  FiBarChart2,
  FiHelpCircle,
  FiCreditCard,
  FiFolder,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
  FiCommand,
  FiX,
  FiActivity,
  FiBriefcase,
  FiRepeat,
  FiHeart,
  FiBook,
  FiStar,
  FiUsers,
  FiMapPin,
  FiGlobe,
  FiAward,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

/**
 * Design System Navigation Item
 * Uses the single source of truth for styling
 */
const NavItem = ({ to, icon: Icon, label, isCollapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg',
        'transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-foreground-muted hover:bg-secondary hover:text-foreground',
        isCollapsed ? 'justify-center' : 'justify-start'
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon size={20} className={cn(isActive && 'text-primary-foreground')} />
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
};

/**
 * Design System Sidebar
 * Single source of truth for sidebar styling
 */
function Sidebar({ onClose, isCollapsed, isMobile = false }) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/domains', icon: FiFolder, label: 'Life Domains' },
        { to: '/goals', icon: FiTarget, label: 'Goals' },
        { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
      ],
    },
    {
      title: 'AI INTELLIGENCE',
      items: [
        { to: '/briefs', icon: FiZap, label: 'Executive Brief' },
        { to: '/tree', icon: FiGrid, label: 'Tree of Life' },
        { to: '/metatron', icon: FiBarChart2, label: 'Metatron' },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { to: '/my-analytics', icon: FiTrendingUp, label: 'My Analytics' },
        { to: '/finance', icon: FiDollarSign, label: 'Finance' },
        { to: '/health', icon: FiActivity, label: 'Health' },
        { to: '/career', icon: FiBriefcase, label: 'Career' },
        { to: '/mindset', icon: FiZap, label: 'Mindset' },
        { to: '/habits', icon: FiRepeat, label: 'Habits' },
        { to: '/relationships', icon: FiHeart, label: 'Relationships' },
        { to: '/education', icon: FiBook, label: 'Education' },
        { to: '/spirituality', icon: FiStar, label: 'Spirituality' },
        { to: '/family', icon: FiUsers, label: 'Family' },
        { to: '/recreation', icon: FiMapPin, label: 'Recreation' },
        { to: '/travel', icon: FiGlobe, label: 'Travel' },
      ],
    },
    {
      title: 'GAMIFICATION',
      items: [
        { to: '/gamification', icon: FiAward, label: 'Achievements' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { to: '/notifications', icon: FiBell, label: 'Notifications' },
        { to: '/subscription', icon: FiCreditCard, label: 'Subscription' },
        { to: '/help', icon: FiHelpCircle, label: 'Help' },
        { to: '/profile', icon: FiUser, label: 'Profile' },
        { to: '/settings', icon: FiSettings, label: 'Settings' },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card',
        isMobile ? 'w-full' : isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-5',
          isCollapsed ? 'justify-center' : 'justify-start'
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xl font-bold text-primary-foreground">B</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground">Busy Bee</span>
            <span className="text-xs text-foreground-muted">Executive Intelligence</span>
          </div>
        )}
      </div>

      {/* Toggle Button (Desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className="flex items-center justify-center mx-2 mb-4 p-2 rounded-lg text-foreground-muted hover:bg-secondary transition-colors"
        >
          {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      )}

      {/* Mobile Close Button */}
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-foreground-muted hover:bg-secondary"
        >
          <FiX size={20} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-1 space-y-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!isCollapsed && (
              <div className="px-4 py-2">
                <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
            )}
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                onClick={isMobile ? onClose : undefined}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-2 border-t border-border">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-primary">
              {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || profile?.username || 'User'}
              </p>
              <p className="text-xs text-foreground-muted truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 mx-0 mt-2 rounded-lg',
            'text-foreground-muted hover:bg-destructive/10 hover:text-destructive transition-colors',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

/**
 * Design System Header
 * Clean, minimal header following the design system
 */
function Header({ onMenuClick, isCollapsed }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-foreground-muted hover:bg-secondary transition-colors"
        >
          <FiMenu size={20} />
        </button>

        {/* Search Bar */}
        <div
          className={cn(
            'hidden md:flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-secondary/50 border border-border-subtle',
            'transition-all duration-200',
            searchFocused && 'ring-2 ring-primary/20 border-primary'
          )}
        >
          <FiSearch size={18} className="text-foreground-muted" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground-muted w-64"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 rounded bg-card text-xs text-foreground-muted border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Command Palette Button (Desktop) */}
        <button
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-foreground-muted hover:bg-secondary transition-colors"
          title="Command Palette"
        >
          <FiCommand size={18} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-foreground-muted hover:bg-secondary transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive"></span>
        </button>
      </div>
    </header>
  );
}

/**
 * Design System Layout
 * Main layout component that brings everything together
 */
function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside
          className={cn(
            'flex-shrink-0 border-r border-border transition-all duration-200',
            isCollapsed ? 'w-[72px]' : 'w-[260px]'
          )}
        >
          <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-200 lg:hidden',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar onClose={() => setIsMobileOpen(false)} isCollapsed={false} isMobile={true} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsMobileOpen(true)} isCollapsed={isCollapsed} />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { Sidebar, Header, Layout };
export default Layout;
