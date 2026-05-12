'use client';

import { useRouter } from 'next/navigation';
import { Building2, Plus } from 'lucide-react';
import { useAuthContext } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const isAdmin = user?.role?.includes('admin') || user?.roles?.includes('admin');

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.first_name}!
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your practice today.
        </p>
      </div>

      {/* Admin — Create Firm CTA */}
      {isAdmin && (
        <Button
          onClick={() => router.push('/dashboard/firm/create')}
          className="bg-gray-900 hover:bg-amber-700 text-white font-medium transition-colors duration-200"
        >
          Create Firm
        </Button>
      )}
    </div>
  );
}
