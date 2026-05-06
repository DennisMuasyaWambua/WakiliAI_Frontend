'use client';

import { useAuthContext } from '@/providers/auth-provider';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-heading font-bold text-foreground">Wakili AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.first_name} {user?.last_name}
              </span>
              <Button
                variant="outline"
                onClick={() => logout()}
                disabled={isPending}
                className="border-border hover:bg-accent hover:scale-[1.02] transition-all duration-300 hover:shadow-md"
              >
                {isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-foreground">
            Welcome back, {user?.first_name}!
          </h2>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your cases today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Profile Information</CardTitle>
              <CardDescription className="text-muted-foreground">Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="text-sm text-foreground">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                <p className="text-sm text-foreground">{user?.mobile_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Firm Type</p>
                <p className="text-sm text-foreground capitalize">
                  {user?.firm_type?.replace('_', ' ')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Quick Stats</CardTitle>
              <CardDescription className="text-muted-foreground">Overview of your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Active Cases</span>
                  <span className="text-2xl font-heading font-bold text-primary">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Pending Tasks</span>
                  <span className="text-2xl font-heading font-bold text-primary">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Upcoming Hearings</span>
                  <span className="text-2xl font-heading font-bold text-primary">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading">Getting Started</CardTitle>
              <CardDescription className="text-muted-foreground">Setup your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02] transition-all duration-300 hover:shadow-md" variant="default">
                  Create New Case
                </Button>
                <Button className="w-full border-border hover:bg-accent hover:scale-[1.02] transition-all duration-300 hover:shadow-sm hover:border-primary/50" variant="outline">
                  Upload Documents
                </Button>
                <Button className="w-full border-border hover:bg-accent hover:scale-[1.02] transition-all duration-300 hover:shadow-sm hover:border-primary/50" variant="outline">
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
