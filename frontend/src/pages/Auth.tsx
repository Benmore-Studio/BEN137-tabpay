import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Martini, ArrowRight, ArrowLeft } from 'lucide-react';
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
    setIsTransitioning(true);

    setTimeout(() => {
      setMode(newMode);
      resetForm();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
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
          navigate('/menu');
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
          navigate('/install');
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

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gold-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236d28d9' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Main content area */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card container with depth */}
          <div className="relative">
            {/* Card shadow/glow */}
            <div className="absolute -inset-2 bg-gradient-to-b from-primary-200/40 via-slate-200/50 to-gold-200/40 rounded-[2.5rem] blur-2xl opacity-70" />

            {/* Main card */}
            <div className="relative bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 overflow-hidden">
              {/* Card header with logo */}
              <div className="relative px-6 sm:px-8 pt-6 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                {/* Back link - top left corner */}
                <Link
                  to="/"
                  className="absolute top-3 left-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Home</span>
                </Link>

                {/* Logo and brand centered */}
                <div className="flex flex-col items-center pt-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 mb-2">
                    <Martini className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">TabPay</h1>
                </div>
              </div>

              {/* Form content */}
              <div className="px-6 sm:px-8 py-5">
                {/* Header text */}
                <div className="text-center mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    {isLogin ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {isLogin
                      ? 'Sign in to continue your experience'
                      : 'Join the fastest way to order'}
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="relative flex bg-slate-100 rounded-xl p-1 mb-5">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 ease-out ${
                      isLogin ? 'left-1' : 'left-[calc(50%+2px)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => mode !== 'login' && toggleMode()}
                    className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                      isLogin ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => mode !== 'register' && toggleMode()}
                    className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors z-10 ${
                      !isLogin ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Form fields container with fixed min-height to prevent jumping */}
                  <div
                    className={`transition-opacity duration-200 ease-out ${
                      isTransitioning ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Error message */}
                      {error && (
                        <div className="p-3 rounded-xl bg-red-50 ring-1 ring-red-100">
                          <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                      )}

                      {/* Register: Name fields */}
                      <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ease-out ${!isLogin ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <div>
                          <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              clearFieldError('firstName');
                            }}
                            tabIndex={isLogin ? -1 : 0}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all"
                          />
                          {fieldErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
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
                            tabIndex={isLogin ? -1 : 0}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all"
                          />
                          {fieldErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                          )}
                        </div>
                      </div>

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
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all"
                        />
                        {fieldErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                        )}
                      </div>

                      {/* Register: Phone */}
                      <div className={`transition-all duration-300 ease-out ${!isLogin ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            clearFieldError('phone');
                          }}
                          autoComplete="tel"
                          tabIndex={isLogin ? -1 : 0}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all"
                        />
                        {fieldErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                        )}
                      </div>

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
                          className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                        {fieldErrors.password && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                        )}
                      </div>

                      {/* Register: Password strength */}
                      <div className={`flex flex-wrap gap-3 transition-all duration-300 ease-out ${!isLogin && password ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        {[
                          { check: passwordStrength.hasLength, label: '8+ chars' },
                          { check: passwordStrength.hasNumber, label: 'Number' },
                          { check: passwordStrength.hasSpecial, label: 'Special' },
                        ].map(({ check, label }) => (
                          <div key={label} className="flex items-center gap-1.5 text-xs">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                                check ? 'bg-green-500' : 'bg-slate-200'
                              }`}
                            >
                              {check && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className={check ? 'text-slate-600' : 'text-slate-400'}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Register: Confirm password */}
                      <div className={`transition-all duration-300 ease-out ${!isLogin ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearFieldError('confirmPassword');
                          }}
                          autoComplete="new-password"
                          tabIndex={isLogin ? -1 : 0}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:outline-none transition-all"
                        />
                        {fieldErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                      </div>

                      {/* Login: Forgot password */}
                      <div className={`flex justify-end transition-all duration-300 ease-out ${isLogin ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <button
                          type="button"
                          tabIndex={isLogin ? 0 : -1}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Register: Terms */}
                      <div className={`transition-all duration-300 ease-out ${!isLogin ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <p className="text-xs text-slate-500 text-center">
                          By creating an account, you agree to our{' '}
                          <button type="button" tabIndex={isLogin ? -1 : 0} className="text-primary-600 hover:underline">
                            Terms
                          </button>
                          {' '}and{' '}
                          <button type="button" tabIndex={isLogin ? -1 : 0} className="text-primary-600 hover:underline">
                            Privacy Policy
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading || isTransitioning}
                    className="w-full relative group mt-6"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-xl opacity-75 blur group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all">
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
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100 hover:ring-slate-300 transition-all">
                    <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                      />
                    </svg>
                    <span className="text-slate-600 text-sm font-medium">Apple</span>
                  </button>
                  <button className="group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100 hover:ring-slate-300 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-slate-600 text-sm font-medium">Google</span>
                  </button>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-6 sm:px-8 py-3 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {isLogin ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Demo badge below card */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur ring-1 ring-slate-200/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-500">Demo Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
