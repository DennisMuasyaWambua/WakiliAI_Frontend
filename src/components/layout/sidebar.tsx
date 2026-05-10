'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Scale, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';

export function Sidebar() {
  const pathname = usePathname();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-border sticky top-0">
      {/* Logo Section */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-heading font-bold text-foreground">Wakili AI</span>
            <span className="text-xs text-muted-foreground">Legal Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigationConfig.sidebarNav.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {section.title}
                </h4>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-transform duration-200',
                          isActive ? 'scale-110' : 'group-hover:scale-110'
                        )}
                      />
                      <span className="flex-1">{item.title}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold',
                            isActive
                              ? 'bg-white text-primary'
                              : 'bg-primary text-white'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Footer Section - Logout */}
      <div className="p-4">
        <Button 
          onClick={() => logout()}
          disabled={isPending}
          variant="ghost"
          size="sm" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
        >
          <LogOut className="h-5 w-5" />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </Button>
      </div>
    </div>
  );
}