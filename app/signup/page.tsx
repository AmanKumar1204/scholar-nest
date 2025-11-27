'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

type UserType = 'student' | 'landlord';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [userType, setUserType] = useState<UserType>('student');
  const [captchaInput, setCaptchaInput] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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

    // Validate terms agreement
    if (!agreeToTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    // Validate CAPTCHA
    if (!validateCaptcha(captchaInput)) {
      setError('Invalid CAPTCHA. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          mobile: countryCode + mobile,
          userType 
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Redirect to login page with userType parameter
        router.push(`/login?type=${userType}`);
      } else {
        setError(data.error || 'Signup failed');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">I am</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-2 text-gray-700">Student</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="landlord"
                  checked={userType === 'landlord'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-2 text-gray-700">Landlord</span>
              </label>
            </div>
          </div>

          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 outline-none focus:border-red-500 transition text-gray-900"
              placeholder="Name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 outline-none focus:border-red-500 transition text-gray-900"
              placeholder="Email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 outline-none focus:border-red-500 transition pr-16 text-gray-900"
              placeholder="Password"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-gray-400 text-sm hover:text-gray-600"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {/* Mobile Number Field */}
          <div className="relative flex items-center border-b border-gray-300 focus-within:border-red-500">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="py-3 pr-2 bg-transparent outline-none text-gray-900 text-sm cursor-pointer appearance-none"
            >
              <option value="+91">IND +91</option>
              <option value="+1">USA +1</option>
              <option value="+44">UK +44</option>
              <option value="+61">AUS +61</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="flex-1 px-4 py-3 outline-none text-gray-900"
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
              required
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              I agree to Magicbricks{' '}
              <a href="#" className="text-blue-600 hover:underline">
                T&C
              </a>
              ,{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              , &{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Cookie Policy
              </a>
            </label>
          </div>

          {/* CAPTCHA */}
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

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already registered?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-red-600 font-semibold hover:text-red-700"
            >
              Login Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
