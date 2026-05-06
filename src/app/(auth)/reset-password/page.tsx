'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { useResetPassword } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const { mutate: resetPassword, isPending } = useResetPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md relative">
        {/* Gold vertical bar on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg z-10" />
        
        <Card className="border-none shadow-xl bg-card overflow-hidden ring-0">
          <CardHeader className="space-y-2 pt-12 pb-8 px-12">
            <CardTitle className="text-3xl font-heading font-bold text-foreground">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isPending}
                  className="bg-muted/30 border-none h-12 rounded-md"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium h-12 rounded-md uppercase tracking-wide text-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-300" 
                style={{ backgroundColor: '#1A1A1A', color: '#FAF9F6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
                disabled={isPending}
              >
                {isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium transition-all duration-200 hover:opacity-80">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
