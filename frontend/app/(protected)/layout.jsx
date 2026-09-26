'use client'

import { ProtectedRoute } from "../components/(ProtectedRoutes)/RouteGuards.jsx"

export default function ProtectedLayout({ children }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}