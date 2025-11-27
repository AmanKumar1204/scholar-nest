'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      loadCaptchaEnginge(6);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const refreshCaptcha = () => {
    if (isMounted) {
      setTimeout(() => {
        loadCaptchaEnginge(6);
        setCaptchaInput('');
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateCaptcha(captchaInput)) {
      setError('Invalid CAPTCHA. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(data.message);
        setEmail('');
        setCaptchaInput('');
      } else {
        setError(data.error || 'Something went wrong');
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
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-danger w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
