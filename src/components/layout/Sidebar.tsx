import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Users,
  Megaphone,
  Receipt,
  Package,
  Printer,
  GraduationCap,
  School,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rent', label: 'Rent', icon: Home },
  { path: '/salary', label: 'Salary', icon: Users },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/stock', label: 'Components', icon: Package },
  { path: '/3d-printing', label: '3D Printing', icon: Printer },
  { path: '/courses', label: 'Courses', icon: GraduationCap },
  { path: '/school', label: 'School', icon: School },
  { path: '/projects', label: 'Projects', icon: Briefcase },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-lg font-bold text-sidebar-primary-foreground">F</span>
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">FinanceHub</span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-lg font-bold text-sidebar-primary-foreground">F</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {/* User email */}
          {!collapsed && user && (
            <div className="px-3 py-2 text-xs text-sidebar-foreground/60 truncate">
              {user.email}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed ? 'justify-center' : ''
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
