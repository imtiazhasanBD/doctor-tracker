'use client';

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const DocTrackHeartLogo = ({
  size = 38,
  id = 'logoHeartGrad',
}: {
  size?: number;
  id?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 select-none"
  >
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00c6ff" />
        <stop offset="100%" stopColor="#0072ff" />
      </linearGradient>
    </defs>
    <path
      d="M20 35C20 35 6 25.5 6 15C6 9.5 10 5.5 15.5 5.5C18 5.5 20 7 20 7C20 7 22 5.5 24.5 5.5C30 5.5 34 9.5 34 15C34 25.5 20 35 20 35Z"
      fill={`url(#${id})`}
    />
    <path
      d="M10 17H15L17.5 11.5L21.5 22.5L24 15L26 17H30"
      stroke="#ffffff"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ManageDoctorsFeatureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3.2" stroke="var(--primary)" strokeWidth="1.7" />
    <path
      d="M3.5 18.5C3.5 15.7 5.9 13.8 9 13.8C12.1 13.8 14.5 15.7 14.5 18.5"
      stroke="var(--primary)"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="16.5" cy="8.5" r="2.3" stroke="var(--info)" strokeWidth="1.6" />
    <path
      d="M15.5 14C17.9 14.2 19.8 15.7 20.2 18"
      stroke="var(--info)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M9 14V17.5" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TrackPatientsFeatureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7.5" r="3.3" stroke="var(--primary)" strokeWidth="1.7" />
    <path
      d="M6 19C6 16 8.6 14 12 14C15.4 14 18 16 18 19"
      stroke="var(--primary)"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M17.5 6.5C19 7.2 20 8.7 20 10.5"
      stroke="var(--info)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M6.5 6.5C5 7.2 4 8.7 4 10.5"
      stroke="var(--info)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ClearInsightsFeatureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="13" width="3.5" height="6.5" rx="1" stroke="var(--primary)" strokeWidth="1.7" />
    <rect x="10.25" y="9" width="3.5" height="10.5" rx="1" stroke="var(--primary)" strokeWidth="1.7" />
    <rect x="16.5" y="5" width="3.5" height="14.5" rx="1" fill="var(--color-primary-10, rgba(37,99,235,0.1))" stroke="var(--primary)" strokeWidth="1.7" />
  </svg>
);

const DoctorClinicIllustration = () => (
  <>
    <img
      src="/Cheerful_Doctor_in_a_Modern_Clinic.png"
      alt="Doctor Clinic - Better Care, Better Management"
      className="w-full h-full object-contain object-right-bottom select-none pointer-events-none dark:hidden"
    />
    <img
      src="/Night_Mode_Doctor_Dashboard-Photoroom.png"
      alt="Night Mode Doctor Dashboard - Better Care, Better Management"
      className="w-full h-full object-contain object-right-bottom select-none pointer-events-none hidden dark:block"
    />
  </>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoggingIn, user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@doctortracker.dev',
      password: 'Admin@12345',
      rememberMe: true,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Signed in successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-12 bg-background select-none overflow-y-auto lg:overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="hidden lg:flex lg:col-span-7 relative h-full overflow-hidden flex-col justify-between py-10 pl-12 pr-6">
        <div className="relative z-20 flex items-center gap-3 pt-10">
          <DocTrackHeartLogo size={42} id="desktopDocTrackLogo" />
          <div>
            <div className="flex items-center text-[23px] font-bold tracking-tight leading-none">
              <span className="text-foreground">Doc</span>
              <span className="text-primary">Track</span>
            </div>
            <p className="text-[11.5px] font-medium tracking-tight mt-1 text-muted-foreground">
              Doctor Management System
            </p>
          </div>
        </div>

        <div className="relative z-20 my-auto max-w-[360px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2.5 text-muted-foreground">
            WELCOME TO DOCTRACK
          </p>

          <h1 className="text-[32px] xl:text-[36px] font-bold leading-[1.18] tracking-tight text-foreground">
            Manage Doctors
            Patients and Care
            in <span className="text-primary">One Place</span>
          </h1>

          <p className="mt-3.5 text-[13px] leading-relaxed text-muted-foreground">
            A simple and powerful admin portal to manage doctors, patients and hospital data efficiently.
          </p>

          <div className="mt-7 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 bg-card border border-border shadow-xs">
                <ManageDoctorsFeatureIcon />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold leading-tight text-foreground">
                  Manage Doctors
                </h3>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">
                  Profiles & schedules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 bg-card border border-border shadow-xs">
                <TrackPatientsFeatureIcon />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold leading-tight text-foreground">
                  Track Patients
                </h3>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">
                  Appointments & history
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 bg-card border border-border shadow-xs">
                <ClearInsightsFeatureIcon />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold leading-tight text-foreground">
                  Clear Insights
                </h3>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">
                  Real-time analytics
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-[64%] h-[92%] z-10 flex items-end justify-end pointer-events-none">
          <DoctorClinicIllustration />
        </div>
      </div>

      <div className="col-span-1 lg:col-span-5 min-h-screen lg:min-h-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-10 py-12 lg:py-0 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none lg:hidden" />
        <div className="w-full max-w-[420px] pt-6 sm:pt-4 relative z-10">
          <div className="relative rounded-2xl px-6 sm:px-9 pt-12 pb-8 sm:pb-9 bg-card border border-border shadow-xl">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-[58px] h-[58px] rounded-2xl flex items-center justify-center bg-card border border-border shadow-md">
              <DocTrackHeartLogo size={32} id="cardDocTrackLogo" />
            </div>

            <div className="text-center">
              <div className="inline-flex items-center text-[22px] font-bold tracking-tight leading-none">
                <span className="text-foreground">Doc</span>
                <span className="text-primary">Track</span>
              </div>
              <p className="text-[11.5px] font-medium mt-1 text-muted-foreground">
                Admin Portal
              </p>
            </div>

            <div className="text-center mt-5 mb-6">
              <h2 className="text-[21px] font-bold tracking-tight text-foreground">
                Welcome Back
              </h2>
              <p className="text-[12px] mt-1 font-normal text-muted-foreground">
                Please sign in to continue to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="email-input"
                  className={`group flex items-center gap-3.5 px-4 py-2.5 rounded-[14px] border transition-all cursor-text ${errors.email
                      ? 'border-destructive bg-destructive/10'
                      : 'border-input bg-secondary/50 focus-within:border-primary focus-within:bg-card focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]'
                    }`}
                >
                  <Mail className="w-[17px] h-[17px] shrink-0 text-muted-foreground" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10.5px] font-medium leading-tight text-muted-foreground">
                      Email address
                    </span>
                    <input
                      id="email-input"
                      {...register('email')}
                      type="email"
                      className="w-full bg-transparent text-[13px] font-medium outline-none mt-0.5 truncate text-foreground placeholder:text-muted-foreground"
                      placeholder="admin@doctortracker.dev"
                    />
                  </div>
                </label>
                {errors.email && (
                  <p className="text-[11px] text-destructive font-medium mt-1 pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password-input"
                  className={`group flex items-center gap-3.5 px-4 py-2.5 rounded-[14px] border transition-all cursor-text ${errors.password
                      ? 'border-destructive bg-destructive/10'
                      : 'border-input bg-secondary/50 focus-within:border-primary focus-within:bg-card focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]'
                    }`}
                >
                  <Lock className="w-[17px] h-[17px] shrink-0 text-muted-foreground" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10.5px] font-medium leading-tight text-muted-foreground">
                      Password
                    </span>
                    <input
                      id="password-input"
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-transparent text-[13px] font-semibold tracking-wider outline-none mt-0.5 text-foreground placeholder:text-muted-foreground"
                      placeholder="••••••••••"
                    />
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((s) => !s);
                    }}
                    className="p-1 rounded-md transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[17px] h-[17px]" />
                    ) : (
                      <Eye className="w-[17px] h-[17px]" />
                    )}
                  </button>
                </label>
                {errors.password && (
                  <p className="text-[11px] text-destructive font-medium mt-1 pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setValue('rememberMe', !rememberMe)}
                    className={`w-[16px] h-[16px] rounded-[5px] flex items-center justify-center transition-colors cursor-pointer ${rememberMe
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'border border-input bg-card'
                      }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span className="text-[12px] font-medium text-muted-foreground">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast.info('Password recovery link can be dispatched by your system administrator.')
                  }
                  className="text-[12px] font-semibold text-primary hover:text-primary/80 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-5 rounded-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[13.5px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}