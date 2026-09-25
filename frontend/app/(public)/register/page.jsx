'use client'

import React, { useState } from 'react'
import { registerStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import Navbar from '@/app/components/commons/Navbar.jsx'
import { useRouter } from 'next/navigation'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import Link from 'next/link'

const RegisterPage = () => {
    const { register } = useAuth();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "buyer",
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        const result = await register(formData)
        if (result.success) {
            setSuccess("Registration successful! Redirecting to verification...");
            setTimeout(() => {
                router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
            }, 5000);
        } else {
            setError(result.message);
        }
        setIsLoading(false)
    }

    return (
        <div className={s.pageWrapper}>
            <Navbar />
            <div className={s.container}>
                <div className={s.formCard}>
                    <h2 className={s.heading}>Create Account</h2>
                    <p className={s.subheading}>Join our community to find or list properties</p>

                    {error && <div className={s.errorMessage}>{error}</div>}
                    {success && <div className={s.successMessage}>{success}</div>}

                    <form className={s.form} onSubmit={handleSubmit}>
                        <div>
                            <label className={s.label}>Full Name</label>
                            <input
                                type="text"
                                name='name'
                                placeholder='John Doe'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={s.input}
                            />
                        </div>

                        <div>
                            <label className={s.label}>Email Address</label>
                            <input
                                type="email"
                                name='email'
                                placeholder='example@mail.com'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={s.input}
                            />
                        </div>

                        <div>
                            <label className={s.label}>Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder='••••••••'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={s.input}
                                    style={{ paddingRight: "40px" }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#6b7280",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className='block mb-3 font-medium'>Select Roles</label>
                            <div className={s.roleContainer}>
                                <label className={`${s.roleLabelBase} ${
                                    formData.role === "buyer" 
                                        ? s.roleLabelActive 
                                        : s.roleLabelInactive
                                }`}>
                                    <input 
                                        type="radio"
                                        name='role'
                                        value="buyer"
                                        checked={formData.role === "buyer"}
                                        onChange={handleChange}
                                        className={s.hiddenRadio}
                                    />
                                    Buyer
                                </label>

                                <label className={`${s.roleLabelBase} ${formData.role === "seller"
                                        ? s.roleLabelActive
                                        : s.roleLabelInactive
                                    }`}>
                                    <input
                                        type="radio"
                                        name='role'
                                        value="seller"
                                        checked={formData.role === "seller"}
                                        onChange={handleChange}
                                        className={s.hiddenRadio}
                                    />
                                    Seller
                                </label>
                            </div>
                        </div>

                        <button
                            className={s.submitButton}
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account" : "Create Account"}
                        </button>
                    </form>

                    <p className={s.footerText}>
                        Already have an account{" "}
                        <Link href='/login' className={s.loginLink}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage