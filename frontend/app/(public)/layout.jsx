'use client'

import { PublicRoute } from "../components/(ProtectedRoutes)/RouteGuards.jsx"

const page = ({ children }) => {
    return (
        <PublicRoute>
            {children}
        </PublicRoute>
    )
}

export default page;