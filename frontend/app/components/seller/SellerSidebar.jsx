'use client'

import React from "react";
import { usePathname } from "next/navigation";
import { sellerSidebarStyles as s } from "@/assets/dummyStyles.js";
import { useAuth } from "@/context/AuthContext.jsx";
import Logo from "@/app/components/commons/Logo.jsx";
import {
    HiOutlineChartBar,
    HiOutlineChatAlt2,
    HiOutlineClipboardList,
    HiOutlineLogout,
    HiOutlineSupport,
    HiOutlineUser,
    HiOutlineViewGrid
} from "react-icons/hi";
import Link from "next/link";

const SellerSidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", icon: HiOutlineViewGrid, path: "/dashboard" },
        {
            name: "My Listings",
            icon: HiOutlineClipboardList,
            path: "/seller/my-properties",
        },
        { name: "Leads", icon: HiOutlineChartBar, path: "/inquiries" },
        { name: "Messages", icon: HiOutlineChatAlt2, path: "/seller/chat-messages" },
        { name: "Profile", icon: HiOutlineUser, path: "/profile" },
        { name: "Support", icon: HiOutlineSupport, path: "/seller/contact" },
    ];

    return (
        <>
            <div
                onClick={onClose}
                className={`${s.backdrop} ${isOpen ? s.backdropVisible : s.backdropHidden}`}
            />

            <aside className={`${s.sidebar} ${isOpen ? s.sidebarOpen : s.sidebarClosed}`}>
                <div className={s.logoContainer}>
                    <Logo fontSize="1.25rem" iconSize={20} />
                </div>

                <nav className={s.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={onClose}
                                className={`${s.navLink} ${isActive ? s.navLinkActive : s.navLinkInactive}`}
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

export default SellerSidebar