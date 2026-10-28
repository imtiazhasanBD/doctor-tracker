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
import { toast } from 'sonner';

// ============================================================================
// 2. BRAND ASSETS & PIXEL-PERFECT SVG ILLUSTRATIONS
// ============================================================================

const DocTrackHeartLogo = ({ size = 38 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 44 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 select-none"
  >
    <defs>
      <linearGradient id="heartCyanGrad" x1="0" y1="0" x2="44" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#35C9E8" />
        <stop offset="55%" stopColor="#1BA8CE" />
        <stop offset="100%" stopColor="#1283B0" />
      </linearGradient>
      <filter id="heartDropShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284c7" floodOpacity="0.18" />
      </filter>
    </defs>
    <path
      filter="url(#heartDropShadow)"
      d="M22 37.5C22 37.5 3.5 26.2 3.5 13.2C3.5 6.8 8.5 2 14.5 2C18.1 2 20.8 3.9 22 6.2C23.2 3.9 25.9 2 29.5 2C35.5 2 40.5 6.8 40.5 13.2C40.5 26.2 22 37.5 22 37.5Z"
      fill="url(#heartCyanGrad)"
    />
    <path
      d="M6.5 19.5H14L16.8 11.5L20.5 27.5L24.2 15.2L26.5 21.5L28.5 19.5H37.5"
      stroke="white"
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

// Detailed 1:1 Clinic Scene & Friendly Male Doctor Illustration
const DoctorClinicIllustration = () => (
  <img
    src="/Cheerful Doctor in a Modern Clinic.png"
    alt="Doctor Clinic - Better Care, Better Management"
    className="w-full h-full object-contain object-right-bottom select-none pointer-events-none"
  />
);

// ============================================================================
// 3. MAIN PAGE COMPONENT
// ============================================================================
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Authentication integration using existing hook & backend
  const { login, isLoggingIn } = useAuth();

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
    <div className="h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-background select-none">
      {/* LEFT PANEL (~58.3% / 7 cols): HERO CONTENT + DOCTOR ILLUSTRATION */}
      <div className="hidden lg:flex lg:col-span-7 relative h-full overflow-hidden flex-col justify-between py-10 pl-12 pr-6 bg-gradient-to-br from-background via-muted/20 to-muted/50">

        {/* 1. TOP LEFT LOGO HEADER */}
        <div className="relative z-20 flex items-center gap-3">
          <DocTrackHeartLogo size={42} />
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

        {/* 2. MAIN HERO COPY & STATIC FEATURE ITEMS */}
        <div className="relative z-20 my-auto max-w-[350px]">
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

          {/* Static Feature Items */}
          <div className="mt-7 space-y-4">
            {/* Feature 1 */}
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

            {/* Feature 2 */}
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

            {/* Feature 3 */}
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

        {/* Bottom spacer to balance vertical alignment */}
        <div className="h-4" />

        {/* DOCTOR ILLUSTRATION (Positioned cleanly on the right/bottom) */}
        <div className="absolute bottom-0 right-0 w-[64%] h-[92%] z-10 flex items-end justify-end pointer-events-none">
          <DoctorClinicIllustration />
        </div>
      </div>

      {/* RIGHT PANEL (~41.7% / 5 cols): LOGIN PORTAL */}
      <div className="col-span-1 lg:col-span-5 h-full flex flex-col items-center justify-center p-6 sm:p-10 bg-background overflow-hidden">
        {/* CENTER LOGIN CARD CONTAINER */}
        <div className="w-full max-w-[420px] pt-6">
          <div className="relative rounded-md px-7 sm:px-9 pt-12 pb-9 bg-card border border-border shadow-lg">

            {/* Floating Top Center Heart Badge */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-[56px] h-[56px] rounded-[18px] flex items-center justify-center bg-card border border-border shadow-sm">
              <DocTrackHeartLogo size={28} />
            </div>

            {/* Brand Name & Admin Portal Subtitle */}
            <div className="text-center">
              <div className="inline-flex items-center text-[22px] font-bold tracking-tight leading-none">
                <span className="text-foreground">Doc</span>
                <span className="text-primary">Track</span>
              </div>
              <p className="text-[11.5px] font-medium mt-1 text-muted-foreground">
                Admin Portal
              </p>
            </div>

            {/* Welcome Back Heading */}
            <div className="text-center mt-5 mb-6">
              <h2 className="text-[21px] font-bold tracking-tight text-foreground">
                Welcome Back
              </h2>
              <p className="text-[12px] mt-1 font-normal text-muted-foreground">
                Please sign in to continue to your account
              </p>
            </div>

            {/* ============================================================ */}
            {/* LOGIN FORM (React Hook Form + Zod Validation)                */}
            {/* ============================================================ */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* EMAIL INPUT BOX */}
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

              {/* PASSWORD INPUT BOX */}
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

              {/* REMEMBER ME & FORGOT PASSWORD ROW */}
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

              {/* PRIMARY BLUE GRADIENT SIGN IN BUTTON */}
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