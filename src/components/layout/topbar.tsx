'use client';

import { Bell, Search, Menu, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/providers/auth-provider';
import { useLogout } from '@/hooks/useAuth';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuthContext();
  const { mutate: logout, isPending } = useLogout();

  const getInitials = () => {
    if (!user) return 'U';
    
    if (user.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return user.username?.substring(0, 2).toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return 'User';
    if (user.full_name) return user.full_name;
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.username || 'User';
  };

  const getRole = () => {
    if (!user) return 'User';
    const roles = user.roles || user.role;
    if (!roles || roles.length === 0) return 'User';
    return roles[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-white px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer for desktop - pushes items to right */}
      <div className="flex-1 hidden lg:block" />

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-accent">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <Settings className="h-5 w-5 text-foreground" />
        </Button>

        {/* User Profile with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 px-2 hover:bg-transparent">
              <div className="hidden md:flex md:flex-col md:items-end md:text-right">
                <span className="text-sm font-semibold text-foreground">
                  {getFullName()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getRole()}
                </span>
              </div>
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="" alt={getFullName()} />
                <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src="" alt={getFullName()} />
                  <AvatarFallback className="bg-primary text-white font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {getFullName()}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground font-medium">{getRole()}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              disabled={isPending}
              className="flex items-center cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-medium">{isPending ? 'Logging out...' : 'Logout'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
