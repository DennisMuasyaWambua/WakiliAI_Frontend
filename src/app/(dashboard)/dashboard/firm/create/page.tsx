'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Building2, ChevronDown, Mail, Phone, MapPin, User, ArrowLeft, Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { firmService } from '@/services/firm.service';
import { FIRM_TYPE_CHOICES, ROLE_CHOICES, FirmType } from '@/types/firm.types';

const createFirmSchema = z.object({
  firm_name: z.string().min(2, 'Firm name must be at least 2 characters'),
  firm_type: z.enum(['big_law', 'mid_size', 'system'] as const),
  firm_email: z.string().email('Enter a valid firm email address'),
  firm_phone: z.string().min(10, 'Enter a valid phone number'),
  firm_address: z.string().min(5, 'Enter a valid physical address'),
  owner_email: z.string().email('Enter a valid owner email address'),
  owner_role: z.number().min(1, 'Please select a role'),
});

type CreateFirmForm = z.infer<typeof createFirmSchema>;

export default function CreateFirmPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateFirmForm>({
    resolver: zodResolver(createFirmSchema),
    defaultValues: {
      firm_type: 'big_law',
      owner_role: 1,
    },
  });

  const selectedFirmType = watch('firm_type');
  const selectedOwnerRole = watch('owner_role');

  const availableRoles = useMemo(() => {
    return ROLE_CHOICES[selectedFirmType] || [];
  }, [selectedFirmType]);

  const onSubmit = async (data: CreateFirmForm) => {
    setIsSubmitting(true);
    try {
      await firmService.createFirm(data);
      toast.success('Firm created successfully!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to create firm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50">
          <h1 className="text-xl font-semibold text-gray-900">Establish Your Identity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide the official registered details for your law firm.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5">
          {/* Firm Name & Firm Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firm_name" className="text-sm font-medium text-gray-700">
                Firm Name
              </Label>
              <div className="relative">
                <Input
                  id="firm_name"
                  placeholder="Enter firm name"
                  className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                  {...register('firm_name')}
                />
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.firm_name && <p className="text-xs text-red-500">{errors.firm_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="firm_type" className="text-sm font-medium text-gray-700">
                Firm Type
              </Label>
              <div className="relative">
                <select
                  id="firm_type"
                  value={selectedFirmType}
                  onChange={(e) => {
                    const newType = e.target.value as FirmType;
                    setValue('firm_type', newType);
                    // Reset role to 1 when firm type changes
                    setValue('owner_role', 1);
                  }}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 pr-9 h-10"
                >
                  {FIRM_TYPE_CHOICES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.firm_type && <p className="text-xs text-red-500">{errors.firm_type.message}</p>}
            </div>
          </div>

          {/* Firm Email & Firm Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firm_email" className="text-sm font-medium text-gray-700">
                Firm Email
              </Label>
              <div className="relative">
                <Input
                  id="firm_email"
                  type="email"
                  placeholder="Enter firm email"
                  className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                  {...register('firm_email')}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.firm_email && <p className="text-xs text-red-500">{errors.firm_email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="firm_phone" className="text-sm font-medium text-gray-700">
                Firm Phone
              </Label>
              <div className="relative">
                <Input
                  id="firm_phone"
                  type="tel"
                  placeholder="Enter phone number"
                  className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                  {...register('firm_phone')}
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.firm_phone && <p className="text-xs text-red-500">{errors.firm_phone.message}</p>}
            </div>
          </div>

          {/* Owner Email & Owner Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="owner_email" className="text-sm font-medium text-gray-700">
                Owner Email
              </Label>
              <div className="relative">
                <Input
                  id="owner_email"
                  type="email"
                  placeholder="Enter owner email"
                  className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                  {...register('owner_email')}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.owner_email && <p className="text-xs text-red-500">{errors.owner_email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="owner_role" className="text-sm font-medium text-gray-700">
                Owner Role
              </Label>
              <div className="relative">
                <select
                  id="owner_role"
                  value={selectedOwnerRole}
                  onChange={(e) => setValue('owner_role', Number(e.target.value))}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 pr-9 h-10"
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <Briefcase className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.owner_role && <p className="text-xs text-red-500">{errors.owner_role.message}</p>}
            </div>
          </div>

          {/* Physical Address */}
          <div className="space-y-1.5">
            <Label htmlFor="firm_address" className="text-sm font-medium text-gray-700">
              Physical Address
            </Label>
            <div className="relative">
              <textarea
                id="firm_address"
                rows={3}
                placeholder="Enter firm address"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none"
                {...register('firm_address')}
              />
              <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-300" />
            </div>
            {errors.firm_address && <p className="text-xs text-red-500">{errors.firm_address.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-amber-700 text-white font-medium px-6 transition-colors duration-200"
            >
              {isSubmitting ? 'Creating...' : 'Create Firm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
