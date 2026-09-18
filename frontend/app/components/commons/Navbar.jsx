'use client'

import React, { useState } from 'react'
import { navbarStyles as s } from '@/assets/dummyStyles.js'
import Logo from './Logo.jsx'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext.jsx'
import Image from 'next/image'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const Navbar = () => {
    const {user, logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => setIsOpen(!isOpen);
    const navLinks = (
        <>
            {(!user || user.role !== "buyer") && (
                <Link 
                    href='/properties' 
                    className={s.navLink} 
                    onClick={() => setIsOpen(false)}
                >
                    Browse Properties
                </Link>
            )}

            {user && user.role === "buyer" && (
                <>
                    <Link 
                        href='/' 
                        className={s.navLink} 
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>

                    <Link 
                        href='/properties' 
                        className={s.navLink} 
                        onClick={() => setIsOpen(false)}
                    >
                        Property
                    </Link>

                    <Link 
                        href='/wishlist' 
                        className={s.navLink} 
                        onClick={() => setIsOpen(false)}
                    >
                        Wishlist
                    </Link>

                    <Link
                        href='/chat-messages'
                        className={s.navLink}
                        onClick={() => setIsOpen(false)}
                    >
                        Messages
                    </Link>

                    <Link
                        href='/contact'
                        className={s.navLink}
                        onClick={() => setIsOpen(false)}
                    >
                        Contact Us
                    </Link>
                </>
            )}

            {!user && (
                <>
                    <Link
                        href='/login'
                        className={s.navLink}
                        onClick={() => setIsOpen(false)}
                    >
                        Login
                    </Link>

                    <Link
                        href='/register'
                        className={s.navLink}
                        onClick={() => setIsOpen(false)}
                    >
                        Register
                    </Link>
                </>
            )}

            {user && user.role === "seller" && (
                <>
                    <Link
                        href='/dashboard'
                        className={s.navLink}
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </Link>
                </>
            )}

            {user && user.role === "admin" && (
                <>
                    <Link
                        href='/admin-dashboard'
                        className={s.navLink}
                        onClick={() => setIsOpen(false)}
                    >
                        Admin Panel
                    </Link>
                </>
            )}
        </>
    )

    return (
        <>
            <nav className={s.nav}>
                <div className={s.container}>
                    <div className={s.grid}>
                        <div className='justify-self-start'>
                            <Logo />
                        </div>
                        <div className={s.desktopMenu}>
                            {navLinks}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className={s.rightSection}>
                            {user ? (
                                <div className={s.userSection}>
                                    <Link href='/profile' className='flex items-center'>
                                        <Image 
                                            src={
                                                user.profilePic ||
                                                `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                                            }
                                            alt="Profile"
                                            className={s.avatar}
                                        />
                                    </Link>

                                    <button className={s.logoutButton} onClick={logout}>
                                        Logout
                                    </button>
                                </div>
                            ) : null}

                            {/* MOBILE VIEW */}
                            <div className={s.mobileToggle} onClick={toggleMenu}>
                                {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={s.backdrop(isOpen)} onClick={()=> setIsOpen(false)}></div>

            <div className={s.drawer(isOpen)}>
                <div className={s.drawerHeader}>
                    <Logo onClick={()=> setIsOpen(false)} />
                    <HiX
                        size={28}
                        className={s.drawerCloseIcon}
                        onClick={()=> setIsOpen(false)}
                    />
                </div>

                <div className={s.drawerNavLinks}>{navLinks}</div>

                {user && (
                    <div className={s.drawerUserSection}>
                        <div className={s.drawerUserInfo}>
                            <Image 
                                src={
                                    user.profilePic ||
                                    `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                                }
                                alt="Profile"
                                className={s.drawerAvatar} 
                            />

                            <div>
                                <div className={s.drawerUserName}>{user.name}</div>
                                <div className={s.drawerUserEmail}>{user.email}</div>
                            </div>
                        </div>

                        <button onClick={logout} className={s.drawerLogoutButton}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Navbar