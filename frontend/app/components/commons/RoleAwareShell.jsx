'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext.jsx'

import { sellerLayoutStyles as s } from '@/assets/dummyStyles.js'
import SellerSidebar from '../seller/SellerSidebar.jsx';
import DashboardNavbar from '../admin/DashboardNavbar.jsx';
import Navbar from './Navbar.jsx';

const RoleAwareShell = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (user?.role === "seller") {
        return (
            <div className={s.container}>
                <SellerSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className={s.contentWrapper}>
                    <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className={s.main}>{children}</main>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default RoleAwareShell;