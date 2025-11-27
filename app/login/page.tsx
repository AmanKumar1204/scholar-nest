'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

type LoginMethod = 'mobile' | 'email';
type UserType = 'student' | 'landlord';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') as UserType | null;
  
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('mobile');
  const [userType, setUserType] = useState<UserType>(preselectedType && (preselectedType === 'student' || preselectedType === 'landlord') ? preselectedType : 'student');
  
  // Mobile login states
  const [mobile, setMobile] = useState('');
  
  // Email login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Common states
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadCaptchaEnginge(6);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const refreshCaptcha = () => {
    if (isMounted) {
      // Small delay to ensure canvas is ready
      setTimeout(() => {
        loadCaptchaEnginge(6);
        setCaptchaInput('');
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate CAPTCHA
    if (!validateCaptcha(captchaInput)) {
      setError('Invalid CAPTCHA. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = loginMethod === 'mobile' 
        ? { mobile, userType, loginMethod: 'mobile' }
        : { email, password, userType, loginMethod: 'email' };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        // Use the userType from the API response (from database)
        let authenticatedUserType = data.user?.userType || 'student';
        
        // Handle legacy userType values for backwards compatibility
        if (authenticatedUserType === 'buyer') {
          authenticatedUserType = 'student';
        } else if (authenticatedUserType === 'agent' || authenticatedUserType === 'builder') {
          authenticatedUserType = 'landlord';
        }
        
        localStorage.setItem('userType', authenticatedUserType);
        // Redirect based on user type from database
        if (authenticatedUserType === 'student') {
          router.push('/user/properties');
        } else if (authenticatedUserType === 'landlord') {
          router.push('/properties/upload');
        } else {
          // Fallback redirect for any unexpected userType
          router.push('/user/properties');
        }
      } else {
        setError(data.error || 'Login failed');
        refreshCaptcha();
      }
    } catch {
      setError('An error occurred. Please try again.');
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
        </div>

        {/* User Type Toggle */}
        <div className="mb-6">
          <p className="text-gray-700 font-medium mb-3">Are you</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`toggle-btn ${
                userType === 'student' ? 'toggle-btn-active' : 'toggle-btn-inactive'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType('landlord')}
              className={`toggle-btn ${
                userType === 'landlord' ? 'toggle-btn-active' : 'toggle-btn-inactive'
              }`}
            >
              Landlord
            </button>
          </div>
        </div>

        {/* Login Method Toggle */}
        <div className="mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginMethod === 'mobile'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Mobile Number Input */}
          {loginMethod === 'mobile' && (
            <div className="mb-4">
              <input
                type="tel"
                placeholder="Enter Mobile No."
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                pattern="[0-9]{10}"
                required
                maxLength={10}
              />
            </div>
          )}

          {/* Email/Password Inputs */}
          {loginMethod === 'email' && (
            <>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          {/* CAPTCHA Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 flex items-center justify-center overflow-hidden" style={{ width: '140px', height: '45px' }}>
                <div style={{ fontSize: 0, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ transform: 'scale(0.65)', transformOrigin: 'center' }}>
                    <LoadCanvasTemplate reloadColor="red" />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="text-blue-500 hover:text-blue-600 flex items-center justify-center flex-shrink-0"
                title="Refresh CAPTCHA"
                style={{ width: '36px', height: '45px' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
                placeholder="Enter CAPTCHA"
                style={{ height: '45px' }}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Next Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-danger w-full"
          >
            {isSubmitting ? 'Please wait...' : 'Next'}
          </button>

          {/* Forgot Password & Need Help Links */}
          <div className="flex justify-between mt-3">
            {loginMethod === 'email' && (
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                Forgot Password?
              </button>
            )}
            <a
              href="#"
              className={`text-sm text-gray-600 hover:text-blue-600 transition-colors ${loginMethod === 'mobile' ? 'ml-auto' : ''}`}
            >
              Need help?
            </a>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            New to Scholar&apos;s Nest?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
