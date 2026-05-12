'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Lock, Phone, UserCircle, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { onboardService } from '@/services/onboard.service';

const activateOwnerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  mobile_number: z.string().min(10, 'Enter a valid mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ActivateOwnerForm = z.infer<typeof activateOwnerSchema>;

export default function ActivateOwnerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      toast.error('Invalid activation link');
      router.push('/login');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateOwnerForm>({
    resolver: zodResolver(activateOwnerSchema),
  });

  const onSubmit = async (data: ActivateOwnerForm) => {
    if (!token) {
      toast.error('Invalid activation token');
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardService.activateOwner({ ...data, token });
      toast.success('Account activated successfully! Please log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to activate account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Validating activation link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-amber-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Activate Your Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete your profile to activate your owner account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Enter username"
                className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                {...register('username')}
              />
              <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <div className="relative">
                <Input
                  id="first_name"
                  placeholder="First name"
                  className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                  {...register('first_name')}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <div className="relative">
                <Input
                  id="last_name"
                  placeholder="Last name"
                  className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                  {...register('last_name')}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
              {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <Label htmlFor="mobile_number" className="text-sm font-medium text-gray-700">
              Mobile Number
            </Label>
            <div className="relative">
              <Input
                id="mobile_number"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                {...register('mobile_number')}
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
            {errors.mobile_number && <p className="text-xs text-red-500">{errors.mobile_number.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                {...register('password')}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type="password"
                placeholder="Confirm password"
                className="pr-9 border-gray-200 focus-visible:ring-amber-500"
                {...register('confirm_password')}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-amber-700 text-white font-medium transition-colors duration-200"
            >
              {isSubmitting ? 'Activating...' : 'Activate Account'}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">
            Already activated?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
