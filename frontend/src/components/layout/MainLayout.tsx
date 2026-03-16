import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { LayoutDashboard, Wallet, BookOpen, CheckSquare, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Finance', href: '/finance', icon: Wallet },
  { name: 'Academic', href: '/academic', icon: BookOpen },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage = navigation.find(n => n.href === location.pathname)?.name || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <span className="text-lg font-bold tracking-tight text-primary">Finance & Schedule Hub</span>
        </div>
        <nav className="flex flex-1 flex-col p-4 gap-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.username || 'User'}</span>
              <span className="text-xs text-muted-foreground">{user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4 lg:px-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 lg:hidden" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{currentPage}</h1>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
