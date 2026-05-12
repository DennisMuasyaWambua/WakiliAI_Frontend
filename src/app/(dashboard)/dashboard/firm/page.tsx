'use client';

import { useRouter } from 'next/navigation';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FirmManagementPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Firm Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your law firm profile and settings.</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/firm/create')}
          className="bg-gray-900 hover:bg-amber-700 text-white font-medium gap-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Create Firm
        </Button>
      </div>

      {/* Placeholder — firm list will go here */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
          <Building2 className="h-7 w-7 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">No firm registered yet</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Create your firm profile to start managing cases, documents, and your team.
        </p>
        <Button
          onClick={() => router.push('/dashboard/firm/create')}
          className="mt-6 bg-gray-900 hover:bg-amber-700 text-white font-medium gap-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Create Firm
        </Button>
      </div>
    </div>
  );
}
