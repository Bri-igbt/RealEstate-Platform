'use client'

import React, { useState } from 'react'
import { adminLayoutStyles as s } from '@/assets/dummyStyles.js'
import Sidebar from '@/app/components/admin/Sidebar.jsx'
import DashboardNavbar from '@/app/components/admin/DashboardNavbar.jsx'
import { ProtectedRoute } from '@/app/components/(ProtectedRoutes)/RouteGuards.jsx'


const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className={s.layout}>
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <div className={s.mainWrapper}>
                    <DashboardNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className={s.mainContent}>
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default AdminLayout