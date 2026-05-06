'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: ['managing_partner'],
      employee_count: '0-50',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    // Convert employee_count to firm_type
    const firm_type: 'mid_size' | 'big_law' = data.employee_count === '0-50' ? 'mid_size' : 'big_law';
    
    // Remove employee_count and send only firm_type to backend
    const { employee_count, ...formData } = data;
    
    const requestData = {
      ...formData,
      firm_type,
      role: ['managing_partner'],
    };
    
    register(requestData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="w-full max-w-2xl relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ backgroundColor: '#D4AF37' }} />
        
        <div className="rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-2 pt-12 pb-8 px-12">
            <h1 className="text-3xl font-heading font-bold" style={{ color: '#1A1A1A' }}>
              Create Account
            </h1>
            <p className="text-sm" style={{ color: '#5F5E5E' }}>
              Register to get started with Wakili AI
            </p>
          </div>
          <div className="px-12 pb-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  First Name
                </Label>
                <Input
                  id="first_name"
                  {...registerField('first_name')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  {...registerField('last_name')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firm_name" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                Firm Name
              </Label>
              <Input
                id="firm_name"
                {...registerField('firm_name')}
                disabled={isPending}
                className="border-none h-12 rounded-md"
                style={{ backgroundColor: '#F4F3F1' }}
              />
              {errors.firm_name && (
                <p className="text-sm text-red-500">{errors.firm_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                Username
              </Label>
              <Input
                id="username"
                {...registerField('username')}
                disabled={isPending}
                className="border-none h-12 rounded-md"
                style={{ backgroundColor: '#F4F3F1' }}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                {...registerField('email')}
                disabled={isPending}
                className="border-none h-12 rounded-md"
                style={{ backgroundColor: '#F4F3F1' }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile_number" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  Mobile Number
                </Label>
                <Input
                  id="mobile_number"
                  {...registerField('mobile_number')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.mobile_number && (
                  <p className="text-sm text-red-500">{errors.mobile_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  ID Number
                </Label>
                <Input
                  id="id_number"
                  {...registerField('id_number')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.id_number && (
                  <p className="text-sm text-red-500">{errors.id_number.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_count" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                Number of Employees
              </Label>
              <select
                id="employee_count"
                {...registerField('employee_count')}
                disabled={isPending}
                className="flex h-12 w-full rounded-md border-none px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                style={{ backgroundColor: '#F4F3F1', color: '#1A1A1A' }}
              >
                <option value="0-50">0-50 Employees</option>
                <option value="more">More than 50 Employees</option>
              </select>
              {errors.employee_count && (
                <p className="text-sm text-red-500">{errors.employee_count.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...registerField('password')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-xs uppercase tracking-wide font-medium" style={{ color: '#5F5E5E' }}>
                  Confirm Password
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  {...registerField('confirm_password')}
                  disabled={isPending}
                  className="border-none h-12 rounded-md"
                  style={{ backgroundColor: '#F4F3F1' }}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full font-medium h-12 rounded-md uppercase tracking-wide text-sm border-none hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#1A1A1A', color: '#FAF9F6' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
              disabled={isPending}
            >
              {isPending ? 'Creating Account...' : 'Register'}
            </Button>

            <div className="text-center text-sm pt-2" style={{ color: '#5F5E5E' }}>
              Already have an account?{' '}
              <Link href="/login" className="hover:underline font-medium transition-all duration-200 hover:opacity-80" style={{ color: '#D4AF37' }}>
                Login
              </Link>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
