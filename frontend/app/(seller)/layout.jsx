'use client'

import React, { useState } from 'react'
import { sellerLayoutStyles as s } from '@/assets/dummyStyles.js'
import { useAuth } from '@/context/AuthContext.jsx'
import { usePathname } from 'next/navigation'
import DashboardNavbar from '@/app/components/admin/DashboardNavbar.jsx'
import PendingApproval from '@/app/components/seller/PendingApproval.jsx'
import { ProtectedRoute } from '@/app/components/(ProtectedRoutes)/RouteGuards.jsx'
import SellerSidebar from '@/app/components/seller/SellerSidebar.jsx'

const SellerLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const pathname = usePathname();

    // allow access to certain shared routes even for unapproved sellers
    const isPublicDashboardRoute = ['/contact', '/profile'].includes(pathname);

    return (
        <ProtectedRoute allowedRoles={["seller"]}>
            <div className={s.container}>
                <SellerSidebar 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <div className={s.contentWrapper}>
                    <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />

                    <main className={s.main}>
                        {user?.isApproved || isPublicDashboardRoute ? (
                            children
                        ) : (
                            <PendingApproval />
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default SellerLayout