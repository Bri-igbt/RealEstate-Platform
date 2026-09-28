'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { adminSidebarStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import Logo from '@/app/components/commons/Logo.jsx'
import { HiOutlineChatAlt2, HiOutlineLibrary, HiOutlineLogout, HiOutlineMail, HiOutlineUserCircle, HiOutlineUsers, HiOutlineViewGrid } from 'react-icons/hi'
import Link from 'next/link'

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", icon: HiOutlineViewGrid, path: "/admin-dashboard" },
        { name: "Users", icon: HiOutlineUsers, path: "/admin/users" },
        { name: "Seller Requests", icon: HiOutlineUserCircle, path: "/admin/seller-requests" },
        { name: "Properties", icon: HiOutlineLibrary, path: "/admin/properties" },
        { name: "Inquiries", icon: HiOutlineChatAlt2, path: "/admin/inquiries" },
        { name: "Contact Inbox", icon: HiOutlineMail, path: "/admin/contacts" },
    ];

    return (
        <>
            {/* mobile-only dark overlay */}
            <div className={s.backdrop(isOpen)} onClick={onClose} />

            <aside className={s.sidebar(isOpen)}>
                <div className={s.logoContainer}>
                    <Logo fontSize='1.25rem' iconSize={20} />
                </div>

                <nav className={s.navContainer}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={onClose}
                                className={s.navLink(isActive)}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className={s.logoutContainer}>
                    <button
                        onClick={() => {
                            onClose();
                            logout();
                        }}
                        className={s.logoutButton}
                    >
                        <HiOutlineLogout size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar