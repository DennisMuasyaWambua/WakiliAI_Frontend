'use client';

import { Suspense, useState, useRef, KeyboardEvent } from 'react';
import { useLoginVerify } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  const { mutate: verifyOTP, isPending } = useLoginVerify();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email || !password) {
      router.push('/login');
    }
  }, [email, password, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus the last filled input or the next empty one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    const payload = {
      email: email!,
      password: password!,
      otp: otpString,
    };
    verifyOTP(payload as any);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="w-full max-w-md relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ backgroundColor: '#D4AF37' }} />
        
        <div className="rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-2 pt-12 pb-8 px-12">
            <h1 className="text-3xl font-heading font-bold" style={{ color: '#1A1A1A' }}>
              Verify OTP
            </h1>
            <p className="text-sm" style={{ color: '#5F5E5E' }}>
              Enter the 6-digit code sent to {email}
            </p>
          </div>
        <div className="px-12 pb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isPending}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none transition-all duration-200 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#F4F3F1',
                    color: '#1A1A1A',
                    border: digit ? '2px solid #D4AF37' : '2px solid transparent',
                    boxShadow: digit ? '0 0 0 1px #D4AF37' : 'none',
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full font-medium h-12 rounded-md uppercase tracking-wide text-sm hover:scale-[1.02] hover:shadow-md transition-all duration-300" 
              style={{ backgroundColor: '#1A1A1A', color: '#FAF9F6' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D4AF37';
                e.currentTarget.style.color = '#1A1A1A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1A';
                e.currentTarget.style.color = '#FAF9F6';
              }}
              disabled={isPending}
            >
              {isPending ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium transition-all duration-200 hover:underline"
                style={{ color: '#D4AF37' }}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
