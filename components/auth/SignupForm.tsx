'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth/client';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: '', color: '' };
    if (pass.length < 8) return { strength: 1, label: 'Too short', color: 'text-red-600' };
    
    let strength = 1;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'text-red-600' };
    if (strength <= 4) return { strength: 2, label: 'Fair', color: 'text-amber-600' };
    return { strength: 3, label: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must include uppercase, lowercase, and numbers');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start tracking your TikTok analytics
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength.strength === 1
                      ? 'w-1/3 bg-red-500'
                      : passwordStrength.strength === 2
                      ? 'w-2/3 bg-amber-500'
                      : 'w-full bg-green-500'
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#fe2c55] focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="••••••••"
              disabled={loading}
            />
            {confirmPassword && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                {password === confirmPassword ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password must contain:
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li className="flex items-center gap-2">
              <span className={password.length >= 8 ? 'text-green-500' : ''}>
                {password.length >= 8 ? '✓' : '○'}
              </span>
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span className={/[A-Z]/.test(password) ? 'text-green-500' : ''}>
                {/[A-Z]/.test(password) ? '✓' : '○'}
              </span>
              One uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className={/[a-z]/.test(password) ? 'text-green-500' : ''}>
                {/[a-z]/.test(password) ? '✓' : '○'}
              </span>
              One lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className={/[0-9]/.test(password) ? 'text-green-500' : ''}>
                {/[0-9]/.test(password) ? '✓' : '○'}
              </span>
              One number
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#fe2c55] to-[#7c3aed] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#fe2c55] hover:text-[#7c3aed] font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
