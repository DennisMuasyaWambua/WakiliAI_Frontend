'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordConfirmSchema, ResetPasswordConfirmFormData } from '@/lib/validations/auth.schema';
import { useResetPasswordConfirm } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';

function ResetPasswordConfirmContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  
  const { mutate: confirmReset, isPending } = useResetPasswordConfirm(uid, token);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordConfirmFormData>({
    resolver: zodResolver(resetPasswordConfirmSchema),
  });

  const onSubmit = (data: ResetPasswordConfirmFormData) => {
    confirmReset(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md relative">
        {/* Gold vertical bar on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg z-10" />
        
        <Card className="border-none shadow-xl bg-card overflow-hidden ring-0">
          <CardHeader className="space-y-2 pt-12 pb-8 px-12">
            <CardTitle className="text-3xl font-heading font-bold text-foreground">
              Set New Password
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 pb-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new_password" className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  New Password
                </Label>
                <Input
                  id="new_password"
                  type="password"
                  {...register('new_password')}
                  disabled={isPending}
                  className="bg-muted/30 border-none h-12 rounded-md"
                />
                {errors.new_password && (
                  <p className="text-sm text-red-500">{errors.new_password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  {...register('confirm_password')}
                  disabled={isPending}
                  className="bg-muted/30 border-none h-12 rounded-md"
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
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
                {isPending ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <ResetPasswordConfirmContent />
    </Suspense>
  );
}
