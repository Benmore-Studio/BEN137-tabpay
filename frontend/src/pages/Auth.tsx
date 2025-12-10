import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Martini, ArrowRight } from 'lucide-react';
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register additional fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isLogin = mode === 'login';
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('left');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setConfirmPassword('');
    setError('');
    setFieldErrors({});
  };

  const toggleMode = () => {
    const newMode = isLogin ? 'register' : 'login';
    setTransitionDirection(isLogin ? 'right' : 'left');
    setIsTransitioning(true);

    // Wait for exit animation
    setTimeout(() => {
      setMode(newMode);
      resetForm();
      // Allow enter animation to start
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = 'Required';
    if (!lastName.trim()) errors.lastName = 'Required';
    if (!email.trim()) {
      errors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email';
    }
    if (!phone.trim()) errors.phone = 'Required';
    if (!password) {
      errors.password = 'Required';
    } else if (password.length < 8) {
      errors.password = 'Min 8 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords don\'t match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email.trim() || !password) {
        setError('Please enter your email and password');
        return;
      }

      setIsLoading(true);
      try {
        const success = await login({ email, password });
        if (success) {
          navigate('/venues');
        } else {
          setError('Invalid email or password');
        }
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!validateRegister()) return;

      setIsLoading(true);
      try {
        const success = await register({
          firstName,
          lastName,
          email,
          phone,
          password,
        });
        if (success) {
          navigate('/venues');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Password strength (for register mode)
  const passwordStrength = {
    hasLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-gold-500/15 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Content */}
      <div className="relative w-full max-w-md mx-4 sm:mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Glow behind logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-gold-500 rounded-2xl blur-xl opacity-50 scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-2xl ring-1 ring-white/20">
              <Martini className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">TabPay</h1>
          <p className="text-primary-200/80 text-sm">Casino ordering, reimagined</p>
        </div>

        {/* Card */}
        <div className="relative">
          {/* Card glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-gold-500/20 to-primary-500/20 rounded-[2rem] blur-xl opacity-50" />

          {/* Main card */}
          <div className="relative bg-white/[0.08] backdrop-blur-xl rounded-3xl p-8 ring-1 ring-white/10 shadow-2xl">
            {/* Gold accent bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 rounded-full shadow-lg shadow-gold-500/30" />

            {/* Header with transition */}
            <div className="text-center mb-6 overflow-hidden">
              <div
                key={mode + '-header'}
                className={`transform transition-all duration-300 ease-out ${
                  isTransitioning
                    ? `opacity-0 ${transitionDirection === 'right' ? '-translate-x-8' : 'translate-x-8'}`
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-white/50 text-sm">
                  {isLogin
                    ? 'Sign in to continue your experience'
                    : 'Join the fastest way to order'}
                </p>
              </div>
            </div>

            {/* Mode Toggle - Premium pill style */}
            <div className="relative flex bg-white/5 rounded-xl p-1 mb-6 ring-1 ring-white/10">
              {/* Animated background pill */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg transition-all duration-300 ease-out ${
                  isLogin ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              />
              <button
                type="button"
                onClick={() => mode !== 'login' && toggleMode()}
                className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                  isLogin ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => mode !== 'register' && toggleMode()}
                className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                  !isLogin ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Form content with transition */}
              <div
                className={`space-y-4 transform transition-all duration-300 ease-out ${
                  isTransitioning
                    ? `opacity-0 scale-95 ${transitionDirection === 'right' ? '-translate-x-4' : 'translate-x-4'}`
                    : 'opacity-100 scale-100 translate-x-0'
                }`}
              >
              {/* Error message */}
              {error && (
                <div className="p-3 rounded-xl bg-error-500/20 ring-1 ring-error-500/30 animate-scale-in">
                  <p className="text-sm text-error-200 font-medium">{error}</p>
                </div>
              )}

              {/* Register: Name fields */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearFieldError('firstName');
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                    />
                    {fieldErrors.firstName && (
                      <p className="text-error-400 text-xs mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearFieldError('lastName');
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                    />
                    {fieldErrors.lastName && (
                      <p className="text-error-400 text-xs mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                />
                {fieldErrors.email && (
                  <p className="text-error-400 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Register: Phone */}
              {!isLogin && (
                <div className="animate-fade-in">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearFieldError('phone');
                    }}
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                  />
                  {fieldErrors.phone && (
                    <p className="text-error-400 text-xs mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 text-white placeholder-white/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
                {fieldErrors.password && (
                  <p className="text-error-400 text-xs mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Register: Password strength */}
              {!isLogin && password && (
                <div className="flex flex-wrap gap-3 animate-fade-in">
                  {[
                    { check: passwordStrength.hasLength, label: '8+ chars' },
                    { check: passwordStrength.hasNumber, label: 'Number' },
                    { check: passwordStrength.hasSpecial, label: 'Special' },
                  ].map(({ check, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          check ? 'bg-success-500' : 'bg-white/10'
                        }`}
                      >
                        {check && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={check ? 'text-white/70' : 'text-white/30'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Register: Confirm password */}
              {!isLogin && (
                <div className="animate-fade-in">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError('confirmPassword');
                    }}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/30 ring-1 ring-white/10 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-error-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Login: Forgot password */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-300 hover:text-primary-200 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Register: Terms */}
              {!isLogin && (
                <p className="text-xs text-white/40 text-center">
                  By creating an account, you agree to our{' '}
                  <button type="button" className="text-primary-300 hover:underline">
                    Terms
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-primary-300 hover:underline">
                    Privacy Policy
                  </button>
                </p>
              )}
              </div>

              {/* Submit - Premium gradient button */}
              <button
                type="submit"
                disabled={isLoading || isTransitioning}
                className="w-full relative group mt-4"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-500 rounded-xl opacity-70 blur group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white font-semibold shadow-xl group-hover:from-primary-500 group-hover:to-primary-600 transition-all">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Social logins - Premium styling */}
            <div className="grid grid-cols-2 gap-3">
              <button className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition-all">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                  />
                </svg>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">Apple</span>
              </button>
              <button className="group relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-white/40 text-sm mt-8">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-primary-300 hover:text-primary-200 transition-colors"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>

        {/* Demo badge */}
        <div className="flex justify-center mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/40">Demo • Enter any credentials</span>
          </div>
        </div>
      </div>
    </div>
  );
}
