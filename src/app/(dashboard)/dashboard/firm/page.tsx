'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, Plus, BadgeCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { firmService } from '@/services/firm.service';
import { Firm, FIRM_TYPE_CHOICES } from '@/types/firm.types';

function FirmInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border-2 border-amber-100 shadow-sm">
      <span className="text-2xl font-bold text-white">{initials}</span>
    </div>
  );
}

function FirmTypeBadge({ type }: { type: string }) {
  const label = FIRM_TYPE_CHOICES.find((c) => c.value === type)?.label ?? type;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-100">
      <BadgeCheck className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

function FirmCard({ firm }: { firm: Firm }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-5 p-8 border-b border-gray-50">
        {firm.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firm.logo}
            alt={`${firm.name} logo`}
            className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm"
          />
        ) : (
          <FirmInitials name={firm.name} />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900">{firm.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <FirmTypeBadge type={firm.firm_type} />
            {firm.is_active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoRow
            icon={<Mail className="w-4 h-4 text-gray-400" />}
            label="Email"
            value={firm.email}
          />
          <InfoRow
            icon={<Phone className="w-4 h-4 text-gray-400" />}
            label="Phone"
            value={firm.phone}
          />
          <InfoRow
            icon={<MapPin className="w-4 h-4 text-gray-400" />}
            label="Address"
            value={firm.address}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm mb-5">
        <Building2 className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">No Firm Registered</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        You haven&apos;t set up your law firm profile yet.
      </p>
    </div>
  );
}

export default function FirmManagementPage() {
  const [firm, setFirm] = useState<Firm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFirm = async () => {
      try {
        const response = await firmService.getFirm();
        if (response.success && response.data) {
          setFirm(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFirm();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading firm details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Firm Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {firm ? 'Your registered law firm details.' : 'Manage your law firm profile and settings.'}
          </p>
        </div>
      </div>

      {/* Content */}
      {error || !firm ? (
        <EmptyState />
      ) : (
        <FirmCard firm={firm} />
      )}
    </div>
  );
}
