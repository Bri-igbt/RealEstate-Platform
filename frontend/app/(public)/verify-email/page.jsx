'use client'

import React, { Suspense, useState } from 'react'
import { verifyEmailStyles as s } from '@/assets/dummyStyles.js'
import Navbar from '@/app/components/commons/Navbar.jsx'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import API_URL from '@/config.js'

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState(emailFromParams);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-email`, {
        email,
        code,
      });
      if (res.data.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000)
      }

    } catch (error) {
      setError(
        error.response?.data?.message || "Verification failed. Please try again.",
      )
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={s.pageContainer}>
      <Navbar />
      <div className={s.containerCenter}>
        <div className={s.card}>
          <h2 className={s.title}>Verify Your Email</h2>
          <p className={s.subtitle}>
            Enter the 6-digit code sent to your email
          </p>

          {error && <div className={s.errorAlert}>{error}</div>}
          {success && <div className={s.successAlert}>{success}</div>}

          <form onSubmit={handleSubmit} className={s.form}>
            {!emailFromParams && (
              <div>
                <label className={s.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='name@company.com'
                  required
                  className={s.input}
                />
              </div>
            )}

            <div>
              <label className={s.label}>Verification Code</label>
              <input
                type="text"
                value={code}
                maxLength="6"
                onChange={(e) => setCode(e.target.value)}
                placeholder='123157'
                required
                className={s.input}
              />
            </div>

            <button type='submit' disabled={isLoading} className={s.submitButton}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}