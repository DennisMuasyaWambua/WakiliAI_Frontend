'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [email, setEmail] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setEmail(data.email);
    login(data, {
      onSuccess: () => {
        // Navigate to OTP verification page with email and password
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="w-full max-w-md relative">
        {/* Gold vertical bar on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ backgroundColor: '#D4AF37' }} />
        
        <div className="rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-2 pt-12 pb-8 px-12">
            <h1 className="text-3xl font-heading font-bold" style={{ color: '#1A1A1A' }}>
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: '#5F5E5E' }}>
              Enter your credentials to access your account
            </p>
          </div>
          <div className="px-12 pb-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                    Password
                  </Label>
                  <Link
                    href="/reset-password"
                    className="text-xs hover:underline font-medium transition-all duration-200 hover:opacity-80 hover:scale-105"
                    style={{ color: '#D4AF37' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full font-medium h-12 rounded-md uppercase tracking-wide text-sm border-none hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#1A1A1A', color: '#FAF9F6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
                disabled={isPending}
              >
                {isPending ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm pt-2" style={{ color: '#5F5E5E' }}>
                Don't have an account?{' '}
                <Link href="/register" className="hover:underline font-medium transition-all duration-200 hover:opacity-80" style={{ color: '#D4AF37' }}>
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
