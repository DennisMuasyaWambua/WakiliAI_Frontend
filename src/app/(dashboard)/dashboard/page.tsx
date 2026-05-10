'use client';

import { useAuthContext } from '@/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <>
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
    </>
  );
}
